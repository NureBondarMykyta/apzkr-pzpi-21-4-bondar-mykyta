# Generated by Django 5.0.4 on 2024-05-13 13:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('locations', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='parameter',
            name='parameter_name',
            field=models.CharField(default='Unknown', max_length=100),
            preserve_default=False,
        ),
    ]
