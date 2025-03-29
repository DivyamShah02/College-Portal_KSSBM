from rest_framework.response import Response
from rest_framework import status
from rest_framework import viewsets
from rest_framework.exceptions import NotFound, ParseError

from django.conf import settings
from django.shortcuts import get_object_or_404, render, redirect
from django.contrib.auth import authenticate, login, logout
from django.utils.timezone import now

from .serializers import *
from .models import *
from Placement.models import *
from Placement.serializers import *

import os
import pytz
import time
import random
import string
import boto3
import base64
from botocore.exceptions import NoCredentialsError
from datetime import datetime, timedelta
from dateutil.parser import isoparse


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

            # Get Announcement details
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

class StudentDashboardViewSet(viewsets.ViewSet):
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
            
            # Get student details
            student_data_obj = User.objects.filter(user_id=user).first()
            student_data = UserSerializer(student_data_obj).data

            # Get subject details
            all_subjects_obj = Subject.objects.filter(college_year=user.year, class_division=user.division)
            total_subjects = len(all_subjects_obj)
            all_subjects_obj = all_subjects_obj[::-1][0:5]
            all_subjects = StudentSubjectSerializer(all_subjects_obj, many=True).data

            # Get Announcement details
            all_announcement_obj = Announcement.objects.filter(college_year=user.year, class_division=user.division)
            total_announcement = len(all_announcement_obj)
            all_announcement_obj = all_announcement_obj[::-1][0:3]
            all_announcement = AnnouncementSerializer(all_announcement_obj, many=True).data

            # Get Assignment details
            all_assignment_obj = Assignment.objects.filter(college_year=user.year, class_division=user.division, deadline_date__gte=now())
            total_assignment = len(all_assignment_obj)
            all_assignment_obj = all_assignment_obj[::-1]
            all_assignment = []
            for assignment in all_assignment_obj:
                assignment_data = StudentAssignmentSerializer(assignment, context={'student_id': user}).data
                if not assignment_data.get('assignment_submitted', False):
                    all_assignment.append(assignment_data)
                    if len(all_assignment) == 4:
                        break

            # Get placements detials
            if user.year == 'fifth_year':
                all_registered_company = PlacmentRegistration.objects.filter(student_id=user)
                all_company_announcement_obj = CompanyAnnouncement.objects.filter(company_id__in=[registered_company.company_id for registered_company in all_registered_company]).order_by('-created_at')[:5]
                all_company_announcement = StudentDashboardCompanyAnnouncementSerializer(all_company_announcement_obj, many=True).data
            
            else:
                all_company_announcement = []

            data = {
                "student_data": student_data,

                "total_subjects": total_subjects,
                "all_subjects": all_subjects,

                "total_announcement": total_announcement,
                "all_announcement": all_announcement,

                "total_assignment": total_assignment,
                "all_assignment": all_assignment,

                "all_company_announcement": all_company_announcement,

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

class StudentDashboardPendingAssignmentCountViewSet(viewsets.ViewSet):
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
            
            # Get Assignment details
            all_assignment_obj = Assignment.objects.filter(college_year=user.year, class_division=user.division)
            total_assignment = len(all_assignment_obj)
            all_assignment_obj = all_assignment_obj[::-1]
            pending_assignment = []
            missed_assignment = []
            for assignment in all_assignment_obj:
                assignment_data = StudentAssignmentSerializer(assignment, context={'student_id': user}).data
                if not assignment_data.get('assignment_submitted', False):
                    deadline_datetime = isoparse(str(assignment_data.get('deadline_date')))
                    current_time = datetime.now(deadline_datetime.tzinfo)
                    if deadline_datetime > current_time:
                        print("The given datetime is in the future.")
                        pending_assignment.append(assignment_data)
                    else:
                        missed_assignment.append(assignment_data)
                        print("The given datetime is in the past.")

            data = {
                "total_assignment": total_assignment,
                
                "pending_assignment": pending_assignment,
                "total_pending_assignment": len(pending_assignment),

                "missed_assignment": missed_assignment,
                "total_missed_assignment": len(missed_assignment)

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

class StudentDashboardMarkedAttendanceViewSet(viewsets.ViewSet):
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
            
            # Get Attendance details
            student_subjects = Subject.objects.filter(college_year=user.year, class_division=user.division)

            all_subject_attendances = []
            total_attendances = 0
            total_marked_attendances = 0

            for student_subject in student_subjects:
                all_attendance_subject = Attendance.objects.filter(subject_id=student_subject.subject_id)
                marked_attendances = 0
                for attendance_subject in all_attendance_subject:
                    attendance_marked = MarkedAttendance.objects.filter(attendance_id=attendance_subject.attendance_id, student_id=user).exists()
                    if attendance_marked:
                        marked_attendances += 1
                
                total_attendances += len(all_attendance_subject)
                total_marked_attendances += marked_attendances

                try:
                    attendance_percentage = int((marked_attendances * 100) / len(all_attendance_subject))
                except:
                    print(f'in this for {student_subject.subject_name}')
                    attendance_percentage = 0
                
                all_subject_attendances.append({
                    "subject_id": student_subject.subject_id,
                    "subject_name": student_subject.subject_name,
                    "all_attendance_subject": len(all_attendance_subject),
                    "marked_attendances": marked_attendances,
                    "attendance_percentage": attendance_percentage
                })

            try:
                total_attendance_percentage = int((total_marked_attendances * 100) / total_attendances)
            except:
                total_attendance_percentage = 0

            data = {
                "all_subject_attendance": all_subject_attendances,
                "total_attendances": total_attendances,
                "total_marked_attendances": total_marked_attendances,
                "total_attendance_percentage": total_attendance_percentage
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
                'all_subjects': all_subjects[::-1],
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
                'all_subjects': all_subjects[::-1],
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

            total_assignments_submitted = 0
            total_assignments_pending = 0
            total_marked_attendance = 0
            attendance_percentage = 0

            user_role = user.role
            if user_role == 'student':
                subject_is_valid = Subject.objects.filter(subject_id=subject_id, college_year=user.year).exists()
                if subject_is_valid:
                    all_announcements_obj = Announcement.objects.filter(subject_id=subject_id)
                    all_announcements = AnnouncementSerializer(all_announcements_obj, many=True).data
                    
                    all_assignments_obj = Assignment.objects.filter(subject_id=subject_id)
                    all_assignments = StudentAssignmentSerializer(all_assignments_obj, many=True, context={'student_id': user}).data

                    for assignment_data in all_assignments:
                        if assignment_data['assignment_submitted']:
                            total_assignments_submitted+=1
                        else:
                            total_assignments_pending+=1

                    all_attendance_obj = Attendance.objects.filter(subject_id=subject_id)
                    all_attendance = StudentAttendanceSerializer(all_attendance_obj, many=True, context={'student_id': user}).data

                    total_marked_attendance = 0
                    for attendance in all_attendance:
                        if attendance['attendance_marked']:
                            total_marked_attendance+=1
                    total_attendance = len(all_attendance)
                    try:
                        attendance_percentage = int((total_marked_attendance * 100) / total_attendance)
                    except:
                        attendance_percentage = 0
                    
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
                subject_is_valid = Subject.objects.filter(subject_id=subject_id, teacher_id=user).exists()
                if subject_is_valid:
                    all_announcements_obj = Announcement.objects.filter(subject_id=subject_id)
                    all_announcements = AnnouncementSerializer(all_announcements_obj, many=True).data

                    all_assignments_obj = Assignment.objects.filter(subject_id=subject_id)
                    all_assignments = TeacherAssignmentSerializer(all_assignments_obj, many=True).data

                    all_attendance_obj = Attendance.objects.filter(subject_id=subject_id)
                    all_attendance = AttendanceSerializer(all_attendance_obj, many=True).data

                    subject_data_obj = Subject.objects.filter(subject_id=subject_id).first()
                    subject_data = TeacherSubjectSerializer(subject_data_obj).data

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

            data = {
                'all_announcements': all_announcements[::-1],
                'total_announcements': len(all_announcements),

                'all_assignments': all_assignments[::-1],
                'total_assignments': len(all_assignments),

                'all_attendance': all_attendance[::-1],
                'total_attendances': len(all_attendance),

                'subject_data': subject_data,

                'total_assignments_submitted': total_assignments_submitted,
                'total_assignments_pending': total_assignments_pending,

                'total_marked_attendance': total_marked_attendance,
                'attendance_percentage': attendance_percentage,
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
            if user_role == 'teacher':
                all_announcements_obj = Announcement.objects.filter(teacher_id=user)
            elif user_role == 'student':
                all_announcements_obj = Announcement.objects.filter(college_year=user.year, class_division=user.division)

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
            
            subject_data = Subject.objects.filter(subject_id=subject_id).first()

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
                college_year=subject_data.college_year,
                class_division=subject_data.class_division,
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
            if user_role == 'teacher':
                all_assignments_obj = Assignment.objects.filter(teacher_id=user)
            elif user_role == 'student':
                all_assignments_obj = Assignment.objects.filter(college_year=user.year, class_division=user.division)
            all_assignments_obj = all_assignments_obj[::-1]

            number_of_records = request.GET.get('number_of_records')           
            if number_of_records is not None:
                all_assignments_obj = all_assignments_obj[0:int(number_of_records)]
            
            if user_role == 'teacher':
                all_assignments = TeacherAssignmentSerializer(all_assignments_obj, many=True).data
            elif user_role == 'student':
                all_assignments_data = StudentAssignmentSerializer(all_assignments_obj, many=True, context={'student_id': user}).data
                pending_assignments = []
                completed_assignments = []
                missed_assignments = []

                for assignment_data in all_assignments_data:
                    if assignment_data['assignment_submitted']:
                        completed_assignments.append(assignment_data)

                    else:
                        datetime_obj = datetime.fromisoformat(str(assignment_data['deadline_date']))
                        current_time = datetime.now(pytz.timezone("Asia/Kolkata"))

                        if datetime_obj < current_time:
                            missed_assignments.append(assignment_data)

                        else:
                            pending_assignments.append(assignment_data)

                all_assignments = {
                    "pending_assignments": pending_assignments,
                    "completed_assignments": completed_assignments,
                    "missed_assignments": missed_assignments,
                }

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

            subject_data = Subject.objects.filter(subject_id=subject_id).first()
            
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
                college_year=subject_data.college_year,
                class_division=subject_data.class_division,
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

class SubmittedAssignmentViewSet(viewsets.ViewSet):
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
            student_id = request.GET.get('student_id')
            if student_id is None:
                return Response(
                        {
                            "success": False,
                            "user_not_logged_in": False,
                            "user_unauthorized": False,                            
                            "data": 'Student Id required',
                            "error": None
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

            assignment_id = request.GET.get('assignment_id')
            if assignment_id is None:
                return Response(
                        {
                            "success": False,
                            "user_not_logged_in": False,
                            "user_unauthorized": False,                            
                            "data": 'Student Id required',
                            "error": None
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

            submitted_assignment_obj = SubmittedAssignment.objects.filter(assignment_id=assignment_id, student_id=student_id).first()
            submitted_assignment = SubmittedAssignmentSerializer(submitted_assignment_obj).data

            data = {
                'submitted_assignment': submitted_assignment
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

            text_content = request.data.get('text_content')

            assignment_id = request.data.get('assignment_id')
            if not assignment_id:
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

            ind = 0
            document_paths = []

            already_submitted = SubmittedAssignment.objects.filter(assignment_id=assignment_id, student_id=user).exists()
            if already_submitted:
                return Response(
                        {
                            "success": False,
                            "user_not_logged_in": False,
                            "user_unauthorized": False,                            
                            "data": None,
                            "error": "Assignment already submitted."
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

            while True:
                if f'files[{ind}]' in request.FILES:
                    file_path = self.save_file(request.FILES[f'files[{ind}]'])
                    document_paths.append(file_path)
                    ind+=1

                else:
                    break

            new_assignment_submission = SubmittedAssignment(
                assignment_id=assignment_id,
                student_id=user,
                text_content=text_content,
                document_paths=document_paths
            )
            new_assignment_submission.save()

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

    def save_file(self, uploaded_file):
        # Define the base directory to save the files
        upload_dir = os.path.join(settings.MEDIA_ROOT, 'students_assignments/')
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

class AllSubmittedAssignmentViewSet(viewsets.ViewSet):
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

            assignment_id = request.GET.get('assignment_id')
            if assignment_id is None:
                return Response(
                        {
                            "success": False,
                            "user_not_logged_in": False,
                            "user_unauthorized": False,                            
                            "data": 'Assignment Id required',
                            "error": None
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

            assignment_data = Assignment.objects.filter(assignment_id=assignment_id).first()
            if not assignment_data:
                return Response(
                        {
                            "success": False,
                            "user_not_logged_in": False,
                            "user_unauthorized": False,                            
                            "data": 'Assignment not found',
                            "error": None
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

            subject_data = Subject.objects.filter(subject_id=assignment_data.subject_id).first()
            all_students = User.objects.filter(year=str(subject_data.college_year).lower().replace(' ', '_'), division=subject_data.class_division)

            all_assignments_submitted = []
            for student in all_students:
                assignment_submitted = SubmittedAssignment.objects.filter(assignment_id=assignment_id, student_id=student.user_id).exists()
                all_assignments_submitted.append({
                    "assignment_submitted": assignment_submitted,
                    "student_name": student.name,
                    "student_id": student.user_id,
                    "student_roll_no": student.roll_no
                })

            data = {
                'all_assignments_submitted': all_assignments_submitted
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

            subject_data = Subject.objects.filter(subject_id=subject_id).first()
            
            attendance_id, unique_code = self.generate_attendance_details()
            new_attendance = Attendance(
                attendance_id=attendance_id,
                subject_id=subject_id,
                college_year=subject_data.college_year,
                class_division=subject_data.class_division,
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

            attendance_details = Attendance.objects.filter(attendance_id=attendance_id, code=unique_code).first()
            if not attendance_details:
                return Response(
                        {
                            "success": False,
                            "user_not_logged_in": False,
                            "user_unauthorized": False,                            
                            "data": None,
                            "error": 'Attendance code is not valid.'
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

            attendance_id = request.GET.get('attendance_id')           
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

            attendance_data = Attendance.objects.filter(attendance_id=attendance_id).first()
            
            subject_data = Subject.objects.filter(subject_id=attendance_data.subject_id).first()
            all_students = User.objects.filter(year=str(subject_data.college_year).lower().replace(' ', '_'), division=subject_data.class_division)

            all_marked_attendances = []
            for student in all_students:
                attendance_marked = MarkedAttendance.objects.filter(attendance_id=attendance_id, student_id=student.user_id).exists()
                all_marked_attendances.append({
                    "attendance_marked": attendance_marked,
                    "student_name": student.name,
                    "student_id": student.user_id,
                    "student_roll_no": student.roll_no
                })
            
            data = {
                'all_marked_attendances': all_marked_attendances,                
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

class TeacherSubjectUniqueClassViewSet(viewsets.ViewSet):
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

            all_subjects = Subject.objects.filter(teacher_id=user)
            unique_class = self.get_unique_classes(all_subjects)

            data = {
                "unique_class": unique_class
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

    def get_unique_classes(self, data):
        unique_classes = set()
        
        for entry in data:
            college_year = entry.college_year
            class_division = entry.class_division
            unique_classes.add((college_year, class_division))
        
        return list(unique_classes)

class TeacherStudentDataViewSet(viewsets.ViewSet):
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

            college_year = request.GET.get('college_year')
            if not college_year:
                return Response(
                        {
                            "success": False,
                            "user_not_logged_in": False,
                            "user_unauthorized": False,                            
                            "data": None,
                            "error": "college_year required."
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

            class_division = request.GET.get('class_division')
            if not class_division:
                return Response(
                        {
                            "success": False,
                            "user_not_logged_in": False,
                            "user_unauthorized": False,                            
                            "data": None,
                            "error": "class_division required."
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

            all_subjects = Subject.objects.filter(teacher_id=user, class_division=class_division, college_year=college_year)
            all_subjects_text = ", ".join([subject_data.subject_name for subject_data in all_subjects[::-1]])

            all_students_obj = User.objects.filter(year=college_year, division=class_division)
            all_students = []
            
            for student in all_students_obj:
                all_students.append({
                    "student_roll_no": student.roll_no,
                    "student_name": student.name,
                    "student_id": student.user_id,

                })
                

            data = {
                "all_subjects_text": all_subjects_text,
                "all_students": all_students

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

class TeacherPerStudentDataViewSet(viewsets.ViewSet):
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
            
            student_id = request.GET.get('student_id')
            if not student_id:
                return Response(
                        {
                            "success": False,
                            "user_not_logged_in": False,
                            "user_unauthorized": False,                            
                            "data": None,
                            "error": "student_id required."
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

            student_data_obj = User.objects.filter(user_id=student_id).first()
            if not student_data_obj:
                return Response(
                        {
                            "success": False,
                            "user_not_logged_in": False,
                            "user_unauthorized": False,                            
                            "data": None,
                            "error": "student_id invalid."
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

            student_data = UserSerializer(student_data_obj).data

            # Get Assignment details
            all_assignment_obj = Assignment.objects.filter(college_year=student_data_obj.year, class_division=student_data_obj.division)
            total_assignment = len(all_assignment_obj)
            all_assignment_obj = all_assignment_obj[::-1]

            pending_assignment = []
            missed_assignment = []
            submitted_assignment = []

            for assignment in all_assignment_obj:
                assignment_data = StudentAssignmentSerializer(assignment, context={'student_id': student_data_obj.user_id}).data
                if not assignment_data.get('assignment_submitted', False):
                    deadline_datetime = isoparse(str(assignment_data.get('deadline_date')))
                    current_time = datetime.now(deadline_datetime.tzinfo)
                    if deadline_datetime > current_time:
                        print("The given datetime is in the future.")
                        pending_assignment.append(assignment_data)
                    else:
                        missed_assignment.append(assignment_data)
                        print("The given datetime is in the past.")

                else:
                    submitted_assignment.append(assignment_data)


            # Get Attendance details
            student_subjects = Subject.objects.filter(college_year=student_data_obj.year, class_division=student_data_obj.division)

            all_subject_attendances = []
            total_attendances = 0
            total_marked_attendances = 0

            for student_subject in student_subjects:
                all_attendance_subject = Attendance.objects.filter(subject_id=student_subject.subject_id)
                marked_attendances = 0
                for attendance_subject in all_attendance_subject:
                    attendance_marked = MarkedAttendance.objects.filter(attendance_id=attendance_subject.attendance_id, student_id=student_data_obj.user_id).exists()
                    if attendance_marked:
                        marked_attendances += 1
                
                total_attendances += len(all_attendance_subject)
                total_marked_attendances += marked_attendances

                try:
                    attendance_percentage = int((marked_attendances * 100) / len(all_attendance_subject))
                except:
                    print(f'in this for {student_subject.subject_name}')
                    attendance_percentage = 0
                
                all_subject_attendances.append({
                    "subject_id": student_subject.subject_id,
                    "subject_name": student_subject.subject_name,
                    "all_attendance_subject": len(all_attendance_subject),
                    "marked_attendances": marked_attendances,
                    "attendance_percentage": attendance_percentage
                })

            try:
                total_attendance_percentage = int((total_marked_attendances * 100) / total_attendances)
            except:
                total_attendance_percentage = 0

            data = {
                "student_data": student_data,

                "total_assignment": total_assignment,
                
                "pending_assignment": pending_assignment,
                "total_pending_assignment": len(pending_assignment),

                "missed_assignment": missed_assignment,
                "total_missed_assignment": len(missed_assignment),

                "submitted_assignment": submitted_assignment,
                "total_submitted_assignment": len(submitted_assignment),


                "all_subject_attendance": all_subject_attendances,
                "total_attendances": total_attendances,
                "total_marked_attendances": total_marked_attendances,
                "total_attendance_percentage": total_attendance_percentage

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
