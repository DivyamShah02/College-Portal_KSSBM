from rest_framework.response import Response
from rest_framework import status
from rest_framework import viewsets
from rest_framework.exceptions import NotFound, ParseError

from django.conf import settings
from django.shortcuts import get_object_or_404, render, redirect
from django.contrib.auth import authenticate, login, logout

from .serializers import *
from .models import *
from Placement.models import *
from Placement.serializers import *

import os
import random
import string
import boto3
import base64
from botocore.exceptions import NoCredentialsError
from datetime import datetime, timedelta


logger = None


class TeacherTemplateViewSet(viewsets.ViewSet):
    def create(self, request):
        try:
            user = request.user
            if not user.is_authenticated:
                return Response(
                        {
                            "success": False,
                            "user_not_logged_in": True,
                            "user_unauthorized": False,                            
                            "data": None,
                            "error": None
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

            user_role = user.role
            if user_role != 'teacher':
                return Response(
                        {
                            "success": False,
                            "user_not_logged_in": False,
                            "user_unauthorized": True,                            
                            "data": None,
                            "error": None
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

            data = {}
            return Response(
                    {
                        "success": True,
                        "user_not_logged_in": False,
                        "user_unauthorized": False,                        
                        "data":data,
                        "error": None
                    },
                    status=status.HTTP_200_OK
                )

        except Exception as ex:
            # logger.error(ex, exc_info=True)
            print(ex)
            return Response(
                        {
                            "success": False,
                            "user_not_logged_in": False,
                            "user_unauthorized": False,                            
                            "data": None,
                            "error": str(ex)
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

class StudentTemplateViewSet(viewsets.ViewSet):
    def create(self, request):
        try:
            user = request.user
            if not user.is_authenticated:
                return Response(
                        {
                            "success": False,
                            "user_not_logged_in": True,
                            "user_unauthorized": False,                            
                            "data": None,
                            "error": None
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

            user_role = user.role
            if user_role != 'student':
                return Response(
                        {
                            "success": False,
                            "user_not_logged_in": False,
                            "user_unauthorized": True,                            
                            "data": None,
                            "error": None
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

            data = {}
            return Response(
                    {
                        "success": True,
                        "user_not_logged_in": False,
                        "user_unauthorized": False,                        
                        "data":data,
                        "error": None
                    },
                    status=status.HTTP_200_OK
                )

        except Exception as ex:
            # logger.error(ex, exc_info=True)
            print(ex)
            return Response(
                        {
                            "success": False,
                            "user_not_logged_in": False,
                            "user_unauthorized": False,                            
                            "data": None,
                            "error": str(ex)
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )


class TeacherDashboardViewSet(viewsets.ViewSet):
    def list(self, request):
        try:
            user = request.user
            if not user.is_authenticated:
                return Response(
                        {
                            "success": False,
                            "user_not_logged_in": True,
                            "user_unauthorized": False,                            
                            "data": None,
                            "error": None
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

            user_role = user.role
            if user_role != 'teacher':
                return Response(
                        {
                            "success": False,
                            "user_not_logged_in": False,
                            "user_unauthorized": True,                            
                            "data": None,
                            "error": None
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            # Get teacher details
            teacher_data_obj = User.objects.filter(user_id=user).first()
            teacher_data = UserSerializer(teacher_data_obj).data

            # Get total students details
            total_students = User.objects.filter(role='student')

            # Get subject details
            all_subjects_obj = Subject.objects.filter(teacher_id=user)
            total_subjects = len(all_subjects_obj)
            all_subjects_obj = all_subjects_obj[::-1][0:5]
            all_subjects = TeacherSubjectSerializer(all_subjects_obj, many=True).data

            # Get Attendance details
            all_attendance_obj = Attendance.objects.filter(teacher_id=user)
            total_attendance = len(all_attendance_obj)
            all_attendance_obj = all_attendance_obj[::-1][0:5]
            all_attendance = FullDetailsAttendanceSerializer(all_attendance_obj, many=True).data

            # Get Attendance details
            all_announcement_obj = Announcement.objects.filter(teacher_id=user)
            total_announcement = len(all_announcement_obj)
            all_announcement_obj = all_announcement_obj[::-1][0:3]
            all_announcement = AnnouncementSerializer(all_announcement_obj, many=True).data

            # Get Placement details
            all_company_obj = Company.objects.filter(teacher_id=user)
            total_company = len(all_company_obj)
            all_company_obj = all_company_obj[::-1][0:5]
            all_company = CompanySerializer(all_company_obj, many=True).data

            data = {
                "teacher_data": teacher_data,

                "total_students": len(total_students),

                "total_subjects": total_subjects,
                "all_subjects": all_subjects,

                "total_attendance": total_attendance,
                "all_attendance": all_attendance,

                "total_announcement": total_announcement,
                "all_announcement": all_announcement,

                "total_company": total_company,
                "all_company": all_company,
            }
            return Response(
                    {
                        "success": True,
                        "user_not_logged_in": False,
                        "user_unauthorized": False,                        
                        "data":data,
                        "error": None
                    },
                    status=status.HTTP_200_OK
                )

        except Exception as ex:
            # logger.error(ex, exc_info=True)
            print(ex)
            return Response(
                        {
                            "success": False,
                            "user_not_logged_in": False,
                            "user_unauthorized": False,                            
                            "data": None,
                            "error": str(ex)
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

class TeacherSubjectViewSet(viewsets.ViewSet):
    def create(self, request):
        try:
            user = request.user
            if not user.is_authenticated:
                return Response(
                        {
                            "success": False,
                            "user_not_logged_in": True,
                            "user_unauthorized": False,                            
                            "data": None,
                            "error": None
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

            user_role = user.role
            if user_role != 'teacher':
                return Response(
                        {
                            "success": False,
                            "user_not_logged_in": False,
                            "user_unauthorized": True,                            
                            "data": None,
                            "error": None
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )
                       
            subject_name = request.data.get('subject_name')
            college_year = request.data.get('college_year')
            class_division = request.data.get('class_division')
            YEAR_CHOICES = ['first_year', 'second_year', 'third_year', 'fourth_year', 'fifth_year']
            print(subject_name)
            print(college_year)
            print(class_division)
            if (subject_name == None) or (college_year not in YEAR_CHOICES) or (class_division == None):
                return Response(
                        {
                            "success": False,
                            "user_not_logged_in": False,
                            "user_unauthorized": False,                            
                            "data": None,
                            "error": 'Subject or college year is not acceptable.'
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

            subject_id = self.generate_subject_id()
            new_subject = Subject(
                teacher_id=user,
                subject_id=subject_id,
                subject_name=subject_name,
                college_year=college_year,
                class_division=class_division
            )
            new_subject.save()

            return Response(
                    {
                        "success": True,
                        "user_not_logged_in": False,
                        "user_unauthorized": False,                        
                        "data": None,
                        "error": None
                    },
                    status=status.HTTP_200_OK
                )

        except Exception as ex:
            # logger.error(ex, exc_info=True)
            print(ex)
            return Response(
                        {
                            "success": False,
                            "user_not_logged_in": False,
                            "user_unauthorized": False,                            
                            "data": None,
                            "error": str(ex)
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

    def generate_subject_id(self):
        while True:
            subject_id = ''.join(random.choices(string.digits, k=10))
            if not Subject.objects.filter(subject_id=subject_id).exists():
                return subject_id

    def list(self, request):
        try:
            user = request.user
            if not user.is_authenticated:
                return Response(
                        {
                            "success": False,
                            "user_not_logged_in": True,
                            "user_unauthorized": False,                            
                            "data": None,
                            "error": None
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

            user_role = user.role
            if user_role != 'teacher':
                return Response(
                        {
                            "success": False,
                            "user_not_logged_in": False,
                            "user_unauthorized": True,                            
                            "data": None,
                            "error": None
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

            all_subjects_obj = Subject.objects.filter(teacher_id=user)
            all_subjects = TeacherSubjectSerializer(all_subjects_obj, many=True).data

            data = {
                'all_subjects': all_subjects,
                'total_subjects': len(all_subjects),
            }
            return Response(
                    {
                        "success": True,
                        "user_not_logged_in": False,
                        "user_unauthorized": False,                        
                        "data":data,
                        "error": None
                    },
                    status=status.HTTP_200_OK
                )

        except Exception as ex:
            # logger.error(ex, exc_info=True)
            print(ex)
            return Response(
                        {
                            "success": False,
                            "user_not_logged_in": False,
                            "user_unauthorized": False,                            
                            "data": None,
                            "error": str(ex)
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

class StudentSubjectViewSet(viewsets.ViewSet):
    def list(self, request):
        try:
            user = request.user
            if not user.is_authenticated:
                return Response(
                        {
                            "success": False,
                            "user_not_logged_in": True,
                            "user_unauthorized": False,                            
                            "data": None,
                            "error": None
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

            user_role = user.role
            if user_role != 'student':
                return Response(
                        {
                            "success": False,
                            "user_not_logged_in": False,
                            "user_unauthorized": True,                            
                            "data": None,
                            "error": None
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

            all_subjects_obj = Subject.objects.filter(college_year=user.year, class_division=user.division)
            all_subjects = StudentSubjectSerializer(all_subjects_obj, many=True).data

            data = {
                'all_subjects': all_subjects,
                'total_subjects': len(all_subjects),
            }
            return Response(
                    {
                        "success": True,
                        "user_not_logged_in": False,
                        "user_unauthorized": False,                        
                        "data":data,
                        "error": None
                    },
                    status=status.HTTP_200_OK
                )

        except Exception as ex:
            # logger.error(ex, exc_info=True)
            print(ex)
            return Response(
                        {
                            "success": False,
                            "user_not_logged_in": False,
                            "user_unauthorized": False,                            
                            "data": None,
                            "error": str(ex)
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

class SubjectDetailViewSet(viewsets.ViewSet):
    def list(self, request):
        try:
            user = request.user
            if not user.is_authenticated:
                return Response(
                        {
                            "success": False,
                            "user_not_logged_in": True,
                            "user_unauthorized": False,                            
                            "data": None,
                            "error": None
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

            subject_id = request.GET.get('subject_id')
            if not subject_id:
                return Response(
                        {
                            "success": False,
                            "user_not_logged_in": False,
                            "user_unauthorized": False,                            
                            "data": None,
                            "error": "Subject Id required."
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

            user_role = user.role
            if user_role == 'student':
                subject_is_valid = Subject.objects.filter(subject_id=subject_id, college_year=user.year).exists()
                if subject_is_valid:
                    all_announcements_obj = Announcement.objects.filter(subject_id=subject_id)
                    all_announcements = AnnouncementSerializer(all_announcements_obj, many=True).data
                    
                    all_assignments_obj = Assignment.objects.filter(subject_id=subject_id)
                    all_assignments = AssignmentSerializer(all_assignments_obj, many=True).data

                    all_attendance_obj = Attendance.objects.filter(subject_id=subject_id)
                    all_attendance = AttendanceSerializer(all_attendance_obj, many=True).data
                    
                    subject_data_obj = Subject.objects.filter(subject_id=subject_id).first()
                    subject_data = StudentSubjectSerializer(subject_data_obj).data

                else:
                    return Response(
                        {
                            "success": False,
                            "user_not_logged_in": False,
                            "user_unauthorized": True,                            
                            "data": None,
                            "error": None
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

            else:
                all_announcements_obj = Announcement.objects.filter(subject_id=subject_id)
                all_announcements = AnnouncementSerializer(all_announcements_obj, many=True).data

                all_assignments_obj = Assignment.objects.filter(subject_id=subject_id)
                all_assignments = AssignmentSerializer(all_assignments_obj, many=True).data

                all_attendance_obj = Attendance.objects.filter(subject_id=subject_id)
                all_attendance = AttendanceSerializer(all_attendance_obj, many=True).data

                subject_data_obj = Subject.objects.filter(subject_id=subject_id).first()
                subject_data = TeacherSubjectSerializer(subject_data_obj).data

            data = {
                'all_announcements': all_announcements[::-1],
                'total_announcements': len(all_announcements),

                'all_assignments': all_assignments[::-1],
                'total_assignments': len(all_assignments),

                'all_attendance': all_attendance[::-1],
                'total_attendances': len(all_attendance),

                'subject_data': subject_data,
            }
            return Response(
                    {
                        "success": True,
                        "user_not_logged_in": False,
                        "user_unauthorized": False,                        
                        "data":data,
                        "error": None
                    },
                    status=status.HTTP_200_OK
                )

        except Exception as ex:
            # logger.error(ex, exc_info=True)
            print(ex)
            return Response(
                        {
                            "success": False,
                            "user_not_logged_in": False,
                            "user_unauthorized": False,                            
                            "data": None,
                            "error": str(ex)
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

class AnnouncementViewSet(viewsets.ViewSet):
    def list(self, request):
        try:
            user = request.user
            if not user.is_authenticated:
                return Response(
                        {
                            "success": False,
                            "user_not_logged_in": True,
                            "user_unauthorized": False,                            
                            "data": None,
                            "error": None
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

            user_role = user.role
            if user_role != 'teacher':
                return Response(
                        {
                            "success": False,
                            "user_not_logged_in": False,
                            "user_unauthorized": True,                            
                            "data": None,
                            "error": None
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )
    
            all_announcements_obj = Announcement.objects.all()
            all_announcements_obj = all_announcements_obj[::-1]

            number_of_records = request.GET.get('number_of_records')           
            if number_of_records is None:
                all_announcements = AnnouncementSerializer(all_announcements_obj, many=True).data
            else:
                all_announcements = AnnouncementSerializer(all_announcements_obj[0:int(number_of_records)], many=True).data

            data = {
                'all_announcements': all_announcements,
                'total_announcements': len(all_announcements),
            }
            return Response(
                    {
                        "success": True,
                        "user_not_logged_in": False,
                        "user_unauthorized": False,                        
                        "data":data,
                        "error": None
                    },
                    status=status.HTTP_200_OK
                )

        except Exception as ex:
            # logger.error(ex, exc_info=True)
            print(ex)
            return Response(
                        {
                            "success": False,
                            "user_not_logged_in": False,
                            "user_unauthorized": False,                            
                            "data": None,
                            "error": str(ex)
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

    def create(self, request):
        try:
            user = request.user

            if not user.is_authenticated:
                return Response(
                        {
                            "success": False,
                            "user_not_logged_in": True,
                            "user_unauthorized": False,                            
                            "data": None,
                            "error": None
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

            user_role = user.role
            if user_role != 'teacher':
                return Response(
                        {
                            "success": False,
                            "user_not_logged_in": False,
                            "user_unauthorized": True,                            
                            "data": None,
                            "error": None
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )
                       
            text_content = request.data.get('text_content')
            if not text_content:
                return Response(
                        {
                            "success": False,
                            "user_not_logged_in": False,
                            "user_unauthorized": False,                            
                            "data": None,
                            "error": "Text Content not provided."
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

            subject_id = request.data.get('subject_id')
            if not subject_id:
                return Response(
                        {
                            "success": False,
                            "user_not_logged_in": False,
                            "user_unauthorized": False,                            
                            "data": None,
                            "error": "Subject Id required."
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            attached_docs = True
            if 'files[0]' not in request.FILES:
                attached_docs = False

            document_paths = []

            ind = 0
            while True:
                if f'files[{ind}]' in request.FILES:
                    file_path = self.save_file(request.FILES[f'files[{ind}]'])
                    document_paths.append(file_path)
                    ind+=1

                else:
                    break

            announcement_id = self.generate_announcement_id()

            new_announcements = Announcement(
                announcement_id=announcement_id,
                subject_id=subject_id,
                teacher_id=user,
                text_content=text_content,
                attached_docs=attached_docs,
                document_paths=document_paths
            )
            new_announcements.save()
           
            return Response(
                    {
                        "success": True,
                        "user_not_logged_in": False,
                        "user_unauthorized": False,                        
                        "data": None,
                        "error": None
                    },
                    status=status.HTTP_200_OK
                )
        except Exception as ex:
            # logger.error(ex, exc_info=True)
            print(ex)
            return Response(
                        {
                            "success": False,
                            "user_not_logged_in": False,
                            "user_unauthorized": False,                            
                            "data": None,
                            "error": str(ex)
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

    def generate_announcement_id(self):
        while True:
            announcement_id = ''.join(random.choices(string.digits, k=10))
            if not Announcement.objects.filter(announcement_id=announcement_id).exists():
                return announcement_id

    def save_file(self, uploaded_file):
        # Define the base directory to save the files
        upload_dir = os.path.join(settings.MEDIA_ROOT, 'uploads/')
        os.makedirs(upload_dir, exist_ok=True)

        # Generate a unique filename if a file with the same name exists
        base_name, extension = os.path.splitext(uploaded_file.name)
        file_name = uploaded_file.name
        counter = 1

        while os.path.exists(os.path.join(upload_dir, file_name)):
            file_name = f"{base_name}({counter}){extension}"
            counter += 1

        # Save the file
        file_path = os.path.join(upload_dir, file_name)
        with open(file_path, 'wb') as f:
            for chunk in uploaded_file.chunks():
                f.write(chunk)

        # Return the relative file path
        return os.path.relpath(file_path, settings.MEDIA_ROOT)

    def upload_file_to_s3(self, uploaded_file):
        """Uploads a file to AWS S3, renaming it if a file with the same name exists."""
        region_name = "eu-north-1"
        s3_client = boto3.client(
            "s3",
            aws_access_key_id = self.decrypt("QUtJQTRUNE9DTTU2TENMUUdTNlA="),
            aws_secret_access_key = self.decrypt("TzRzQmlWK0NvcWdBM2Q1aGhPMXJkeGV0c1YyaWdibjR6YXhrbTRqMA=="),
            region_name = region_name
        )
        
        bucket_name = "ehunt"
        base_name, extension = os.path.splitext(uploaded_file.name)
        file_name = uploaded_file.name
        s3_key = f"uploads/{file_name}"
        counter = 1

        # Check if file exists and rename if necessary
        while True:
            try:
                s3_client.head_object(Bucket=bucket_name, Key=s3_key)
                # If file exists, update the filename
                file_name = f"{base_name}({counter}){extension}"
                s3_key = f"uploads/{file_name}"
                counter += 1
            except s3_client.exceptions.ClientError:
                break  # File does not exist, proceed with upload

        # Upload file
        s3_client.upload_fileobj(uploaded_file, bucket_name, s3_key)

        # Generate file URL
        file_url = f"https://{bucket_name}.s3.{region_name}.amazonaws.com/{s3_key}"

        return file_url

    def decrypt(self, b64_text):
        # Decode the Base64 string back to bytes, then to text
        return base64.b64decode(b64_text.encode()).decode()

class CommentViewSet(viewsets.ViewSet):
    def create(self, request):
        try:
            user = request.user
            if not user.is_authenticated:
                return Response(
                        {
                            "success": False,
                            "user_not_logged_in": True,
                            "user_unauthorized": False,                            
                            "data": None,
                            "error": None
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

            announcement_id = request.data.get('announcement_id')
            if not announcement_id:
                return Response(
                        {
                            "success": False,
                            "user_not_logged_in": False,
                            "user_unauthorized": False,                            
                            "data": None,
                            "error": "Announcement Id required."
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

            comment_content = request.data.get('comment_content')
            if not comment_content:
                return Response(
                        {
                            "success": False,
                            "user_not_logged_in": False,
                            "user_unauthorized": False,                            
                            "data": None,
                            "error": "Comment content not provided."
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

            comment_id = self.generate_comment_id()

            new_comment = Comment(
                comment_id=comment_id,
                announcement_id=announcement_id,
                user_id=user,
                comment_content=comment_content,
            )
            new_comment.save()

            return Response(
                    {
                        "success": True,
                        "user_not_logged_in": False,
                        "user_unauthorized": False,                        
                        "data":None,
                        "error": None
                    },
                    status=status.HTTP_200_OK
                )

        except Exception as ex:
            # logger.error(ex, exc_info=True)
            print(ex)
            return Response(
                        {
                            "success": False,
                            "user_not_logged_in": False,
                            "user_unauthorized": False,                            
                            "data": None,
                            "error": str(ex)
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

    def generate_comment_id(self):
        while True:
            comment_id = ''.join(random.choices(string.digits, k=10))
            if not Comment.objects.filter(comment_id=comment_id).exists():
                return comment_id

class AssignmentViewSet(viewsets.ViewSet):
    def list(self, request):
        try:
            user = request.user
            if not user.is_authenticated:
                return Response(
                        {
                            "success": False,
                            "user_not_logged_in": True,
                            "user_unauthorized": False,                            
                            "data": None,
                            "error": None
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )
            user_role = user.role
            if user_role != 'teacher':
                return Response(
                        {
                            "success": False,
                            "user_not_logged_in": False,
                            "user_unauthorized": True,                            
                            "data": None,
                            "error": None
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )
    
            all_assignments_obj = Assignment.objects.all()
            all_assignments_obj = all_assignments_obj[::-1]

            number_of_records = request.GET.get('number_of_records')           
            if number_of_records is None:
                all_assignments = AssignmentSerializer(all_assignments_obj, many=True).data
            else:
                all_assignments = AssignmentSerializer(all_assignments_obj[0:int(number_of_records)], many=True).data

            data = {
                'all_assignments': all_assignments,
                'total_assignments': len(all_assignments),
            }
            return Response(
                    {
                        "success": True,
                        "user_not_logged_in": False,
                        "user_unauthorized": False,                        
                        "data":data,
                        "error": None
                    },
                    status=status.HTTP_200_OK
                )

        except Exception as ex:
            # logger.error(ex, exc_info=True)
            print(ex)
            return Response(
                        {
                            "success": False,
                            "user_not_logged_in": False,
                            "user_unauthorized": False,                            
                            "data": None,
                            "error": str(ex)
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

    def create(self, request):
        try:
            user = request.user

            if not user.is_authenticated:
                return Response(
                        {
                            "success": False,
                            "user_not_logged_in": True,
                            "user_unauthorized": False,                            
                            "data": None,
                            "error": None
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

            user_role = user.role
            if user_role != 'teacher':
                return Response(
                        {
                            "success": False,
                            "user_not_logged_in": False,
                            "user_unauthorized": True,                            
                            "data": None,
                            "error": None
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )
                       
            text_content = request.data.get('text_content')
            if not text_content:
                return Response(
                        {
                            "success": False,
                            "user_not_logged_in": False,
                            "user_unauthorized": False,                            
                            "data": None,
                            "error": "Text Content not provided."
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

            subject_id = request.data.get('subject_id')
            if not subject_id:
                return Response(
                        {
                            "success": False,
                            "user_not_logged_in": False,
                            "user_unauthorized": False,                            
                            "data": None,
                            "error": "Subject Id required."
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            deadline_date = request.data.get('deadline_date')
            if not deadline_date:
                return Response(
                        {
                            "success": False,
                            "user_not_logged_in": False,
                            "user_unauthorized": False,                            
                            "data": None,
                            "error": "Deadline Date required."
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

            attached_docs = True
            if 'files[0]' not in request.FILES:
                attached_docs = False

            document_paths = []

            ind = 0
            while True:
                if f'files[{ind}]' in request.FILES:
                    file_path = self.save_file(request.FILES[f'files[{ind}]'])
                    document_paths.append(file_path)
                    ind+=1

                else:
                    break

            assignment_id = self.generate_assignment_id()

            new_assignment = Assignment(
                assignment_id=assignment_id,
                subject_id=subject_id,
                teacher_id=user,
                text_content=text_content,
                attached_docs=attached_docs,
                document_paths=document_paths,
                deadline_date=deadline_date,
                all_submits=[]
            )
            new_assignment.save()
           
            return Response(
                    {
                        "success": True,
                        "user_not_logged_in": False,
                        "user_unauthorized": False,                        
                        "data": None,
                        "error": None
                    },
                    status=status.HTTP_200_OK
                )
        except Exception as ex:
            # logger.error(ex, exc_info=True)
            print(ex)
            return Response(
                        {
                            "success": False,
                            "user_not_logged_in": False,
                            "user_unauthorized": False,                            
                            "data": None,
                            "error": str(ex)
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

    def generate_assignment_id(self):
        while True:
            assignment_id = ''.join(random.choices(string.digits, k=10))
            if not Assignment.objects.filter(assignment_id=assignment_id).exists():
                return assignment_id

    def save_file(self, uploaded_file):
        # Define the base directory to save the files
        upload_dir = os.path.join(settings.MEDIA_ROOT, 'uploads/')
        os.makedirs(upload_dir, exist_ok=True)

        # Generate a unique filename if a file with the same name exists
        base_name, extension = os.path.splitext(uploaded_file.name)
        file_name = uploaded_file.name
        counter = 1

        while os.path.exists(os.path.join(upload_dir, file_name)):
            file_name = f"{base_name}({counter}){extension}"
            counter += 1

        # Save the file
        file_path = os.path.join(upload_dir, file_name)
        with open(file_path, 'wb') as f:
            for chunk in uploaded_file.chunks():
                f.write(chunk)

        # Return the relative file path
        return os.path.relpath(file_path, settings.MEDIA_ROOT)

    def upload_file_to_s3(self, uploaded_file):
        """Uploads a file to AWS S3, renaming it if a file with the same name exists."""
        region_name = "eu-north-1"
        s3_client = boto3.client(
            "s3",
            aws_access_key_id = self.decrypt("QUtJQTRUNE9DTTU2TENMUUdTNlA="),
            aws_secret_access_key = self.decrypt("TzRzQmlWK0NvcWdBM2Q1aGhPMXJkeGV0c1YyaWdibjR6YXhrbTRqMA=="),
            region_name = region_name
        )
        
        bucket_name = "ehunt"
        base_name, extension = os.path.splitext(uploaded_file.name)
        file_name = uploaded_file.name
        s3_key = f"uploads/{file_name}"
        counter = 1

        # Check if file exists and rename if necessary
        while True:
            try:
                s3_client.head_object(Bucket=bucket_name, Key=s3_key)
                # If file exists, update the filename
                file_name = f"{base_name}({counter}){extension}"
                s3_key = f"uploads/{file_name}"
                counter += 1
            except s3_client.exceptions.ClientError:
                break  # File does not exist, proceed with upload

        # Upload file
        s3_client.upload_fileobj(uploaded_file, bucket_name, s3_key)

        # Generate file URL
        file_url = f"https://{bucket_name}.s3.{region_name}.amazonaws.com/{s3_key}"

        return file_url

    def decrypt(self, b64_text):
        # Decode the Base64 string back to bytes, then to text
        return base64.b64decode(b64_text.encode()).decode()

class AttendanceViewSet(viewsets.ViewSet):
    def create(self, request):
        try:
            user = request.user
            if not user.is_authenticated:
                return Response(
                        {
                            "success": False,
                            "user_not_logged_in": True,
                            "user_unauthorized": False,                            
                            "data": None,
                            "error": None
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

            user_role = user.role
            if user_role != 'teacher':
                return Response(
                        {
                            "success": False,
                            "user_not_logged_in": False,
                            "user_unauthorized": True,                            
                            "data": None,
                            "error": None
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )
                       
            subject_id = request.data.get('subject_id')           
            if subject_id is None:
                return Response(
                        {
                            "success": False,
                            "user_not_logged_in": False,
                            "user_unauthorized": False,                            
                            "data": None,
                            "error": 'Subject id not provided.'
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

            attendance_id, unique_code = self.generate_attendance_details()
            new_attendance = Attendance(
                attendance_id=attendance_id,
                subject_id=subject_id,
                code=unique_code,
                teacher_id=user
            )
            new_attendance.save()

            data = {
                "unique_code": unique_code
            }
            return Response(
                    {
                        "success": True,
                        "user_not_logged_in": False,
                        "user_unauthorized": False,                        
                        "data": data,
                        "error": None
                    },
                    status=status.HTTP_200_OK
                )

        except Exception as ex:
            # logger.error(ex, exc_info=True)
            print(ex)
            return Response(
                        {
                            "success": False,
                            "user_not_logged_in": False,
                            "user_unauthorized": False,                            
                            "data": None,
                            "error": str(ex)
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

    def list(self, request):
        try:
            user = request.user
            if not user.is_authenticated:
                return Response(
                        {
                            "success": False,
                            "user_not_logged_in": True,
                            "user_unauthorized": False,                            
                            "data": None,
                            "error": None
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

            user_role = user.role
            if user_role != 'teacher':
                return Response(
                        {
                            "success": False,
                            "user_not_logged_in": False,
                            "user_unauthorized": True,                            
                            "data": None,
                            "error": None
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )
    
            all_attendance_obj = Attendance.objects.all()
            all_attendance_obj = all_attendance_obj[::-1]

            number_of_records = request.GET.get('number_of_records')           
            if number_of_records is None:
                all_attendance = AttendanceSerializer(all_attendance_obj, many=True).data
            else:
                all_attendance = AttendanceSerializer(all_attendance_obj[0:int(number_of_records)], many=True).data

            data = {
                'all_attendance': all_attendance,
                'total_attendances': len(all_attendance),
            }
            return Response(
                    {
                        "success": True,
                        "user_not_logged_in": False,
                        "user_unauthorized": False,                        
                        "data":data,
                        "error": None
                    },
                    status=status.HTTP_200_OK
                )

        except Exception as ex:
            # logger.error(ex, exc_info=True)
            print(ex)
            return Response(
                        {
                            "success": False,
                            "user_not_logged_in": False,
                            "user_unauthorized": False,                            
                            "data": None,
                            "error": str(ex)
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

    def generate_attendance_details(self):
        while True:
            # Generate a 10-digit numeric announcement ID
            attendance_id = ''.join(random.choices(string.digits, k=10))

            # Generate a 6-character unique code (2 letters, 2 numbers, 2 letters)
            unique_code = (
                random.choice(string.ascii_uppercase) +
                random.choice(string.ascii_uppercase) +
                random.choice(string.digits) +
                random.choice(string.digits) +
                random.choice(string.ascii_uppercase) +
                random.choice(string.ascii_uppercase)
            )

            # Ensure both are unique and not in the same row
            if not Attendance.objects.filter(
                attendance_id=attendance_id,
                code=unique_code
            ).exists():
                return attendance_id, unique_code

class MarkedAttendanceViewSet(viewsets.ViewSet):
    def create(self, request):
        try:
            user = request.user
            if not user.is_authenticated:
                return Response(
                        {
                            "success": False,
                            "user_not_logged_in": True,
                            "user_unauthorized": False,                            
                            "data": None,
                            "error": None
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

            user_role = user.role
            if user_role != 'student':
                return Response(
                        {
                            "success": False,
                            "user_not_logged_in": False,
                            "user_unauthorized": True,                            
                            "data": None,
                            "error": None
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

            unique_code = request.data.get('unique_code')
            if unique_code is None:
                return Response(
                        {
                            "success": False,
                            "user_not_logged_in": False,
                            "user_unauthorized": False,                            
                            "data": None,
                            "error": 'unique code not provided.'
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

            attendance_id = request.data.get('attendance_id')           
            if attendance_id is None:
                return Response(
                        {
                            "success": False,
                            "user_not_logged_in": False,
                            "user_unauthorized": False,                            
                            "data": None,
                            "error": 'Attendance id not provided.'
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

            attendance_details = Attendance.objects.filter(attendance_id=attendance_id).first()
            if not attendance_details:
                return Response(
                        {
                            "success": False,
                            "user_not_logged_in": False,
                            "user_unauthorized": False,                            
                            "data": None,
                            "error": 'Attendance id is not valid.'
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

            attendance_marked = MarkedAttendance.objects.filter(attendance_id=attendance_id, student_id=user).exists()
            if attendance_marked:
                return Response(
                        {
                            "success": False,
                            "user_not_logged_in": False,
                            "user_unauthorized": False,                            
                            "data": None,
                            "error": 'Attendance already marked.'
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

            mark_new_attendance = MarkedAttendance(
                attendance_id=attendance_id,
                student_id=user
            )
            mark_new_attendance.save()

            return Response(
                    {
                        "success": True,
                        "user_not_logged_in": False,
                        "user_unauthorized": False,                        
                        "data": None,
                        "error": None
                    },
                    status=status.HTTP_200_OK
                )

        except Exception as ex:
            # logger.error(ex, exc_info=True)
            print(ex)
            return Response(
                        {
                            "success": False,
                            "user_not_logged_in": False,
                            "user_unauthorized": False,                            
                            "data": None,
                            "error": str(ex)
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

    def list(self, request):
        try:
            user = request.user
            if not user.is_authenticated:
                return Response(
                        {
                            "success": False,
                            "user_not_logged_in": True,
                            "user_unauthorized": False,                            
                            "data": None,
                            "error": None
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

            user_role = user.role
            if user_role != 'teacher':
                return Response(
                        {
                            "success": False,
                            "user_not_logged_in": False,
                            "user_unauthorized": True,                            
                            "data": None,
                            "error": None
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

            attendance_id = request.data.get('attendance_id')           
            if attendance_id is None:
                return Response(
                        {
                            "success": False,
                            "user_not_logged_in": False,
                            "user_unauthorized": False,                            
                            "data": None,
                            "error": 'Subject id not provided.'
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

            all_attendance_obj = MarkedAttendance.objects.filter(attendance_id=attendance_id)
            all_attendance = MarkedAttendanceSerializer(all_attendance_obj, many=True).data

            data = {
                'all_attendance': all_attendance,
                'total_subjects': len(all_attendance),
            }
            return Response(
                    {
                        "success": True,
                        "user_not_logged_in": False,
                        "user_unauthorized": False,                        
                        "data":data,
                        "error": None
                    },
                    status=status.HTTP_200_OK
                )

        except Exception as ex:
            # logger.error(ex, exc_info=True)
            print(ex)
            return Response(
                        {
                            "success": False,
                            "user_not_logged_in": False,
                            "user_unauthorized": False,                            
                            "data": None,
                            "error": str(ex)
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )
