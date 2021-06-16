from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from server.AuthModule.models import AuthUser

admin.site.register(AuthUser, UserAdmin)
