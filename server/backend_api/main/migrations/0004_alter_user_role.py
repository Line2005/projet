# Generated by Django 5.1.4 on 2025-01-10 12:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0003_user_is_blocked'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='role',
            field=models.CharField(choices=[('entrepreneur', 'Entrepreneur'), ('investor', 'Investor'), ('ONG-Association', 'ONG-Association'), ('admin', 'Admin')], max_length=20),
        ),
    ]
