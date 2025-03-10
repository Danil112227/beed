# Generated by Django 5.0.1 on 2024-06-23 06:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('homeworks', '0006_remove_homework_status_answer_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='answer',
            name='status',
            field=models.IntegerField(choices=[(0, 'assigned'), (1, 'done'), (2, 'undone'), (3, 'under_review')], default=3),
        ),
    ]
