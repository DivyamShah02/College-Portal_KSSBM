# Generated by Django 5.1 on 2025-04-08 11:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Fest_Workshop', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='fest_workshop',
            name='event_type',
            field=models.CharField(default='Fest', max_length=10),
            preserve_default=False,
        ),
    ]
