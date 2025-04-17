from django.contrib import admin
from .models import *

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('user_id', 'role', 'name', 'email', 'is_staff', 'id')
    search_fields = ('user_id', 'name', 'email', 'contact_number')
    list_filter = ('role',)

@admin.register(StudentHistory)
class StudentHistoryAdmin(admin.ModelAdmin):
    list_display = ( 'user_id', 'name', 'roll_no', 'year', 'division', 'academic_year', 'was_promoted')
    search_fields = ('user_id', 'name', 'roll_no', 'academic_year')
    list_filter = ('was_promoted', 'academic_year')
