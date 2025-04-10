from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('teacher', 'Teacher'),        
        ('student', 'Student'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    user_id = models.CharField(max_length=12, unique=True)  # Ensure user_id is unique
    name = models.CharField(max_length=255)
    contact_number = models.CharField(max_length=15)
    roll_no = models.CharField(max_length=10, null=True, blank=True)
    year = models.CharField(max_length=20, null=True, blank=True)
    division = models.CharField(max_length=5, null=True, blank=True)
    city = models.CharField(max_length=255, null=True, blank=True)
    state = models.CharField(max_length=255, null=True, blank=True)


class StudentHistory(models.Model):
    user_id = models.CharField(max_length=12)
    name = models.CharField(max_length=255)
    roll_no = models.CharField(max_length=10)
    year = models.CharField(max_length=20)
    division = models.CharField(max_length=5)
    city = models.CharField(max_length=255, null=True, blank=True)
    state = models.CharField(max_length=255, null=True, blank=True)
    academic_year = models.CharField(max_length=9)
    was_promoted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
