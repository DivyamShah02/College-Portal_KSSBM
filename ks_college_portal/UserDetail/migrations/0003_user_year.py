# Generated by Django 5.1 on 2025-02-17 19:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('UserDetail', '0002_user_division_user_roll_no'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='year',
            field=models.CharField(default='', max_length=20),
            preserve_default=False,
        ),
    ]
