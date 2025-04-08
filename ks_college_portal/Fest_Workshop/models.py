from django.db import models

# Create your models here.
class Fest_Workshop(models.Model):
    event_id = models.CharField(max_length=12, unique=True)
    event_type = models.CharField(max_length=10)
    teacher_id = models.CharField(max_length=12)
    event_name = models.CharField(max_length=255)
    description = models.TextField()
    notes = models.TextField()
    event_duration = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

class EventAnnouncement(models.Model):
    company_announcement_id = models.CharField(max_length=12, unique=True)
    event_id = models.CharField(max_length=12)
    announcement_content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

class EventRegistration(models.Model):
    registration_id = models.CharField(max_length=12, unique=True)
    event_id = models.CharField(max_length=12)
    student_id = models.CharField(max_length=12)
    created_at = models.DateTimeField(auto_now_add=True)
