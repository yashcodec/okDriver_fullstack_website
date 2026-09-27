from django.urls import path
from . import views

urlpatterns = [
    path('register', views.register_user),
    path('login', views.login_user),
    path('users/<str:user_id>', views.update_user),
]
