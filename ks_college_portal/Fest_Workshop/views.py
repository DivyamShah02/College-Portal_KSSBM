from rest_framework.response import Response
from rest_framework import status
from rest_framework import viewsets
from rest_framework.exceptions import NotFound, ParseError

from django.conf import settings
from django.shortcuts import get_object_or_404, render, redirect
from django.contrib.auth import authenticate, login, logout

from .serializers import *
from .models import *

import os
import random
import string
from datetime import datetime, timedelta


logger = None


class TeacherEventViewSet(viewsets.ViewSet):
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

            event_name = request.data.get('event_name')
            event_type = request.data.get('event_type')
            description = request.data.get('description')
            notes = request.data.get('notes')
            event_duration = request.data.get('event_duration')

            if (event_name == None) or (description == None) or (event_type == None)\
                or (notes == None) or (event_duration == None):
                    return Response(
                            {
                                "success": False,
                                "user_not_logged_in": False,
                                "user_unauthorized": False,                            
                                "data": None,
                                "error": 'Details not provided.'
                            },
                            status=status.HTTP_400_BAD_REQUEST
                        )

            event_id = self.generate_event_id()
            new_subject = Fest_Workshop(
                        event_id=event_id,
                        teacher_id=user,
                        event_name=event_name,
                        event_type=event_type,
                        description=description,
                        notes=notes,
                        event_duration=event_duration
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

    def generate_event_id(self):
        while True:
            event_id = ''.join(random.choices(string.digits, k=10))
            if not Fest_Workshop.objects.filter(event_id=event_id).exists():
                return event_id

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

            all_events_obj = Fest_Workshop.objects.filter(teacher_id=user)
            all_events = Fest_WorkshopSerializer(all_events_obj, many=True).data

            data = {
                'all_events': all_events[::-1],
                'total_events': len(all_events),
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

class StudentEventViewSet(viewsets.ViewSet):
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

            all_events_obj = Fest_Workshop.objects.all()
            all_events = StudentFest_WorkshopSerializer(all_events_obj, many=True, context={'student_id': user}).data

            data = {
                'all_events': all_events[::-1],
                'total_events': len(all_events),
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

class EventAnnouncementViewSet(viewsets.ViewSet):
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

            event_id = request.GET.get('event_id')
            if not event_id:
                return Response(
                        {
                            "success": False,
                            "user_not_logged_in": False,
                            "user_unauthorized": False,                            
                            "data": None,
                            "error": "Event Announcement Id required."
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

            if user.role == 'teacher':
                event_data_obj = Fest_Workshop.objects.filter(event_id=event_id, teacher_id=user).exists()
                if not event_data_obj:
                    return Response(
                            {
                                "success": False,
                                "user_not_logged_in": False,
                                "user_unauthorized": False,                            
                                "data": None,
                                "error": "Event Id is not valid or you are not authorized to get information."
                            },
                            status=status.HTTP_400_BAD_REQUEST
                        )

            elif user.role == 'student':
                check_user_registered = EventRegistration.objects.filter(event_id=event_id, student_id=user).exists()
                if not check_user_registered:
                    return Response(
                            {
                                "success": False,
                                "user_not_logged_in": False,
                                "user_unauthorized": False,                            
                                "data": None,
                                "error": "Event Id is not valid or you are not authorized to get information."
                            },
                            status=status.HTTP_400_BAD_REQUEST
                        )

            event_data_obj = Fest_Workshop.objects.filter(event_id=event_id).first()
            event_data = Fest_WorkshopSerializer(event_data_obj).data

            all_event_announcements_obj = EventAnnouncement.objects.filter(event_id=event_id)
            all_event_announcements = EventAnnouncementSerializer(all_event_announcements_obj, many=True).data

            user_registered = True
            all_registered_students = []

            if user.role == 'student':
                user_registered = EventRegistration.objects.filter(event_id=event_id, student_id=user).exists()
            
            elif user.role == 'teacher':
                all_registered_students_obj = EventRegistration.objects.filter(event_id=event_id)
                all_registered_students = EventRegistrationSerializer(all_registered_students_obj, many=True).data

            data = {
                'all_event_announcements': all_event_announcements[::-1],
                'total_event_announcements': len(all_event_announcements),
                'event_data': event_data,
                'all_registered_students': all_registered_students,
                'user_registered': user_registered,
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
                       
            announcement_content = request.data.get('announcement_content')
            if not announcement_content:
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

            event_id = request.data.get('event_id')
            if not event_id:
                return Response(
                        {
                            "success": False,
                            "user_not_logged_in": False,
                            "user_unauthorized": False,                            
                            "data": None,
                            "error": "Event Id required."
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

            event_announcement_id = self.generate_event_announcement_id()

            new_event_announcements = EventAnnouncement(
                event_announcement_id=event_announcement_id,
                event_id=event_id,
                announcement_content=announcement_content
            )
            new_event_announcements.save()
           
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

    def generate_event_announcement_id(self):
        while True:
            event_announcement_id = ''.join(random.choices(string.digits, k=10))
            if not EventAnnouncement.objects.filter(event_announcement_id=event_announcement_id).exists():
                return event_announcement_id

class EventRegistrationViewSet(viewsets.ViewSet):
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

            event_id = request.GET.get('event_id')
            if not event_id:
                return Response(
                        {
                            "success": False,
                            "user_not_logged_in": False,
                            "user_unauthorized": False,                            
                            "data": None,
                            "error": "Event Announcement Id required."
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

            all_placement_registrations_obj = EventRegistration.objects.filter(event_id=event_id)
            all_placement_registrations = EventRegistrationSerializer(all_placement_registrations_obj, many=True).data

            data = {
                'all_placement_registrations': all_placement_registrations[::-1],
                'total_placement_registrations': len(all_placement_registrations),
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

            event_id = request.data.get('event_id')
            if not event_id:
                return Response(
                        {
                            "success": False,
                            "user_not_logged_in": False,
                            "user_unauthorized": False,                            
                            "data": None,
                            "error": "Event Id required."
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

            user_registered = EventRegistration.objects.filter(event_id=event_id, student_id=user).exists()
            if user_registered:
                return Response(
                    {
                        "success": False,
                        "user_not_logged_in": False,
                        "user_unauthorized": False,                        
                        "data": None,
                        "error": 'Student already registered to this event.'
                    },
                    status=status.HTTP_200_OK
                )

            registration_id = self.generate_registration_id()

            new_placement_registrations = EventRegistration(
                registration_id=registration_id,
                event_id=event_id,
                student_id=user
            )
            new_placement_registrations.save()
           
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

    def generate_registration_id(self):
        while True:
            registration_id = ''.join(random.choices(string.digits, k=10))
            if not EventRegistration.objects.filter(registration_id=registration_id).exists():
                return registration_id

