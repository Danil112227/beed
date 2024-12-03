from rest_framework import routers
from django.urls import path, include
import timetable.views as timetable_views

app_name = 'timetable'

view_router = routers.DefaultRouter()
view_router.register('period', timetable_views.PeriodView, basename='period')
view_router.register('master_lesson', timetable_views.MasterLessonView, basename='master_lesson')
view_router.register('lesson', timetable_views.LessonView, basename='lesson')

urlpatterns = [
    path('', include((view_router.urls, app_name), namespace='view')),
]
