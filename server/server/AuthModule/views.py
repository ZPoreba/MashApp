import os

import pytz
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from server.AuthModule.models import PasswordResetCode
from server.AuthModule.oauth import get_google_access_token, convert_to_google_auth_token, get_user_for_token, \
    convert_to_facebook_auth_token
from server.AuthModule.serializers import UserSerializer
from django.db.models import Q
from rest_framework_jwt import views as jwt_views
from django.contrib.auth import get_user_model
import smtplib, ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import random
import datetime
from server.settings import DEV_EMAIL_PASSWORD

User = get_user_model()


class RegisterView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        data = request.data
        try:
            if not User.objects.filter(Q(username=data['username']) | Q(email=data['email'])).exists():
                user = User.objects.create_user(**data)
            else:
                error = {
                    'error': 'access_denied',
                    'error_description': 'User with provided username or email already exists'
                }
                return Response(error, status=409)
        except Exception as e:
            return Response(str(e), status=500)
        return Response(UserSerializer(user).data)


class JSONWebToken(jwt_views.ObtainJSONWebToken):
    permission_classes = (AllowAny,)

    @staticmethod
    def _handle_success(response):
        response.data['token'] = {
            'access_token': response.data['token'],
            'token_type': 'JWT'
        }
        return response

    @staticmethod
    def _handle_error(response):
        error = {
            'error': 'access_denied',
            'error_description': response.data['non_field_errors'][0]
        }
        return Response(error, status=400)

    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, args, kwargs)
            if response.status_code == 200:
                return self._handle_success(response)
            if 'non_field_errors' in response.data.keys():
                return self._handle_error(response)
        except Exception as e:
            return Response(str(e), status=500)


class OAuth(APIView):
    permission_classes = (AllowAny,)

    def post(self, request, provider):
        try:
            if provider == 'google':
                access_token = get_google_access_token(google_code=request.data["code"])
                auth_token = convert_to_google_auth_token(access_token)

                if 'access_token' in auth_token.keys():
                    user = get_user_for_token(auth_token)
                    return Response({'token': auth_token, 'user': UserSerializer(user).data}, status=200)
                else:
                    auth_token['error_description'] = 'User with provided email already exists'
                    return Response(auth_token, status=409)
            if provider == 'facebook':
                auth_token = convert_to_facebook_auth_token(request.data['accessToken'])
                if 'access_token' in auth_token.keys():
                    print(auth_token)
                    user = get_user_for_token(auth_token)
                    print(user)
                    return Response({'token': auth_token, 'user': UserSerializer(user).data}, status=200)
                else:
                    auth_token['error_description'] = 'User with provided email already exists or provided email is empty'
                    return Response(auth_token, status=409)
        except Exception as e:
            return Response(str(e), status=500)


class ResetCode(APIView):
    permission_classes = (AllowAny,)

    def send_reset_password(self, email, code):
        context = ssl.create_default_context()
        with smtplib.SMTP_SSL("smtp.gmail.com", context=context) as server:
            server.login("mash.app.team@gmail.com", DEV_EMAIL_PASSWORD)

            msg = MIMEMultipart('alternative')
            msg['Subject'] = f'MashApp password reset'
            msg['From'] = 'mash.app.team@gmail.com'
            msg['To'] = email

            text = "Hello MashApp user!\n\nWe heard you forgot your password. Here is reset code for you: {}" \
                   "\nDo not share this code with anyone!\n\nBest Regards,\n" \
                   "MashApp Team".format(code)
            html = """\
            <html>
              <head></head>
              <body style="font-weight:lighter;">
                <p>
                    <h3>
                    Hello MashApp user!
                    </h3>
                    We heard you forgot your password. Here is reset code for you: <strong>{}</strong><br>
                    <u>Do not share this code with anyone!</u>
                    <br><br>
                    Best Regards,<br>
                    MashApp Team
                </p>
              </body>
            </html>
            """.format(code)

            part1 = MIMEText(text, 'plain')
            part2 = MIMEText(html, 'html')

            msg.attach(part1)
            msg.attach(part2)

            server.send_message(msg)
            server.quit()

    def generate_code(self, user):
        now = datetime.datetime.now()
        hours_added = datetime.timedelta(minutes=15)
        expiration_time = now + hours_added
        int_code = random.randint(1000, 9999)
        code = PasswordResetCode(user=user, code=int_code, expiration_time=expiration_time)
        code.save()
        return int_code

    def post(self, request):
        email = request.data['email']

        if User.objects.filter(email__exact=email).exists():
            user = User.objects.get(email__exact=email)
            if user.is_oauth:
                return Response('User logged with OAuth. Password reset not available', status=500)
            elif PasswordResetCode.objects.filter(user=user):
                password_reset_code = PasswordResetCode.objects.get(user=user)
                expiration_time = password_reset_code.expiration_time
                now = datetime.datetime.now()
                if expiration_time.replace(tzinfo=pytz.UTC) < now.replace(tzinfo=pytz.UTC):
                    code = self.generate_code(user)
                    password_reset_code.delete()
                    self.send_reset_password(email, code)
                    return Response(user.username, status=200)
                else:
                    return Response('Password reset code has been already generated. Try again after 15 minutes', status=500)
            else:
                code = self.generate_code(user)
                self.send_reset_password(email, code)
                return Response(user.username, status=200)
        else:
            return Response('User with provided email does not exists', status=500)

    def put(self, request):
        request_username = request.data.get('username', '')
        request_code = int(request.data.get('code', 0))

        if User.objects.filter(username__exact=request_username).exists():
            user = User.objects.get(username__exact=request_username)
            if PasswordResetCode.objects.filter(user=user):
                code = PasswordResetCode.objects.get(user=user)
                if code.code == request_code:
                    code.delete()
                    return Response(status=200)
                else:
                    return Response('Code is incorrect!', status=500)
        return Response('User is incorrect!', status=500)


class ResetPassword(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        request_username = request.data.get('username', '')
        request_password = request.data.get('password', None)

        if User.objects.filter(username__exact=request_username).exists() and request_password is not None:
            user = User.objects.get(username__exact=request_username)
            user.set_password(request_password)
            user.save()
            return Response(status=200)
        return Response('User or password are incorrect!', status=500)


class EditUserData(APIView):

    def post(self, request):
        user = request.user
        first_name = request.data.get('first_name', None)
        last_name = request.data.get('last_name', None)

        if first_name is not None:
            user.first_name = first_name
        if last_name is not None:
            user.last_name = last_name
        user.save()
        return Response(UserSerializer(user).data, status=200)


class ChangePassword(APIView):

    def post(self, request):
        user = request.user
        old_password = request.data.get('old_password', None)
        password = request.data.get('password', None)

        if old_password is None:
            return Response('Old password is incorrect', status=500)
        else:
            if user.check_password(old_password):
                user.set_password(password)
                user.save()
                return Response(status=200)
            else:
                return Response('Old password is incorrect', status=500)
