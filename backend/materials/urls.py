from django.urls import path, include
import materials.views as materials_views
from rest_framework import routers

app_name = 'materials'

view_router = routers.DefaultRouter()
view_router.register('materials', materials_views.MaterialsView, basename='materials')
view_router.register('lesson_materials', materials_views.LessonMaterialsView, basename='lesson_materials')
view_router.register('document', materials_views.DocumentView, basename='document')


urlpatterns = [
    path('', include((view_router.urls, app_name), namespace='view')),
]
