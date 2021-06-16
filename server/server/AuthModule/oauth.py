import requests
import json
from server import settings
from oauth2_provider.models import AccessToken
from django.contrib.auth import get_user_model
User = get_user_model()


def get_google_access_token(google_code):
    auth_response = requests.post(
        'https://oauth2.googleapis.com/token',
        data=json.dumps({
            'client_id': settings.SOCIAL_AUTH_GOOGLE_OAUTH2_KEY,
            'client_secret': settings.SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET,
            'code': google_code,
            'grant_type': 'authorization_code',
            'redirect_uri': 'postmessage'
        }),
        headers={'content-type': 'application/json'}
    )
    resp = json.loads(auth_response.content.decode('utf-8'))
    return resp['access_token']


def convert_to_google_auth_token(token):
    params = {
        'grant_type': 'convert_token',
        'client_id': settings.CLIENT_ID,
        'client_secret': settings.CLIENT_SECRET,
        'backend': 'google-oauth2',
        'token': token
    }
    response = requests.post(settings.BASE_URL + '/api/auth/social_oauth/convert-token/', params=params)
    return response.json()


def convert_to_facebook_auth_token(token):
    params = {
        'grant_type': 'convert_token',
        'client_id': settings.CLIENT_ID,
        'client_secret': settings.CLIENT_SECRET,
        'backend': 'facebook',
        'token': token
    }
    response = requests.post(settings.BASE_URL + '/api/auth/social_oauth/convert-token/', params=params)
    return response.json()


def get_user_for_token(auth_token):
    return User.objects.get(id=AccessToken.objects.get(token=auth_token['access_token']).user_id)
