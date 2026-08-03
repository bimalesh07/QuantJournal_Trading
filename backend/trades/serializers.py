from rest_framework import serializers
from .models import Strategy, Trade

class StrategySerializer(serializers.ModelSerializer):
    trade_count = serializers.SerializerMethodField()

    class Meta:
        model = Strategy
        fields = ['id', 'name', 'description', 'trade_count', 'created_at']

    def get_trade_count(self, obj):
        return obj.trades.count()


class TradeSerializer(serializers.ModelSerializer):
    strategy_name = serializers.ReadOnlyField(source='strategy.name')
    gross_pnl = serializers.ReadOnlyField()
    net_pnl = serializers.ReadOnlyField()
    return_percentage = serializers.ReadOnlyField()
    risk_reward_ratio = serializers.ReadOnlyField()
    outcome = serializers.ReadOnlyField()

    class Meta:
        model = Trade
        fields = [
            'id',
            'symbol',
            'trade_type',
            'asset_class',
            'entry_price',
            'exit_price',
            'stop_loss',
            'take_profit',
            'quantity',
            'fees',
            'status',
            'entry_time',
            'exit_time',
            'strategy',
            'strategy_name',
            'notes',
            'emotion',
            'rating',
            'chart_entry',
            'chart_exit',
            'gross_pnl',
            'net_pnl',
            'return_percentage',
            'risk_reward_ratio',
            'outcome',
            'created_at',
            'updated_at',
        ]
