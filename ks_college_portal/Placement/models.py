from django.db import models
from ClassRoom.models import get_current_academic_year, CurrentAcedemicManager

# Create your models here.
class Company(models.Model):
    company_id = models.CharField(max_length=12, unique=True)
    teacher_id = models.CharField(max_length=12)
    company_name = models.CharField(max_length=255)
    description = models.TextField()
    website = models.CharField(max_length=255)
    job_role = models.TextField()
    notes = models.TextField()
    internship_duration = models.CharField(max_length=255)
    internship_stipend = models.CharField(max_length=255)
    estimated_package = models.CharField(max_length=255)
    academic_year = models.CharField(max_length=9)
    created_at = models.DateTimeField(auto_now_add=True)

    objects = CurrentAcedemicManager()
    all_objects = models.Manager()
    
    def save(self, *args, **kwargs):
        if not self.academic_year:
            self.academic_year = get_current_academic_year()
        super().save(*args, **kwargs)


class CompanyAnnouncement(models.Model):
    company_announcement_id = models.CharField(max_length=12, unique=True)
    company_id = models.CharField(max_length=12)
    announcement_content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

class PlacmentRegistration(models.Model):
    registration_id = models.CharField(max_length=12, unique=True)
    company_id = models.CharField(max_length=12)
    student_id = models.CharField(max_length=12)
    created_at = models.DateTimeField(auto_now_add=True)

class PlacementCell(models.Model):
    student_id = models.CharField(max_length=12)
    screenshot_path = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
