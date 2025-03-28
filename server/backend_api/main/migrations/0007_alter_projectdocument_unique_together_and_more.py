# Generated by Django 5.1.4 on 2025-01-12 14:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0006_alter_user_role_project_projectdocument'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='projectdocument',
            unique_together=set(),
        ),
        migrations.AlterField(
            model_name='project',
            name='description',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='project',
            name='financing_plan',
            field=models.CharField(max_length=255),
        ),
        migrations.AlterField(
            model_name='project',
            name='specific_objectives',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='projectdocument',
            name='document_type',
            field=models.CharField(choices=[('id_card', "Carte Nationale d'Identité"), ('business_register', 'Registre de Commerce'), ('company_statutes', "Statuts de l'Entreprise"), ('tax_clearance', 'Attestation de Non Redevance Fiscale'), ('permits', 'Permis et Licences'), ('intellectual_property', 'Propriété Intellectuelle'), ('photos', 'photo'), ('feasibility_study', 'Étude de Faisabilité')], max_length=50),
        ),
        migrations.AddConstraint(
            model_name='projectdocument',
            constraint=models.UniqueConstraint(condition=models.Q(('document_type', 'photo'), _negated=True), fields=('project', 'document_type'), name='unique_document_type_per_project'),
        ),
    ]
