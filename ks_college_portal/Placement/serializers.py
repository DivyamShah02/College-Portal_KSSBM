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
        return representation

class CompanyAnnouncementSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format='%H:%M | %d-%m-%Y')
    class Meta:
        model = CompanyAnnouncement
        fields = '__all__'

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
