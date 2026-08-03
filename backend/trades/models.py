from django.db import models
from decimal import Decimal

class Strategy(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']
        verbose_name_plural = 'Strategies'

    def __str__(self):
        return self.name


class Trade(models.Model):
    TRADE_TYPE_CHOICES = [
        ('LONG', 'Long'),
        ('SHORT', 'Short'),
    ]

    ASSET_CLASS_CHOICES = [
        ('CRYPTO', 'Crypto'),
        ('STOCKS', 'Stocks'),
        ('FOREX', 'Forex'),
        ('OPTIONS', 'Options'),
        ('FUTURES', 'Futures'),
    ]

    STATUS_CHOICES = [
        ('OPEN', 'Open'),
        ('CLOSED', 'Closed'),
        ('CANCELLED', 'Cancelled'),
    ]

    EMOTION_CHOICES = [
        ('DISCIPLINED', 'Disciplined'),
        ('FOMO', 'FOMO'),
        ('REVENGE', 'Revenge'),
        ('FEARFUL', 'Fearful'),
        ('GREEDY', 'Greedy'),
        ('IMPULSIVE', 'Impulsive'),
        ('PATIENT', 'Patient'),
    ]

    # Basic Info
    symbol = models.CharField(max_length=30)
    trade_type = models.CharField(max_length=10, choices=TRADE_TYPE_CHOICES, default='LONG')
    asset_class = models.CharField(max_length=20, choices=ASSET_CLASS_CHOICES, default='CRYPTO')

    # Price & Size
    entry_price = models.DecimalField(max_digits=18, decimal_places=6)
    exit_price = models.DecimalField(max_digits=18, decimal_places=6, null=True, blank=True)
    stop_loss = models.DecimalField(max_digits=18, decimal_places=6, null=True, blank=True)
    take_profit = models.DecimalField(max_digits=18, decimal_places=6, null=True, blank=True)
    quantity = models.DecimalField(max_digits=18, decimal_places=6)
    fees = models.DecimalField(max_digits=12, decimal_places=4, default=Decimal('0.0000'))

    # Timestamps & Status
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='CLOSED')
    entry_time = models.DateTimeField()
    exit_time = models.DateTimeField(null=True, blank=True)

    # Psychology & Logic
    strategy = models.ForeignKey(Strategy, on_delete=models.SET_NULL, null=True, blank=True, related_name='trades')
    notes = models.TextField(blank=True, null=True, help_text="Trade setup logic, execution notes, and review")
    emotion = models.CharField(max_length=20, choices=EMOTION_CHOICES, default='DISCIPLINED')
    rating = models.IntegerField(default=3, help_text="Execution rating from 1 to 5 stars")

    # Media
    chart_entry = models.ImageField(upload_to='charts/entry/', null=True, blank=True)
    chart_exit = models.ImageField(upload_to='charts/exit/', null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-entry_time']

    def __str__(self):
        return f"{self.trade_type} {self.symbol} @ {self.entry_price} ({self.status})"

    @property
    def gross_pnl(self):
        if self.status != 'CLOSED' or self.exit_price is None:
            return Decimal('0.0000')
        if self.trade_type == 'LONG':
            return (self.exit_price - self.entry_price) * self.quantity
        else:
            return (self.entry_price - self.exit_price) * self.quantity

    @property
    def net_pnl(self):
        if self.status != 'CLOSED' or self.exit_price is None:
            return Decimal('0.0000')
        return self.gross_pnl - self.fees

    @property
    def return_percentage(self):
        capital = self.entry_price * self.quantity
        if capital > Decimal('0'):
            return (self.net_pnl / capital) * Decimal('100')
        return Decimal('0.00')

    @property
    def risk_reward_ratio(self):
        if self.stop_loss and self.take_profit:
            risk = abs(self.entry_price - self.stop_loss)
            reward = abs(self.take_profit - self.entry_price)
            if risk > Decimal('0'):
                return round(reward / risk, 2)
        elif self.stop_loss and self.exit_price and self.status == 'CLOSED':
            risk = abs(self.entry_price - self.stop_loss)
            actual_reward = (self.exit_price - self.entry_price) if self.trade_type == 'LONG' else (self.entry_price - self.exit_price)
            if risk > Decimal('0'):
                return round(actual_reward / risk, 2)
        return Decimal('0.00')

    @property
    def outcome(self):
        if self.status != 'CLOSED':
            return self.status
        net = self.net_pnl
        if net > Decimal('0'):
            return 'WIN'
        elif net < Decimal('0'):
            return 'LOSS'
        else:
            return 'BREAKEVEN'
