# Generated by Django 5.1 on 2025-03-23 06:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ClassRoom', '0005_markedattendance_remove_attendance_attendance'),
    ]

    operations = [
        migrations.AddField(
            model_name='assignment',
            name='attached_docs',
            field=models.BooleanField(default=False),
        ),
    ]
