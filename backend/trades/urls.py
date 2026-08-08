from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    StrategyViewSet, 
    TradeViewSet, 
    analytics_view,
    register_view,
    login_view,
    user_me_view,
    health_check_view
)

router = DefaultRouter()
router.register(r'strategies', StrategyViewSet, basename='strategy')
router.register(r'trades', TradeViewSet, basename='trade')

urlpatterns = [
    path('', include(router.urls)),
    path('health/', health_check_view, name='health_check'),
    path('analytics/', analytics_view, name='analytics'),
    path('auth/register/', register_view, name='auth_register'),
    path('auth/login/', login_view, name='auth_login'),
    path('auth/me/', user_me_view, name='auth_me'),
]
