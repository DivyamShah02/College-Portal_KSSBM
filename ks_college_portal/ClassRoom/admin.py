from django.contrib import admin
from .models import *

@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ('id', 'teacher_id', 'subject_id', 'subject_name', 'college_year')
    search_fields = ('subject_name', 'college_year', 'teacher_id')
    list_filter = ('college_year',)

@admin.register(Announcement)
class AnnouncementAdmin(admin.ModelAdmin):
    list_display = ('id', 'announcement_id', 'subject_id', 'text_content', 'attached_docs', 'document_paths')
    search_fields = ('text_content', 'subject_id')
    list_filter = ('subject_id',)

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('id', 'comment_id', 'announcement_id', 'student_id', 'comment_content')
    search_fields = ('comment_content',)

@admin.register(Assignment)
class AssignmentAdmin(admin.ModelAdmin):
    list_display = ('id', 'assignment_id', 'subject_id', 'document_paths', 'text_content', 'all_submits')
    search_fields = ('text_content',)
    list_filter = ('subject_id',)

@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ('id', 'attendance_id', 'subject_id', 'code', 'attendance')
    search_fields = ('code',)
    list_filter = ('subject_id',)
