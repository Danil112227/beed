from django.urls import path, include
import homeworks.views as views
from rest_framework import routers

app_name = 'homeworks'

view_router = routers.DefaultRouter()
view_router.register('homeworks', views.HomeworkView, basename='homeworks')
view_router.register('answers', views.AnswerView, basename='answers')
view_router.register('teacher_answers', views.TeacherAnswerView, basename='answers')


urlpatterns = [
    path('', include((view_router.urls, app_name), namespace='view')),
]
