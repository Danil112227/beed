from django.core.management.base import BaseCommand, CommandError
from users.models import User

class Command(BaseCommand):
    help = 'Create a new user with username=admin and password=admin'

    def handle(self, *args, **options):
        username = 'admin'
        password = 'admin'
        first_name = 'admin'
        last_name = 'admin'
        user_type = User.TEACHER

        if User.objects.filter(username=username).exists():
            raise CommandError(f'User "{username}" already exists.')

        User.objects.create_user(
            username=username,
            first_name = first_name,
            last_name = last_name,
            password=password,
            type=user_type,
        )
        self.stdout.write(self.style.SUCCESS(f'Successfully created user "{username}"'))
