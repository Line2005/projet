# Generated by Django 5.1.4 on 2025-01-16 11:21

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0014_financialproposal_technicalproposal'),
    ]

    operations = [
        migrations.CreateModel(
            name='Contract',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('contract_type', models.CharField(choices=[('financial', 'Financial'), ('technical', 'Technical')], max_length=20)),
                ('pdf_file', models.FileField(upload_to='contracts/')),
                ('html_content', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('signature_entrepreneur', models.DateTimeField(blank=True, null=True)),
                ('signature_investor', models.DateTimeField(blank=True, null=True)),
                ('financial_proposal', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='contract', to='main.financialproposal')),
                ('technical_proposal', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='contract', to='main.technicalproposal')),
            ],
        ),
        migrations.CreateModel(
            name='Collaboration',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('start_date', models.DateTimeField(auto_now_add=True)),
                ('end_date', models.DateTimeField(blank=True, null=True)),
                ('is_active', models.BooleanField(default=True)),
                ('collaboration_type', models.CharField(choices=[('financial', 'Financial'), ('technical', 'Technical')], max_length=20)),
                ('entrepreneur', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='collaborations', to='main.entrepreneur')),
                ('investor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='collaborations', to='main.investor')),
                ('project', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='collaborations', to='main.project')),
                ('contract', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='collaboration', to='main.contract')),
            ],
            options={
                'unique_together': {('entrepreneur', 'investor', 'project', 'contract')},
            },
        ),
    ]
