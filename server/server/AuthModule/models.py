from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _
from jsonfield import JSONField


class AuthUser(AbstractUser):
    is_oauth = models.BooleanField(
        _('oauth user'),
        default=False,
        help_text=_('Designates whether the user is authenticated with oauth provider.'),
    )
    picture = models.TextField(null=True, blank=True)
    subscribed_rockets = JSONField(default=[])


class PasswordResetCode(models.Model):
    user = models.ForeignKey(AuthUser, on_delete=models.CASCADE)
    code = models.IntegerField(null=False, blank=False)
    expiration_time = models.DateTimeField(null=False, blank=False)
