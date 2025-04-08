from rest_framework import serializers
from .models import *
from UserDetail.models import *
from UserDetail.serializers import *


class Fest_WorkshopSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format='%H:%M | %d-%m-%Y')
    class Meta:
        model = Fest_Workshop
        fields = '__all__'
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if 'teacher_id' in representation:
            teacher_data = User.objects.filter(user_id=representation['teacher_id']).first()
            teacher_name = teacher_data.name
            representation['teacher_name'] = teacher_name       

        if 'event_id' in representation:
            total_registrations = EventRegistration.objects.filter(event_id=representation['event_id']).count()
            representation['total_registrations'] = total_registrations
        return representation

class StudentFest_WorkshopSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format='%H:%M | %d-%m-%Y')
    class Meta:
        model = Fest_Workshop
        fields = '__all__'
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if 'teacher_id' in representation:
            teacher_data = User.objects.filter(user_id=representation['teacher_id']).first()
            teacher_name = teacher_data.name
            representation['teacher_name'] = teacher_name       

        if 'event_id' in representation:
            student_id = self.context.get('student_id', None)
            student_registered = EventRegistration.objects.filter(event_id=representation['event_id'], student_id=student_id).exists()
            representation['student_registered'] = student_registered
        return representation

class EventAnnouncementSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format='%H:%M | %d-%m-%Y')
    class Meta:
        model = EventAnnouncement
        fields = '__all__'

class StudentDashboardEventAnnouncementSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format='%H:%M | %d-%m-%Y')
    class Meta:
        model = EventAnnouncement
        fields = '__all__'
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if 'event_id' in representation:
            event_data = Fest_Workshop.objects.filter(event_id=representation['event_id']).first()
            teacher_name = User.objects.filter(user_id=event_data.teacher_id).first().name

            representation['teacher_name'] = teacher_name
            representation['event_name'] = event_data.event_name
        
        return representation

class EventRegistrationSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format='%H:%M | %d-%m-%Y')
    class Meta:
        model = EventRegistration
        fields = '__all__'
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        
        if 'student_id' in representation:
            student_data_obj = User.objects.filter(user_id=representation['student_id']).first()
            student_data = UserSerializer(student_data_obj).data
            representation['student_data'] = student_data

        return representation
