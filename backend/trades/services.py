from decimal import Decimal
from collections import defaultdict
from django.db.models import Sum, Count, Q
from .models import Trade, Strategy

class AnalyticsService:

    @staticmethod
    def calculate_analytics(queryset=None):
        if queryset is None:
            queryset = Trade.objects.all()

        closed_trades = [t for t in queryset if t.status == 'CLOSED']
        total_trades = len(queryset)
        total_closed = len(closed_trades)

        if total_closed == 0:
            return AnalyticsService._empty_analytics(total_trades)

        wins = [t for t in closed_trades if t.net_pnl > Decimal('0')]
        losses = [t for t in closed_trades if t.net_pnl < Decimal('0')]
        breakevens = [t for t in closed_trades if t.net_pnl == Decimal('0')]

        win_count = len(wins)
        loss_count = len(losses)
        breakeven_count = len(breakevens)

        win_rate = float(round((Decimal(win_count) / Decimal(total_closed)) * Decimal('100'), 2))

        total_net_pnl = float(round(sum((t.net_pnl for t in closed_trades), Decimal('0')), 2))
        total_gross_pnl = float(round(sum((t.gross_pnl for t in closed_trades), Decimal('0')), 2))
        total_fees = float(round(sum((t.fees for t in closed_trades), Decimal('0')), 2))

        total_profit = float(round(sum((t.net_pnl for t in wins), Decimal('0')), 2))
        total_loss = float(round(abs(sum((t.net_pnl for t in losses), Decimal('0'))), 2))

        if total_loss > 0:
            profit_factor = round(total_profit / total_loss, 2)
        else:
            profit_factor = round(total_profit, 2) if total_profit > 0 else 0.0

        avg_win = float(round(total_profit / win_count, 2)) if win_count > 0 else 0.0
        avg_loss = float(round(total_loss / loss_count, 2)) if loss_count > 0 else 0.0

        win_prob = win_count / total_closed
        loss_prob = loss_count / total_closed
        expectancy = float(round((win_prob * avg_win) - (loss_prob * avg_loss), 2))

        # Calculate Average RRR strictly as Average Win / Average Loss or filtered valid RRR average
        if avg_loss > 0 and avg_win > 0:
            avg_rrr = float(round(avg_win / avg_loss, 2))
        else:
            rrr_list = [float(t.risk_reward_ratio) for t in closed_trades if 0 < t.risk_reward_ratio <= 50]
            avg_rrr = float(round(sum(rrr_list) / len(rrr_list), 2)) if rrr_list else 0.0

        # Best & Worst Strategies
        strategy_stats = AnalyticsService._calculate_strategy_stats(closed_trades)
        best_strategy = max(strategy_stats, key=lambda s: s['total_net_pnl']) if strategy_stats else None
        worst_strategy = min(strategy_stats, key=lambda s: s['total_net_pnl']) if strategy_stats else None

        # Day of Week Breakdown
        pnl_by_day = AnalyticsService._calculate_day_of_week_stats(closed_trades)

        # Trading Session Breakdown
        pnl_by_session = AnalyticsService._calculate_session_stats(closed_trades)

        # Emotion Breakdown
        pnl_by_emotion = AnalyticsService._calculate_emotion_stats(closed_trades)

        # Equity Curve Timeline
        equity_curve = AnalyticsService._calculate_equity_curve(closed_trades)

        # Monthly PnL Breakdown
        monthly_pnl = AnalyticsService._calculate_monthly_stats(closed_trades)

        # Calendar Data (Daily Net PnL)
        calendar_data = AnalyticsService._calculate_calendar_data(closed_trades)

        # Asset Class Breakdown
        pnl_by_asset_class = AnalyticsService._calculate_asset_class_stats(closed_trades)

        return {
            'overview': {
                'total_trades': total_trades,
                'closed_trades': total_closed,
                'win_count': win_count,
                'loss_count': loss_count,
                'breakeven_count': breakeven_count,
                'win_rate': win_rate,
                'total_gross_pnl': total_gross_pnl,
                'total_fees': total_fees,
                'total_net_pnl': total_net_pnl,
                'total_profit': total_profit,
                'total_loss': total_loss,
                'profit_factor': profit_factor,
                'avg_win': avg_win,
                'avg_loss': avg_loss,
                'expectancy': expectancy,
                'avg_rrr': avg_rrr,
            },
            'best_strategy': best_strategy,
            'worst_strategy': worst_strategy,
            'strategy_performance': strategy_stats,
            'pnl_by_day': pnl_by_day,
            'pnl_by_session': pnl_by_session,
            'pnl_by_emotion': pnl_by_emotion,
            'equity_curve': equity_curve,
            'monthly_pnl': monthly_pnl,
            'calendar_data': calendar_data,
            'pnl_by_asset_class': pnl_by_asset_class,
        }

    @staticmethod
    def _empty_analytics(total_trades=0):
        return {
            'overview': {
                'total_trades': total_trades,
                'closed_trades': 0,
                'win_count': 0,
                'loss_count': 0,
                'breakeven_count': 0,
                'win_rate': 0.0,
                'total_gross_pnl': 0.0,
                'total_fees': 0.0,
                'total_net_pnl': 0.0,
                'total_profit': 0.0,
                'total_loss': 0.0,
                'profit_factor': 0.0,
                'avg_win': 0.0,
                'avg_loss': 0.0,
                'expectancy': 0.0,
                'avg_rrr': 0.0,
            },
            'best_strategy': None,
            'worst_strategy': None,
            'strategy_performance': [],
            'pnl_by_day': [],
            'pnl_by_session': [],
            'pnl_by_emotion': [],
            'equity_curve': [],
            'monthly_pnl': [],
            'calendar_data': {},
        }

    @staticmethod
    def _calculate_strategy_stats(closed_trades):
        stats = defaultdict(lambda: {
            'trades_count': 0,
            'wins': 0,
            'losses': 0,
            'net_pnl': Decimal('0.0000')
        })

        for t in closed_trades:
            strat_name = t.strategy.name if t.strategy else 'Unassigned'
            stats[strat_name]['trades_count'] += 1
            if t.net_pnl > 0:
                stats[strat_name]['wins'] += 1
            elif t.net_pnl < 0:
                stats[strat_name]['losses'] += 1
            stats[strat_name]['net_pnl'] += t.net_pnl

        result = []
        for strat_name, s in stats.items():
            total = s['trades_count']
            win_rate = round((s['wins'] / total) * 100, 2) if total > 0 else 0.0
            result.append({
                'strategy_name': strat_name,
                'trades_count': total,
                'wins': s['wins'],
                'losses': s['losses'],
                'win_rate': win_rate,
                'total_net_pnl': float(round(s['net_pnl'], 2))
            })
        result.sort(key=lambda x: x['total_net_pnl'], reverse=True)
        return result

    @staticmethod
    def _calculate_day_of_week_stats(closed_trades):
        days_order = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        day_stats = {d: {'day': d, 'net_pnl': Decimal('0'), 'trades': 0, 'wins': 0, 'losses': 0} for d in days_order}

        for t in closed_trades:
            day_name = t.entry_time.strftime('%A')
            if day_name in day_stats:
                day_stats[day_name]['net_pnl'] += t.net_pnl
                day_stats[day_name]['trades'] += 1
                if t.net_pnl > 0:
                    day_stats[day_name]['wins'] += 1
                elif t.net_pnl < 0:
                    day_stats[day_name]['losses'] += 1

        result = []
        for d in days_order:
            item = day_stats[d]
            total = item['trades']
            win_rate = round((item['wins'] / total) * 100, 2) if total > 0 else 0.0
            result.append({
                'day': d,
                'trades': total,
                'wins': item['wins'],
                'losses': item['losses'],
                'win_rate': win_rate,
                'net_pnl': float(round(item['net_pnl'], 2))
            })
        return result

    @staticmethod
    def _calculate_emotion_stats(closed_trades):
        emotion_map = defaultdict(lambda: {'trades': 0, 'wins': 0, 'losses': 0, 'net_pnl': Decimal('0')})

        for t in closed_trades:
            emo = t.emotion
            emotion_map[emo]['trades'] += 1
            emotion_map[emo]['net_pnl'] += t.net_pnl
            if t.net_pnl > 0:
                emotion_map[emo]['wins'] += 1
            elif t.net_pnl < 0:
                emotion_map[emo]['losses'] += 1

        result = []
        for emo, val in emotion_map.items():
            total = val['trades']
            win_rate = round((val['wins'] / total) * 100, 2) if total > 0 else 0.0
            result.append({
                'emotion': emo,
                'trades': total,
                'wins': val['wins'],
                'losses': val['losses'],
                'win_rate': win_rate,
                'net_pnl': float(round(val['net_pnl'], 2))
            })
        result.sort(key=lambda x: x['net_pnl'], reverse=True)
        return result

    @staticmethod
    def _calculate_equity_curve(closed_trades):
        sorted_trades = sorted(closed_trades, key=lambda t: t.exit_time or t.entry_time)
        cum_pnl = Decimal('0')
        curve = []

        for idx, t in enumerate(sorted_trades, 1):
            cum_pnl += t.net_pnl
            timestamp = t.exit_time or t.entry_time
            curve.append({
                'trade_index': idx,
                'date': timestamp.strftime('%Y-%m-%d %H:%M'),
                'symbol': t.symbol,
                'pnl': float(round(t.net_pnl, 2)),
                'cumulative_pnl': float(round(cum_pnl, 2))
            })
        return curve

    @staticmethod
    def _calculate_monthly_stats(closed_trades):
        monthly = defaultdict(lambda: {'trades': 0, 'wins': 0, 'losses': 0, 'net_pnl': Decimal('0')})

        for t in closed_trades:
            month_key = (t.exit_time or t.entry_time).strftime('%Y-%m')
            monthly[month_key]['trades'] += 1
            monthly[month_key]['net_pnl'] += t.net_pnl
            if t.net_pnl > 0:
                monthly[month_key]['wins'] += 1
            elif t.net_pnl < 0:
                monthly[month_key]['losses'] += 1

        sorted_months = sorted(monthly.keys())
        result = []
        for m in sorted_months:
            v = monthly[m]
            total = v['trades']
            win_rate = round((v['wins'] / total) * 100, 2) if total > 0 else 0.0
            result.append({
                'month': m,
                'trades': total,
                'wins': v['wins'],
                'losses': v['losses'],
                'win_rate': win_rate,
                'net_pnl': float(round(v['net_pnl'], 2))
            })
        return result

    @staticmethod
    def _calculate_calendar_data(closed_trades):
        calendar = defaultdict(lambda: {'trades': 0, 'wins': 0, 'losses': 0, 'net_pnl': Decimal('0')})

        for t in closed_trades:
            date_key = (t.exit_time or t.entry_time).strftime('%Y-%m-%d')
            calendar[date_key]['trades'] += 1
            calendar[date_key]['net_pnl'] += t.net_pnl
            if t.net_pnl > 0:
                calendar[date_key]['wins'] += 1
            elif t.net_pnl < 0:
                calendar[date_key]['losses'] += 1

        result = {}
        for date_str, v in calendar.items():
            result[date_str] = {
                'date': date_str,
                'trades': v['trades'],
                'wins': v['wins'],
                'losses': v['losses'],
                'net_pnl': float(round(v['net_pnl'], 2))
            }
        return result

    @staticmethod
    def _calculate_session_stats(closed_trades):
        session_names = {
            'ASIAN': 'Asian Session',
            'LONDON': 'London Session',
            'NEW_YORK': 'New York Session'
        }
        stats = {code: {'session': label, 'code': code, 'net_pnl': Decimal('0'), 'trades': 0, 'wins': 0, 'losses': 0} 
                 for code, label in session_names.items()}

        for t in closed_trades:
            sess_code = getattr(t, 'session', 'NEW_YORK') or 'NEW_YORK'
            if sess_code not in stats:
                stats[sess_code] = {'session': sess_code, 'code': sess_code, 'net_pnl': Decimal('0'), 'trades': 0, 'wins': 0, 'losses': 0}
            
            stats[sess_code]['net_pnl'] += t.net_pnl
            stats[sess_code]['trades'] += 1
            if t.net_pnl > 0:
                stats[sess_code]['wins'] += 1
            elif t.net_pnl < 0:
                stats[sess_code]['losses'] += 1

        result = []
        for code in ['ASIAN', 'LONDON', 'NEW_YORK']:
            if code in stats:
                item = stats[code]
                total = item['trades']
                win_rate = round((item['wins'] / total) * 100, 2) if total > 0 else 0.0
                result.append({
                    'session': item['session'],
                    'code': code,
                    'trades': total,
                    'wins': item['wins'],
                    'losses': item['losses'],
                    'win_rate': win_rate,
                    'net_pnl': float(round(item['net_pnl'], 2))
                })
        return result

    @staticmethod
    def _calculate_asset_class_stats(closed_trades):
        asset_map = defaultdict(lambda: {'trades': 0, 'wins': 0, 'losses': 0, 'net_pnl': Decimal('0')})

        for t in closed_trades:
            asset = t.asset_class or 'UNASSIGNED'
            asset_map[asset]['trades'] += 1
            asset_map[asset]['net_pnl'] += t.net_pnl
            if t.net_pnl > 0:
                asset_map[asset]['wins'] += 1
            elif t.net_pnl < 0:
                asset_map[asset]['losses'] += 1

        result = []
        for asset, val in asset_map.items():
            total = val['trades']
            win_rate = round((val['wins'] / total) * 100, 2) if total > 0 else 0.0
            result.append({
                'name': asset,
                'trades': total,
                'wins': val['wins'],
                'losses': val['losses'],
                'winRate': win_rate,
                'pnl': float(round(val['net_pnl'], 2)),
                'isProfit': val['net_pnl'] >= 0
            })
        result.sort(key=lambda x: x['pnl'], reverse=True)
        return result
