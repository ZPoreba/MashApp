from social_core.exceptions import InvalidEmail
from django.contrib.auth import get_user_model
from social_core.pipeline.partial import partial


User = get_user_model()


def check_email(backend, user, response, is_new=False, *args, **kwargs):
    if 'email' not in response.keys():
        raise InvalidEmail(backend)
    if is_new and User.objects.filter(email=response['email']).exists():
        raise InvalidEmail(backend)
    else:
        return response


@partial
def set_is_oauth(strategy, details, user=None, is_new=False, *args, **kwargs):
    if is_new:
        details['is_oauth'] = True


def update_user_social_data(strategy, *args, **kwargs):
    response = kwargs['response']
    backend = kwargs['backend']
    user = kwargs['user']

    if backend.name == "google-oauth2" and response['picture']:
        url = response['picture']
        user.picture = url
        user.save()

    if backend.name == "facebook":
        url = 'https://graph.facebook.com/{0}/picture/?type=large&access_token={1}'.format(response['id'], response['access_token'])
        user.picture = url
        user.save()
