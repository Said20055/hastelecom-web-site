from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from core.models import Announcement, Tariff, User


class Command(BaseCommand):
    help = 'Seed data'

    def handle(self, *args, **options):
        User.objects.update_or_create(
            email='operator@has.local',
            defaults={'name': 'Operator', 'role': 'operator'},
        )
        op = User.objects.get(email='operator@has.local')
        op.set_password('Operator123!')
        op.save()

        User.objects.update_or_create(
            email='tech@has.local',
            defaults={'name': 'Tech', 'role': 'tech'},
        )
        tech = User.objects.get(email='tech@has.local')
        tech.set_password('Tech123!')
        tech.save()

        for i in range(1, 6):
            Tariff.objects.update_or_create(
                title=f'Tariff {i}',
                defaults={
                    'speedMbps': i * 100,
                    'price': i * 500,
                    'type': 'home' if i < 4 else 'business',
                    'features': [f'Feature {i}', '24/7 support'],
                    'isFeatured': i == 3,
                    'isActive': True,
                },
            )

        now = timezone.now()
        for i, level in enumerate(['info', 'warn', 'critical'], 1):
            Announcement.objects.update_or_create(
                title=f'Announcement {i}',
                defaults={
                    'body': f'Important message {i}',
                    'level': level,
                    'startsAt': now - timedelta(days=1),
                    'endsAt': now + timedelta(days=7),
                    'isActive': True,
                    'placement': 'homepage',
                },
            )
        self.stdout.write(self.style.SUCCESS('Seed completed'))
