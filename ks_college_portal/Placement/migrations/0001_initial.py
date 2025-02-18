# Generated by Django 5.1 on 2025-02-18 13:15

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Company',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('company_id', models.CharField(max_length=12, unique=True)),
                ('teacher_id', models.CharField(max_length=12)),
                ('company_name', models.CharField(max_length=255)),
                ('description', models.TextField()),
                ('website', models.CharField(max_length=255)),
                ('job_role', models.TextField()),
                ('notes', models.TextField()),
                ('internship_duration', models.CharField(max_length=255)),
                ('internship_stipend', models.CharField(max_length=255)),
                ('estimated_package', models.CharField(max_length=255)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='PlacementCell',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('student_id', models.CharField(max_length=12)),
                ('screenshot_path', models.CharField(max_length=255)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='PlacmentRegistration',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('registration_id', models.CharField(max_length=12, unique=True)),
                ('company_id', models.CharField(max_length=12)),
                ('student_id', models.CharField(max_length=12)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]
