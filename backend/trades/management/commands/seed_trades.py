from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from decimal import Decimal
import random
from trades.models import Strategy, Trade

class Command(BaseCommand):
    help = 'Seed database with realistic demo strategies and trade logs'

    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING('Seeding trading journal data...'))

        # Create Strategies
        strategies_data = [
            {'name': 'Breakout & Retest', 'description': 'Trading key horizontal support/resistance break with confirmation candle.'},
            {'name': 'ICT Silver Bullet', 'description': 'Inner Circle Trader 1-hour Fair Value Gap liquidity raid model.'},
            {'name': 'Support & Resistance Bounce', 'description': 'Reversal entry at major daily/weekly key levels with RSI divergence.'},
            {'name': 'Trendline Continuation', 'description': 'Pullback to moving averages (20/50 EMA) in established trend.'},
            {'name': 'FOMO Impulse Trade', 'description': 'Unplanned chasing of green candles without setup.'},
        ]

        strategies = {}
        for sdata in strategies_data:
            strat, _ = Strategy.objects.get_or_create(name=sdata['name'], defaults={'description': sdata['description']})
            strategies[sdata['name']] = strat

        self.stdout.write(self.style.SUCCESS(f'Created {len(strategies)} strategies.'))

        # Sample trades dataset
        sample_symbols = [
            ('BTC/USDT', 'CRYPTO', 65000, 72000, 0.25),
            ('ETH/USDT', 'CRYPTO', 3200, 3700, 2.5),
            ('AAPL', 'STOCKS', 220, 240, 50),
            ('NVDA', 'STOCKS', 115, 135, 100),
            ('EUR/USD', 'FOREX', 1.0850, 1.0980, 10000),
            ('GBP/JPY', 'FOREX', 195.50, 199.00, 5000),
            ('SPY 550 C', 'OPTIONS', 4.50, 8.20, 10),
            ('NIFTY 24500 CE', 'OPTIONS', 120, 280, 75),
        ]

        emotions = ['DISCIPLINED', 'DISCIPLINED', 'DISCIPLINED', 'PATIENT', 'FOMO', 'REVENGE', 'FEARFUL', 'GREEDY', 'IMPULSIVE']
        now = timezone.now()

        Trade.objects.all().delete() # Clean previous seed

        created_count = 0
        for i in range(30):
            sym, asset, base_price, target_price, qty = random.choice(sample_symbols)
            trade_type = random.choice(['LONG', 'SHORT'])
            strat_name = random.choice(list(strategies.keys()))
            strat = strategies[strat_name]
            emotion = 'FOMO' if strat_name == 'FOMO Impulse Trade' else random.choice(emotions)

            # Calculate realistic entry/exit
            variance = random.uniform(-0.04, 0.06)
            if trade_type == 'LONG':
                entry = Decimal(str(round(base_price * (1 + random.uniform(-0.02, 0.02)), 4)))
                stop = Decimal(str(round(float(entry) * 0.96, 4)))
                tp = Decimal(str(round(float(entry) * 1.08, 4)))
                # 60% win rate tendency for disciplined, lower for FOMO
                is_win = random.random() < (0.25 if emotion in ['FOMO', 'REVENGE'] else 0.65)
                if is_win:
                    exit_p = Decimal(str(round(float(entry) * (1 + random.uniform(0.02, 0.09)), 4)))
                else:
                    exit_p = Decimal(str(round(float(entry) * (1 - random.uniform(0.015, 0.05)), 4)))
            else: # SHORT
                entry = Decimal(str(round(base_price * (1 + random.uniform(-0.02, 0.02)), 4)))
                stop = Decimal(str(round(float(entry) * 1.04, 4)))
                tp = Decimal(str(round(float(entry) * 0.92, 4)))
                is_win = random.random() < (0.25 if emotion in ['FOMO', 'REVENGE'] else 0.65)
                if is_win:
                    exit_p = Decimal(str(round(float(entry) * (1 - random.uniform(0.02, 0.09)), 4)))
                else:
                    exit_p = Decimal(str(round(float(entry) * (1 + random.uniform(0.015, 0.05)), 4)))

            quantity = Decimal(str(qty))
            fees = Decimal(str(round(float(entry * quantity) * 0.0008, 2)))
            rating = random.randint(4, 5) if is_win and emotion == 'DISCIPLINED' else random.randint(1, 3)

            entry_dt = now - timedelta(days=35 - i, hours=random.randint(1, 10))
            exit_dt = entry_dt + timedelta(hours=random.randint(2, 48))

            session_choice = random.choice(['ASIAN', 'LONDON', 'NEW_YORK'])
            notes = f"Executed {trade_type} trade on {sym} during {session_choice} session using strategy '{strat.name}'. Emotion during entry was {emotion}."

            Trade.objects.create(
                symbol=sym,
                trade_type=trade_type,
                asset_class=asset,
                session=session_choice,
                entry_price=entry,
                exit_price=exit_p,
                stop_loss=stop,
                take_profit=tp,
                quantity=quantity,
                fees=fees,
                status='CLOSED',
                strategy=strat,
                notes=notes,
                emotion=emotion,
                rating=rating,
                entry_time=entry_dt,
                exit_time=exit_dt
            )
            created_count += 1

        self.stdout.write(self.style.SUCCESS(f'Successfully seeded {created_count} demo trades!'))
