from django.urls import path, include
import users.views as views
from rest_framework import routers

app_name = 'users'


view_router = routers.DefaultRouter()
view_router.register('users_profile', views.UsersProfileView, basename='users_profile')
view_router.register('users', views.UsersView, basename='users')


urlpatterns = [
    path('', include((view_router.urls, app_name), namespace='view')),
    path('self/', views.self_profile, name='self_profile'),
    path('login/', views.login_view, name='api_login'),
    path('super_login/', views.super_login_view, name='api_super_login'),
    path('reset-password/', views.ResetPasswordView.as_view(), name='reset-password'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
]
