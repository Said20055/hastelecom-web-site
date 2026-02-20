from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class Role(models.TextChoices):
        USER = 'user'
        OPERATOR = 'operator'
        TECH = 'tech'

    username = None
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.USER)
    name = models.CharField(max_length=255)
    createdAt = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []


class Ticket(models.Model):
    class Type(models.TextChoices):
        CONNECT = 'connect'
        SUPPORT = 'support'
        INTERNAL = 'internal'

    class Status(models.TextChoices):
        NEW = 'new'
        IN_PROGRESS = 'in_progress'
        WAITING = 'waiting'
        DONE = 'done'
        CLOSED = 'closed'
        CANCELED = 'canceled'

    class Priority(models.TextChoices):
        LOW = 'low'
        MEDIUM = 'medium'
        HIGH = 'high'
        URGENT = 'urgent'

    type = models.CharField(max_length=20, choices=Type.choices)
    address = models.CharField(max_length=255)
    contactName = models.CharField(max_length=255)
    phone = models.CharField(max_length=30)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.NEW)
    priority = models.CharField(max_length=20, choices=Priority.choices, default=Priority.MEDIUM)
    createdBy = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tickets_created')
    assignedTo = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='tickets_assigned')
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)


class TicketComment(models.Model):
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField()
    createdAt = models.DateTimeField(auto_now_add=True)


class TicketHistory(models.Model):
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE, related_name='history')
    actor = models.ForeignKey(User, on_delete=models.CASCADE)
    action = models.CharField(max_length=255)
    fromStatus = models.CharField(max_length=20, blank=True)
    toStatus = models.CharField(max_length=20, blank=True)
    meta = models.JSONField(default=dict)
    createdAt = models.DateTimeField(auto_now_add=True)


class Tariff(models.Model):
    class Type(models.TextChoices):
        HOME = 'home'
        BUSINESS = 'business'

    title = models.CharField(max_length=255)
    speedMbps = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    type = models.CharField(max_length=20, choices=Type.choices)
    features = models.JSONField(default=list)
    isFeatured = models.BooleanField(default=False)
    isActive = models.BooleanField(default=True)


class Announcement(models.Model):
    class Level(models.TextChoices):
        INFO = 'info'
        WARN = 'warn'
        CRITICAL = 'critical'

    class Placement(models.TextChoices):
        TOP = 'top'
        HOMEPAGE = 'homepage'

    title = models.CharField(max_length=255)
    body = models.TextField()
    level = models.CharField(max_length=20, choices=Level.choices, default=Level.INFO)
    startsAt = models.DateTimeField()
    endsAt = models.DateTimeField()
    isActive = models.BooleanField(default=True)
    placement = models.CharField(max_length=20, choices=Placement.choices, default=Placement.HOMEPAGE)
