from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include([
        path('healthcheck/', include(('healthcheck.urls', 'healthcheck'), namespace='healthcheck')),
        path('users/', include(('users.urls', 'users'), namespace='users')),
        path('timetable/', include(('timetable.urls', 'timetable'), namespace='timetable')),
        path('materials/', include(('materials.urls', 'materials'), namespace='materials')),
        path('homeworks/', include(('homeworks.urls', 'homeworks'), namespace='homeworks')),
        path('schools/', include(('schools.urls', 'schools'), namespace='schools')),
    ])),
]
