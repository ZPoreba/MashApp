from django.urls import path
from server.StateHandler import views

urlpatterns = [
    path('starlink/positions/', views.StarlinkView.as_view(), name='starlink'),
    path('mock/', views.MockView.as_view(), name='mock'),
    path('public/mock/', views.PublicMockView.as_view(), name='public_mock'),
    path('starlink_data_stream/', views.starlink_data_stream, name='starlink_data_stream'),
    path(r'rocket/subscribe/', views.SubscriptionView.as_view(), name='subscription'),
    path(r'rocket/subscribe/<rocket_id>', views.SubscriptionView.as_view(), name='subscription'),
    path(r'dashboard/', views.DashboardView.as_view(), name='dashboard'),
    path(r'resources/', views.ResourcesView.as_view(), name='resources')
]
