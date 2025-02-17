from django.db import models


class Subject(models.Model):
    teacher_id = models.CharField(max_length=12)
    subject_id = models.CharField(max_length=12, unique=True)
    subject_name = models.CharField(max_length=255)
    YEAR_CHOICES = [
        ('first_year', 'First Year'),
        ('second_year', 'Second Year'),
        ('third_year', 'Third Year'),
        ('fourth_year', 'Fourth Year'),
        ('fifth_year', 'Fifth Year')
    ]
    college_year = models.CharField(max_length=20, choices=YEAR_CHOICES)

class Announcement(models.Model):
    announcement_id = models.CharField(max_length=12, unique=True)
    subject_id = models.CharField(max_length=12)
    text_content = models.TextField()
    attached_docs = models.BooleanField(default=False)
    document_paths = models.JSONField()

class Comment(models.Model):
    comment_id = models.CharField(max_length=12, unique=True)
    announcement_id = models.CharField(max_length=12)
    student_id = models.CharField(max_length=12)
    comment_content = models.TextField()

class Assignment(models.Model):
    assignment_id = models.CharField(max_length=12, unique=True)
    subject_id = models.CharField(max_length=12)
    document_paths = models.JSONField()
    text_content = models.TextField()
    all_submits = models.JSONField()

class Attendance(models.Model):
    attendance_id = models.CharField(max_length=12, unique=True)
    subject_id = models.CharField(max_length=12)
    code = models.CharField(max_length=6)
    attendance = models.JSONField()
