from django.contrib import admin
from .models import Strategy, Trade

@admin.register(Strategy)
class StrategyAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'description', 'created_at')
    search_fields = ('name',)

@admin.register(Trade)
class TradeAdmin(admin.ModelAdmin):
    list_display = ('id', 'symbol', 'trade_type', 'asset_class', 'entry_price', 'exit_price', 'quantity', 'status', 'strategy', 'emotion', 'entry_time')
    list_filter = ('trade_type', 'asset_class', 'status', 'emotion', 'strategy')
    search_fields = ('symbol', 'notes')
    date_hierarchy = 'entry_time'
