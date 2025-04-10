from django.contrib import admin
from .models import *

# Register your models here.
@admin.register(Fest_Workshop)
class Fest_WorkshopAdmin(admin.ModelAdmin):
    list_display = ('id', 'event_name', 'description')
    search_fields = ('event_name',)

    def get_queryset(self, request):
        return Fest_Workshop.all_objects.all()

@admin.register(EventAnnouncement)
class EventAnnouncementAdmin(admin.ModelAdmin):
    list_display = ('id', 'company_announcement_id', 'event_id')
    search_fields = ('announcement_content', 'event_id')

@admin.register(EventRegistration)
class EventRegistrationAdmin(admin.ModelAdmin):
    list_display = ('id', 'registration_id', 'event_id', 'student_id')
    search_fields = ('event_id', 'student_id')
