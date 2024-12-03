from django.urls import path, include
from rest_framework import routers
import schools.views as schools_views

app_name = 'schools'


view_router = routers.DefaultRouter()
view_router.register('school', schools_views.SchoolView, basename='school')
view_router.register('grade', schools_views.GradeView, basename='grade')
view_router.register('simple_grades', schools_views.SimpleGradeView, basename='simple_grades')
view_router.register('discipline', schools_views.DisciplineView, basename='discipline')


urlpatterns = [
    path('', include((view_router.urls, app_name), namespace='view')),
]
