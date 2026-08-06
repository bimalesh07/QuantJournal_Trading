from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db.models import Q
from datetime import datetime

from .models import Strategy, Trade
from .serializers import StrategySerializer, TradeSerializer, UserSerializer
from .services import AnalyticsService

# User Authentication Views
@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    username = request.data.get('username', '').strip()
    email = request.data.get('email', '').strip()
    password = request.data.get('password', '').strip()

    if not username or not password:
        return Response({'error': 'Username and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username__iexact=username).exists():
        return Response({'error': 'Username already exists.'}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, email=email, password=password)
    user.first_name = request.data.get('first_name', username)
    user.save()

    # Automatically claim any unassigned trades to the first registered user so local data isn't lost
    Trade.objects.filter(user__isnull=True).update(user=user)
    Strategy.objects.filter(user__isnull=True).update(user=user)

    token, _ = Token.objects.get_or_create(user=user)
    return Response({
        'token': token.key,
        'user': UserSerializer(user).data
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get('username', '').strip()
    password = request.data.get('password', '').strip()

    if not username or not password:
        return Response({'error': 'Username and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(username=username, password=password)
    if not user:
        return Response({'error': 'Invalid username or password credentials.'}, status=status.HTTP_401_UNAUTHORIZED)

    token, _ = Token.objects.get_or_create(user=user)
    return Response({
        'token': token.key,
        'user': UserSerializer(user).data
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_me_view(request):
    return Response({'user': UserSerializer(request.user).data}, status=status.HTTP_200_OK)


class StrategyViewSet(viewsets.ModelViewSet):
    serializer_class = StrategySerializer

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Strategy.objects.filter(Q(user=self.request.user) | Q(user__isnull=True))
        return Strategy.objects.all()

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(user=user)


class TradeViewSet(viewsets.ModelViewSet):
    serializer_class = TradeSerializer

    def get_queryset(self):
        if self.request.user.is_authenticated:
            queryset = Trade.objects.filter(Q(user=self.request.user) | Q(user__isnull=True))
        else:
            queryset = Trade.objects.all()

        params = self.request.query_params

        # Filter by symbol
        symbol = params.get('symbol')
        if symbol:
            queryset = queryset.filter(symbol__icontains=symbol)

        # Filter by strategy
        strategy = params.get('strategy')
        if strategy:
            queryset = queryset.filter(strategy_id=strategy)

        # Filter by trade_type
        trade_type = params.get('trade_type')
        if trade_type:
            queryset = queryset.filter(trade_type=trade_type)

        # Filter by asset_class
        asset_class = params.get('asset_class')
        if asset_class:
            queryset = queryset.filter(asset_class=asset_class)

        # Filter by status
        trade_status = params.get('status')
        if trade_status:
            queryset = queryset.filter(status=trade_status)

        # Filter by emotion
        emotion = params.get('emotion')
        if emotion:
            queryset = queryset.filter(emotion=emotion)

        # Filter by tag
        tag = params.get('tag')
        if tag:
            queryset = queryset.filter(tags__icontains=tag)

        # Filter by date range
        date_from = params.get('date_from')
        date_to = params.get('date_to')
        if date_from:
            queryset = queryset.filter(entry_time__gte=date_from)
        if date_to:
            queryset = queryset.filter(entry_time__lte=date_to)

        # Filter by outcome (Win / Loss / Breakeven)
        outcome = params.get('outcome')
        if outcome:
            closed_queryset = queryset.filter(status='CLOSED')
            if outcome == 'WIN':
                trade_ids = [t.id for t in closed_queryset if t.net_pnl > 0]
                queryset = queryset.filter(id__in=trade_ids)
            elif outcome == 'LOSS':
                trade_ids = [t.id for t in closed_queryset if t.net_pnl < 0]
                queryset = queryset.filter(id__in=trade_ids)
            elif outcome == 'BREAKEVEN':
                trade_ids = [t.id for t in closed_queryset if t.net_pnl == 0]
                queryset = queryset.filter(id__in=trade_ids)

        return queryset

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(user=user)


@api_view(['GET'])
def analytics_view(request):
    trade_viewset = TradeViewSet()
    trade_viewset.request = request
    queryset = trade_viewset.get_queryset()
    data = AnalyticsService.calculate_analytics(queryset)
    return Response(data, status=status.HTTP_200_OK)
