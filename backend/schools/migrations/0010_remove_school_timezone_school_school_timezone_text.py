# Generated by Django 5.0.1 on 2024-06-23 06:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('schools', '0009_grade_description'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='school',
            name='timezone',
        ),
        migrations.AddField(
            model_name='school',
            name='school_timezone_text',
            field=models.CharField(blank=True, default='', max_length=150),
        ),
    ]
