from django.urls import path
from server.AuthModule.views import RegisterView, OAuth, JSONWebToken, ResetPassword, ResetCode, EditUserData, \
    ChangePassword
from django.conf.urls import url, include

urlpatterns = [
    url(r'^social_oauth/', include('rest_framework_social_oauth2.urls')),
    path('login/', JSONWebToken.as_view(), name='token_obtain'),
    path('register/', RegisterView.as_view(), name='register'),
    path(r'oauth/login/<provider>/', OAuth.as_view(), name='auth'),
    path('reset_code/', ResetCode.as_view(), name='reset_code'),
    path('reset_password/', ResetPassword.as_view(), name='reset_password'),
    path('edit_user_data/', EditUserData.as_view(), name='edit_user_data'),
    path('change_password/', ChangePassword.as_view(), name='change_password'),
]
