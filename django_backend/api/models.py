from django.db import models

class UserProfile(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    password = models.CharField(max_length=255) # Storing plain just to match the fast API mock logic

    def __str__(self):
        return self.email
