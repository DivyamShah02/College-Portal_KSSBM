from django.db import models


class CurrentAcedemicManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(academic_year=get_current_academic_year())

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
    class_division = models.CharField(max_length=10)
    academic_year = models.CharField(max_length=9)
    created_at = models.DateTimeField(auto_now_add=True)

    objects = CurrentAcedemicManager()
    all_objects = models.Manager()

    def save(self, *args, **kwargs):
        if not self.academic_year:
            self.academic_year = get_current_academic_year()
        super().save(*args, **kwargs)

class Announcement(models.Model):
    announcement_id = models.CharField(max_length=12, unique=True)
    subject_id = models.CharField(max_length=12)
    teacher_id = models.CharField(max_length=12)
    college_year = models.CharField(max_length=20)
    class_division = models.CharField(max_length=10)
    text_content = models.TextField()
    attached_docs = models.BooleanField(default=False)
    document_paths = models.JSONField()
    academic_year = models.CharField(max_length=9)
    created_at = models.DateTimeField(auto_now_add=True)

    objects = CurrentAcedemicManager()
    all_objects = models.Manager() 

    def save(self, *args, **kwargs):
        if not self.academic_year:
            self.academic_year = get_current_academic_year()
        super().save(*args, **kwargs)

class Comment(models.Model):
    comment_id = models.CharField(max_length=12, unique=True)
    announcement_id = models.CharField(max_length=12)
    user_id = models.CharField(max_length=12)
    comment_content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

class Assignment(models.Model):
    assignment_id = models.CharField(max_length=12, unique=True)
    subject_id = models.CharField(max_length=12)
    teacher_id = models.CharField(max_length=12)
    college_year = models.CharField(max_length=20)
    class_division = models.CharField(max_length=10)
    text_content = models.TextField()
    attached_docs = models.BooleanField(default=False)
    document_paths = models.JSONField()
    all_submits = models.JSONField()
    deadline_date = models.DateTimeField(null=False)
    academic_year = models.CharField(max_length=9)
    created_at = models.DateTimeField(auto_now_add=True)

    objects = CurrentAcedemicManager()
    all_objects = models.Manager() 

    def save(self, *args, **kwargs):
        if not self.academic_year:
            self.academic_year = get_current_academic_year()
        super().save(*args, **kwargs)

class SubmittedAssignment(models.Model):
    assignment_id = models.CharField(max_length=12)
    student_id = models.CharField(max_length=12)
    text_content = models.TextField(null=True, blank=True)
    document_paths = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)

class Attendance(models.Model):
    attendance_id = models.CharField(max_length=12, unique=True)
    subject_id = models.CharField(max_length=12)
    teacher_id = models.CharField(max_length=12)
    college_year = models.CharField(max_length=20)
    class_division = models.CharField(max_length=10)
    code = models.CharField(max_length=6)
    academic_year = models.CharField(max_length=9)
    created_at = models.DateTimeField(auto_now_add=True)

    objects = CurrentAcedemicManager()
    all_objects = models.Manager() 

    def save(self, *args, **kwargs):
        if not self.academic_year:
            self.academic_year = get_current_academic_year()
        super().save(*args, **kwargs)

class MarkedAttendance(models.Model):
    attendance_id = models.CharField(max_length=12)
    student_id = models.CharField(max_length=12)

class AcademicYear(models.Model):
    year = models.CharField(max_length=9, unique=True)  # "2024-25"
    is_current = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if self.is_current:
            AcademicYear.objects.exclude(pk=self.pk).update(is_current=False)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.year

def get_current_academic_year():    
    return AcademicYear.objects.get(is_current=True).year

# <<< NEW CODE ADDED HERE >>>
class DailyTrackEntry(models.Model):
    entry_id = models.CharField(max_length=12, unique=True)
    teacher_id = models.CharField(max_length=12)
    date = models.DateField()
    activity_type = models.CharField(max_length=50)
    subject_id = models.CharField(max_length=12, null=True, blank=True)
    start_time = models.TimeField()
    end_time = models.TimeField()
    description = models.TextField()
    notes = models.TextField(null=True, blank=True)
    academic_year = models.CharField(max_length=9)
    created_at = models.DateTimeField(auto_now_add=True)

    objects = CurrentAcedemicManager()
    all_objects = models.Manager()

    def save(self, *args, **kwargs):
        if not self.academic_year:
            self.academic_year = get_current_academic_year()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.teacher_id} - {self.activity_type} on {self.date}"
