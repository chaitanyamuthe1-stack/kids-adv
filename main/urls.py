from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    
    # API endpoints - Authentication
    path('api/register/', views.api_register, name='api_register'),
    path('api/login/', views.api_login, name='api_login'),
    
    # API endpoints - Progress & Data
    path('api/progress/<str:username>/', views.api_progress, name='api_progress'),
    path('api/progress/', views.api_save_progress, name='api_save_progress'),
    
    # API endpoints - Pronunciation & Learning
    path('api/pronunciation/', views.api_log_pronunciation, name='api_log_pronunciation'),
    
    # API endpoints - Achievements & Gamification
    path('api/achievement/', views.api_unlock_achievement, name='api_unlock_achievement'),
    
    # API endpoints - Settings
    path('api/settings/', views.api_update_settings, name='api_update_settings'),
]