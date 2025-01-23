# Generated by Django 5.1.4 on 2025-01-13 10:48

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0012_project_projectdocument'),
    ]

    operations = [
        migrations.CreateModel(
            name='HelpRequest',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('request_type', models.CharField(choices=[('technical', 'Technical Help'), ('financial', 'Financial Help')], max_length=20)),
                ('specific_need', models.CharField(max_length=255)),
                ('description', models.TextField()),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('completed', 'Completed')], default='pending', max_length=20)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('entrepreneur', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.entrepreneur')),
                ('project', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='help_requests', to='main.project')),
            ],
        ),
        migrations.CreateModel(
            name='FinancialRequest',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount_requested', models.DecimalField(decimal_places=2, max_digits=12)),
                ('interest_rate', models.DecimalField(decimal_places=2, default=5.0, max_digits=5)),
                ('duration_months', models.IntegerField()),
                ('help_request', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='main.helprequest')),
            ],
        ),
        migrations.CreateModel(
            name='TechnicalRequest',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('expertise_needed', models.CharField(max_length=255)),
                ('estimated_duration', models.IntegerField(help_text='Estimated duration in days')),
                ('help_request', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='main.helprequest')),
            ],
        ),
    ]
