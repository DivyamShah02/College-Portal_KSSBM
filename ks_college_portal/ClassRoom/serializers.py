from rest_framework import serializers
from .models import *
from UserDetail.models import User
from UserDetail.serializers import UserSerializer


class SubjectSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format='%H:%M | %d-%m-%Y')
    class Meta:
        model = Subject
        fields = '__all__'
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)

        if 'college_year' in representation:
            representation['college_year'] = representation['college_year'].replace('_', ' ').title()

            student_counts = User.objects.filter(year=str(representation['college_year']).lower().replace(' ', '_'), division=representation['class_division']).count()
            representation['student_counts'] = student_counts

        return representation

class AnnouncementSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format='%H:%M | %d-%m-%Y')
    class Meta:
        model = Announcement
        fields = '__all__'
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        
        
        if 'subject_id' in representation:
            subject_data = Subject.objects.filter(subject_id=representation['subject_id']).first()
            teacher_id = subject_data.teacher_id
            teacher_data = User.objects.filter(user_id=teacher_id).first()
            teacher_name = teacher_data.name
            representation['teacher_name'] = teacher_name
            representation['subject_name'] = subject_data.subject_name
        
        if 'announcement_id' in representation:
            comment_data_obj = Comment.objects.filter(announcement_id=representation['announcement_id'])
            comment_data = CommentSerializer(comment_data_obj, many=True).data
            representation['comment_data'] = comment_data[::-1]

        return representation

class CommentSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format='%H:%M | %d-%m-%Y')
    class Meta:
        model = Comment
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        
        
        if 'user_id' in representation:
            user_data = User.objects.filter(user_id=representation['user_id']).first()
            user_name = user_data.name
            representation['user_name'] = user_name

        return representation

class AssignmentSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format='%H:%M | %d-%m-%Y')
    class Meta:
        model = Assignment
        fields = '__all__'

class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        if 'attendance_id' in representation:
            attendance_data_obj = MarkedAttendance.objects.filter(attendance_id=representation['attendance_id'])
            attendance_data = MarkedAttendanceSerializer(attendance_data_obj, many=True).data

            representation['attendance_data'] = attendance_data

        return representation

class FullDetailsAttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        
        if 'subject_id' in representation:
            subject_obj = Subject.objects.filter(subject_id=representation['subject_id']).first()
            subject_name = subject_obj.subject_name
            representation['subject_name'] = subject_name

            student_counts = User.objects.filter(year=str(subject_obj.college_year).lower().replace(' ', '_'), division=subject_obj.class_division).count()
            representation['student_counts'] = student_counts

        if 'attendance_id' in representation:
            attendance_data_obj = MarkedAttendance.objects.filter(attendance_id=representation['attendance_id'])
            attendance_data = MarkedAttendanceSerializer(attendance_data_obj, many=True).data

            representation['attendance_data'] = attendance_data

        return representation

class MarkedAttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = MarkedAttendance
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        
        if 'student_id' in representation:
            user_data_obj = User.objects.filter(user_id=representation['student_id'])
            user_data = UserSerializer(user_data_obj, many=True).data

            representation['student_name'] = user_data.name
            representation['user_data'] = user_data

        return representation
