from django.contrib import admin
from .models import *

# Register your models here.
@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ('id', 'company_name', 'description', 'website', 'job_role')
    search_fields = ('company_name', 'job_role')
    list_filter = ('job_role',)

@admin.register(CompanyAnnouncement)
class CompanyAnnouncementAdmin(admin.ModelAdmin):
    list_display = ('id', 'company_announcement_id', 'company_id')
    search_fields = ('announcement_content', 'company_id')

@admin.register(PlacmentRegistration)
class PlacmentRegistrationAdmin(admin.ModelAdmin):
    list_display = ('id', 'registration_id', 'company_id', 'student_id')
    search_fields = ('company_id', 'student_id')

@admin.register(PlacementCell)
class PlacementCellAdmin(admin.ModelAdmin):
    list_display = ('id', 'student_id', 'screenshot_path')
    search_fields = ('student_id', 'screenshot_path')
