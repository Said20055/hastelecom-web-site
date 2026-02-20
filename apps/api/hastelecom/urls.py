from django.contrib import admin
from django.urls import path
from drf_spectacular.views import SpectacularAPIView
from core import views

urlpatterns = [
    path('crm/admin/', admin.site.urls),
    path('crm/api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('crm/api/auth/login', views.LoginView.as_view()),
    path('crm/api/auth/refresh', views.RefreshView.as_view()),
    path('crm/api/auth/logout', views.LogoutView.as_view()),
    path('crm/api/users', views.UsersView.as_view()),
    path('crm/api/tickets', views.TicketsView.as_view()),
    path('crm/api/tickets/<int:pk>', views.TicketDetailView.as_view()),
    path('crm/api/tickets/<int:pk>/comments', views.TicketCommentView.as_view()),
    path('crm/api/public/tariffs', views.PublicTariffsView.as_view()),
    path('crm/api/public/announcements', views.PublicAnnouncementsView.as_view()),
    path('crm/api/public/tickets', views.PublicTicketView.as_view()),
]
