from rest_framework import serializers
from .models import *
from UserDetail.models import *
from UserDetail.serializers import *


class CompanySerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format='%H:%M | %d-%m-%Y')
    class Meta:
        model = Company
        fields = '__all__'
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if 'teacher_id' in representation:
            teacher_data = User.objects.filter(user_id=representation['teacher_id']).first()
            teacher_name = teacher_data.name
            representation['teacher_name'] = teacher_name       

        if 'company_id' in representation:
            total_registrations = PlacmentRegistration.objects.filter(company_id=representation['company_id']).count()
            representation['total_registrations'] = total_registrations
        return representation

class StudentCompanySerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format='%H:%M | %d-%m-%Y')
    class Meta:
        model = Company
        fields = '__all__'
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if 'teacher_id' in representation:
            teacher_data = User.objects.filter(user_id=representation['teacher_id']).first()
            teacher_name = teacher_data.name
            representation['teacher_name'] = teacher_name       

        if 'company_id' in representation:
            student_id = self.context.get('student_id', None)
            student_registered = PlacmentRegistration.objects.filter(company_id=representation['company_id'], student_id=student_id).exists()
            representation['student_registered'] = student_registered
        return representation

class CompanyAnnouncementSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format='%H:%M | %d-%m-%Y')
    class Meta:
        model = CompanyAnnouncement
        fields = '__all__'

class StudentDashboardCompanyAnnouncementSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format='%H:%M | %d-%m-%Y')
    class Meta:
        model = CompanyAnnouncement
        fields = '__all__'
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if 'company_id' in representation:
            company_data = Company.objects.filter(company_id=representation['company_id']).first()
            teacher_name = User.objects.filter(user_id=company_data.teacher_id).first().name

            representation['teacher_name'] = teacher_name
            representation['company_name'] = company_data.company_name
        
        return representation

class PlacmentRegistrationSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format='%H:%M | %d-%m-%Y')
    class Meta:
        model = PlacmentRegistration
        fields = '__all__'
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        
        if 'student_id' in representation:
            student_data_obj = User.objects.filter(user_id=representation['student_id']).first()
            student_data = UserSerializer(student_data_obj).data
            representation['student_data'] = student_data

        return representation

class PlacementCellSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format='%H:%M | %d-%m-%Y')
    class Meta:
        model = PlacementCell
        fields = '__all__'
