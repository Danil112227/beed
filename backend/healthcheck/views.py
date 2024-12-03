from watchman import views
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny


class StatusView(APIView):
    permission_classes = (AllowAny, )

    @staticmethod
    def get(request, *args, **kwargs):
        return views.bare_status(request, *args, **kwargs)


class PingView(APIView):
    permission_classes = (AllowAny, )

    @staticmethod
    def get(request, *args, **kwargs):
        return views.ping(request)
