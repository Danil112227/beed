# Generated by Django 5.0.1 on 2024-06-23 06:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0007_alter_user_options'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='user_timezone_text',
            field=models.CharField(blank=True, default='', max_length=150),
        ),
    ]
