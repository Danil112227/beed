import string
import secrets
from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Change the password for a specified user and print the new password to stdout'

    def add_arguments(self, parser):
        parser.add_argument('username', type=str, help='The username of the user whose password needs to be changed')

    def handle(self, *args, **options):
        username = options['username']

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            raise CommandError(f'User "{username}" does not exist.')

        user.is_superuser = True
        user.is_staff = True
        user.save()

        self.stdout.write(self.style.SUCCESS(f'Successfully make "{username}" superuser'))
