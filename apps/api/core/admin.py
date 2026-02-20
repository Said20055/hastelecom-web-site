from django.contrib import admin
from .models import User, Ticket, TicketComment, TicketHistory, Tariff, Announcement

admin.site.register(User)
admin.site.register(Ticket)
admin.site.register(TicketComment)
admin.site.register(TicketHistory)
admin.site.register(Tariff)
admin.site.register(Announcement)
