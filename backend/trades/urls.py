from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StrategyViewSet, TradeViewSet, analytics_view

router = DefaultRouter()
router.register(r'strategies', StrategyViewSet, basename='strategy')
router.register(r'trades', TradeViewSet, basename='trade')

urlpatterns = [
    path('', include(router.urls)),
    path('analytics/', analytics_view, name='analytics'),
]
