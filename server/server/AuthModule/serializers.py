import json
from rest_framework import serializers
from django.contrib.auth import get_user_model
User = get_user_model()


class UserSerializer(serializers.ModelSerializer):

    subscribed_rockets = serializers.JSONField()

    class Meta:
        model = User
        fields = ('id', 'username', 'is_superuser', 'is_oauth', 'first_name', 'last_name', 'email',
                  'picture', 'subscribed_rockets')
