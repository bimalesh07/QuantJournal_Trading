from rest_framework import viewsets, status
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from django.db.models import Q
from datetime import datetime

from .models import Strategy, Trade
from .serializers import StrategySerializer, TradeSerializer
from .services import AnalyticsService

class StrategyViewSet(viewsets.ModelViewSet):
    queryset = Strategy.objects.all()
    serializer_class = StrategySerializer


class TradeViewSet(viewsets.ModelViewSet):
    queryset = Trade.objects.all()
    serializer_class = TradeSerializer

    def get_queryset(self):
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


@api_view(['GET'])
def analytics_view(request):
    trade_viewset = TradeViewSet()
    trade_viewset.request = request
    queryset = trade_viewset.get_queryset()
    data = AnalyticsService.calculate_analytics(queryset)
    return Response(data, status=status.HTTP_200_OK)
