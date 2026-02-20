from django.utils import timezone
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User, Ticket, TicketComment, TicketHistory, Tariff, Announcement
from .permissions import OperatorPermission
from .rate_limit import InMemoryRateLimit
from .serializers import (
    AnnouncementSerializer,
    TariffSerializer,
    TicketCommentSerializer,
    TicketSerializer,
    UserSerializer,
)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = User.objects.filter(email=email).first()
        if not user or not user.check_password(password):
            return Response({'detail': 'Invalid credentials'}, status=400)
        refresh = RefreshToken.for_user(user)
        response = Response({'access': str(refresh.access_token), 'user': UserSerializer(user).data})
        response.set_cookie('refresh_token', str(refresh), httponly=True, samesite='Lax', path='/crm/api/auth/')
        return response


class RefreshView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        token = request.COOKIES.get('refresh_token')
        if not token:
            return Response({'detail': 'No refresh token'}, status=401)
        try:
            refresh = RefreshToken(token)
            refresh.blacklist()
            new_refresh = RefreshToken.for_user(User.objects.get(id=refresh['user_id']))
        except Exception:
            return Response({'detail': 'Invalid token'}, status=401)
        response = Response({'access': str(new_refresh.access_token)})
        response.set_cookie('refresh_token', str(new_refresh), httponly=True, samesite='Lax', path='/crm/api/auth/')
        return response


class LogoutView(APIView):
    def post(self, request):
        response = Response({'ok': True})
        response.delete_cookie('refresh_token', path='/crm/api/auth/')
        return response


class UsersView(APIView):
    permission_classes = [OperatorPermission]

    def get(self, request):
        return Response(UserSerializer(User.objects.all(), many=True).data)


class TicketsView(APIView):
    def get(self, request):
        qs = Ticket.objects.all().order_by('-createdAt')
        role = request.user.role
        if role == 'tech':
            qs = qs.filter(assignedTo=request.user)
        elif role == 'user':
            qs = qs.filter(createdBy=request.user)
        return Response(TicketSerializer(qs, many=True).data)

    def post(self, request):
        serializer = TicketSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(createdBy=request.user)
        return Response(serializer.data, status=201)


class TicketDetailView(APIView):
    def get_object(self, request, pk):
        ticket = Ticket.objects.get(pk=pk)
        if request.user.role == 'operator':
            return ticket
        if request.user.role == 'tech' and ticket.assignedTo_id == request.user.id:
            return ticket
        if request.user.role == 'user' and ticket.createdBy_id == request.user.id:
            return ticket
        return None

    def get(self, request, pk):
        ticket = self.get_object(request, pk)
        if not ticket:
            return Response(status=403)
        return Response(TicketSerializer(ticket).data)

    def patch(self, request, pk):
        ticket = self.get_object(request, pk)
        if not ticket:
            return Response(status=403)
        old_status = ticket.status
        role = request.user.role
        if role == 'user':
            if request.data.get('status') != 'canceled':
                return Response({'detail': 'User can only cancel own tickets'}, status=403)
        if role == 'tech' and 'priority' in request.data:
            return Response({'detail': 'Tech cannot change priority'}, status=403)
        serializer = TicketSerializer(ticket, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        if old_status != serializer.instance.status:
            TicketHistory.objects.create(
                ticket=ticket,
                actor=request.user,
                action='status_changed',
                fromStatus=old_status,
                toStatus=serializer.instance.status,
                meta={'source': 'api'},
            )
        return Response(serializer.data)


class TicketCommentView(APIView):
    def post(self, request, pk):
        ticket = Ticket.objects.get(pk=pk)
        if request.user.role == 'tech' and ticket.assignedTo_id != request.user.id:
            return Response(status=403)
        if request.user.role == 'user' and ticket.createdBy_id != request.user.id:
            return Response(status=403)
        serializer = TicketCommentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(ticket=ticket, author=request.user)
        return Response(serializer.data, status=201)


class PublicTariffsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        if not InMemoryRateLimit.check(f"tariffs:{request.META.get('REMOTE_ADDR')}"):
            return Response({'detail': 'Rate limited'}, status=429)
        qs = Tariff.objects.filter(isActive=True)
        return Response(TariffSerializer(qs, many=True).data)


class PublicAnnouncementsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        if not InMemoryRateLimit.check(f"ann:{request.META.get('REMOTE_ADDR')}"):
            return Response({'detail': 'Rate limited'}, status=429)
        now = timezone.now()
        qs = Announcement.objects.filter(isActive=True, startsAt__lte=now, endsAt__gte=now)
        return Response(AnnouncementSerializer(qs, many=True).data)


class PublicTicketView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        if not InMemoryRateLimit.check(f"public_ticket:{request.META.get('REMOTE_ADDR')}", limit=5, window=60):
            return Response({'detail': 'Rate limited'}, status=429)
        data = request.data.copy()
        data.setdefault('type', 'connect')
        data.setdefault('priority', 'medium')
        data.setdefault('status', 'new')
        user, _ = User.objects.get_or_create(
            email='public@has.local',
            defaults={'name': 'Public Client', 'role': 'user'},
        )
        serializer = TicketSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save(createdBy=user)
        return Response(serializer.data, status=201)
