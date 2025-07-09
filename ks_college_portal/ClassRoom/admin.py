from django.contrib import admin
from .models import *

@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ('id', 'teacher_id', 'subject_id', 'subject_name', 'college_year')
    search_fields = ('subject_name', 'college_year', 'teacher_id')
    list_filter = ('college_year',)
    
    def get_queryset(self, request):        
        return Subject.all_objects.all()
    
@admin.register(Announcement)
class AnnouncementAdmin(admin.ModelAdmin):
    list_display = ('id', 'announcement_id', 'subject_id', 'text_content', 'attached_docs', 'document_paths')
    search_fields = ('text_content', 'subject_id')
    list_filter = ('subject_id',)

    def get_queryset(self, request):        
        return Announcement.all_objects.all()

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('id', 'comment_id', 'announcement_id', 'user_id', 'comment_content')
    search_fields = ('comment_content',)

@admin.register(Assignment)
class AssignmentAdmin(admin.ModelAdmin):
    list_display = ('id', 'assignment_id', 'subject_id', 'document_paths', 'text_content', 'all_submits')
    search_fields = ('text_content',)
    list_filter = ('subject_id',)

    def get_queryset(self, request):        
        return Assignment.all_objects.all()

@admin.register(SubmittedAssignment)
class SubmittedAssignmentAdmin(admin.ModelAdmin):
    list_display = ('id', 'assignment_id', 'student_id', 'text_content', 'document_paths', 'created_at')
    search_fields = ('text_content', 'student_id', 'assignment_id')

@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ('id', 'attendance_id', 'subject_id', 'code')
    search_fields = ('code',)
    list_filter = ('subject_id',)

    def get_queryset(self, request):        
        return Attendance.all_objects.all()

@admin.register(MarkedAttendance)
class MarkedAttendanceAdmin(admin.ModelAdmin):
    list_display = ('id', 'attendance_id', 'student_id')
    search_fields = ('attendance_id',)

@admin.register(AcademicYear)
class AcademicYearAdmin(admin.ModelAdmin):
    list_display = ('id', 'year', 'is_current')
    search_fields = ('year',)

# <<< NEW CODE ADDED HERE >>>
@admin.register(DailyTrackEntry)
class DailyTrackEntryAdmin(admin.ModelAdmin):
    list_display = ('entry_id', 'teacher_id', 'date', 'activity_type', 'subject_id', 'start_time', 'end_time')
    search_fields = ('teacher_id', 'activity_type', 'subject_id')
    list_filter = ('date', 'activity_type')

    def get_queryset(self, request):
        return DailyTrackEntry.all_objects.all()
