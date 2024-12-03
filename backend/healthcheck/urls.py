from django.urls import path
from healthcheck.views import StatusView, PingView


urlpatterns = [
    path('ping/', PingView.as_view()),
    path('status/', StatusView.as_view()),
]
