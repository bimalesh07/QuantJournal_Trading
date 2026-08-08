/**
 * Utility functions for filtering trades by timeframe date range
 * and dynamically recalculating all quantitative analytics metrics.
 */

export const isTradeInTimeframe = (trade, timeframe) => {
  if (!timeframe || timeframe === 'All Time') return true;

  const rawDate = trade.entry_time || trade.created_at || trade.exit_time;
  if (!rawDate) return false;

  const tradeDate = new Date(rawDate);
  if (isNaN(tradeDate.getTime())) return false;

  const now = new Date();

  // Reset to start/end of today
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  if (timeframe === 'Today') {
    return tradeDate >= todayStart && tradeDate <= todayEnd;
  }

  if (timeframe === 'This Week') {
    const dayOfWeek = now.getDay(); // 0 is Sunday, 1 is Monday...
    const distanceToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - distanceToMonday, 0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);
    return tradeDate >= weekStart && tradeDate < weekEnd;
  }

  if (timeframe === 'This Month') {
    return tradeDate.getFullYear() === now.getFullYear() && tradeDate.getMonth() === now.getMonth();
  }

  if (timeframe === 'This Year') {
    return tradeDate.getFullYear() === now.getFullYear();
  }

  return true;
};

export const calculateAnalyticsFromTrades = (trades = [], fallbackAnalytics = null) => {
  const closedTrades = (trades || []).filter(
    (t) => t.status === 'CLOSED' || (!t.status && t.exit_price != null) || (!t.status && t.net_pnl != null)
  );

  const totalTrades = (trades || []).length;
  const totalClosed = closedTrades.length;

  if (totalClosed === 0) {
    return {
      overview: {
        total_trades: totalTrades,
        closed_trades: 0,
        win_count: 0,
        loss_count: 0,
        breakeven_count: 0,
        win_rate: 0,
        total_gross_pnl: 0,
        total_fees: 0,
        total_net_pnl: 0,
        total_profit: 0,
        total_loss: 0,
        profit_factor: 0,
        avg_win: 0,
        avg_loss: 0,
        expectancy: 0,
        avg_rrr: 0,
        highest_win: 0,
        highest_loss: 0,
        avg_pnl_per_trade: 0,
        avg_trades_per_day: 0,
        win_days: 0,
        loss_days: 0,
      },
      best_strategy: null,
      worst_strategy: null,
      best_asset: null,
      worst_asset: null,
      strategy_performance: [],
      pnl_by_day: [],
      pnl_by_session: [
        { session: 'New York', net_pnl: 0 },
        { session: 'London', net_pnl: 0 },
        { session: 'Asian', net_pnl: 0 },
      ],
      pnl_by_emotion: [
        { emotion: 'Disciplined', net_pnl: 0 },
        { emotion: 'Patient', net_pnl: 0 },
        { emotion: 'FOMO', net_pnl: 0 },
        { emotion: 'Revenge', net_pnl: 0 },
        { emotion: 'Fearful', net_pnl: 0 },
        { emotion: 'Greedy', net_pnl: 0 },
      ],
      equity_curve: [],
      monthly_pnl: [],
      calendar_data: {},
      pnl_by_asset_class: [],
    };
  }

  const wins = closedTrades.filter((t) => Number(t.net_pnl || 0) > 0);
  const losses = closedTrades.filter((t) => Number(t.net_pnl || 0) < 0);
  const breakevens = closedTrades.filter((t) => Number(t.net_pnl || 0) === 0);

  const win_count = wins.length;
  const loss_count = losses.length;
  const breakeven_count = breakevens.length;

  const decisiveTrades = win_count + loss_count;
  const win_rate = decisiveTrades > 0
    ? Number(((win_count / decisiveTrades) * 100).toFixed(2))
    : (totalClosed > 0 ? Number(((win_count / totalClosed) * 100).toFixed(2)) : 0);

  const total_net_pnl = Number(
    closedTrades.reduce((acc, t) => acc + Number(t.net_pnl || 0), 0).toFixed(2)
  );

  const total_fees = Number(
    closedTrades.reduce((acc, t) => acc + Number(t.fees || 0), 0).toFixed(2)
  );

  const total_gross_pnl = Number(
    closedTrades
      .reduce((acc, t) => {
        if (t.gross_pnl != null) return acc + Number(t.gross_pnl);
        return acc + Number(t.net_pnl || 0) + Number(t.fees || 0);
      }, 0)
      .toFixed(2)
  );

  const total_profit = Number(
    wins.reduce((acc, t) => acc + Number(t.net_pnl || 0), 0).toFixed(2)
  );

  const total_loss = Number(
    Math.abs(losses.reduce((acc, t) => acc + Number(t.net_pnl || 0), 0)).toFixed(2)
  );

  let profit_factor = 0;
  if (total_loss > 0) {
    profit_factor = Number((total_profit / total_loss).toFixed(2));
  } else if (total_profit > 0) {
    profit_factor = Number(total_profit.toFixed(2));
  }

  const avg_win = win_count > 0 ? Number((total_profit / win_count).toFixed(2)) : 0;
  const avg_loss = loss_count > 0 ? Number((total_loss / loss_count).toFixed(2)) : 0;

  const win_prob = win_count / totalClosed;
  const loss_prob = loss_count / totalClosed;
  const expectancy = Number(((win_prob * avg_win) - (loss_prob * avg_loss)).toFixed(2));

  let avg_rrr = 0;
  if (avg_loss > 0 && avg_win > 0) {
    avg_rrr = Number((avg_win / avg_loss).toFixed(2));
  } else {
    const validRrrList = closedTrades
      .map((t) => Number(t.risk_reward_ratio || 0))
      .filter((rrr) => rrr > 0 && rrr <= 50);
    if (validRrrList.length > 0) {
      avg_rrr = Number((validRrrList.reduce((a, b) => a + b, 0) / validRrrList.length).toFixed(2));
    }
  }

  const highest_win =
    wins.length > 0 ? Number(Math.max(...wins.map((t) => Number(t.net_pnl || 0))).toFixed(2)) : 0;
  const highest_loss =
    losses.length > 0 ? Number(Math.abs(Math.min(...losses.map((t) => Number(t.net_pnl || 0)))).toFixed(2)) : 0;

  const avg_pnl_per_trade = Number((total_net_pnl / totalClosed).toFixed(2));

  // Unique trading days calculation
  const tradingDaysMap = {};
  closedTrades.forEach((t) => {
    const rawD = t.exit_time || t.entry_time || t.created_at;
    if (!rawD) return;
    const dayStr = new Date(rawD).toISOString().slice(0, 10);
    tradingDaysMap[dayStr] = (tradingDaysMap[dayStr] || 0) + Number(t.net_pnl || 0);
  });

  const uniqueDaysCount = Object.keys(tradingDaysMap).length;
  const avg_trades_per_day =
    uniqueDaysCount > 0 ? Number((totalClosed / uniqueDaysCount).toFixed(1)) : 0;
  const win_days = Object.values(tradingDaysMap).filter((pnl) => pnl > 0).length;
  const loss_days = Object.values(tradingDaysMap).filter((pnl) => pnl < 0).length;

  // Strategy performance
  const stratMap = {};
  closedTrades.forEach((t) => {
    let stratName = t.strategy_name;
    if (!stratName && t.strategy) {
      stratName = typeof t.strategy === 'object' ? t.strategy.name : String(t.strategy);
    }
    if (!stratName) stratName = 'Default';

    if (!stratMap[stratName]) {
      stratMap[stratName] = { strategy_name: stratName, total_net_pnl: 0, win_count: 0, trades_count: 0 };
    }
    const pnl = Number(t.net_pnl || 0);
    stratMap[stratName].total_net_pnl += pnl;
    stratMap[stratName].trades_count += 1;
    if (pnl > 0) stratMap[stratName].win_count += 1;
  });

  const strategy_performance = Object.values(stratMap)
    .map((s) => ({
      strategy_name: s.strategy_name,
      total_net_pnl: Number(s.total_net_pnl.toFixed(2)),
      trades_count: s.trades_count,
      win_rate: s.trades_count > 0 ? Number(((s.win_count / s.trades_count) * 100).toFixed(2)) : 0,
    }))
    .sort((a, b) => b.total_net_pnl - a.total_net_pnl);

  const best_strategy = strategy_performance.length > 0 ? strategy_performance[0] : null;
  const worst_strategy =
    strategy_performance.length > 0 ? strategy_performance[strategy_performance.length - 1] : null;

  // Asset Class breakdown
  const assetMap = {};
  closedTrades.forEach((t) => {
    let assetClass = t.asset_class || 'STOCKS';
    const formattedAsset = assetClass.charAt(0).toUpperCase() + assetClass.slice(1).toLowerCase();
    if (!assetMap[formattedAsset]) {
      assetMap[formattedAsset] = { name: formattedAsset, pnl: 0, win_count: 0, trades: 0 };
    }
    const pnl = Number(t.net_pnl || 0);
    assetMap[formattedAsset].pnl += pnl;
    assetMap[formattedAsset].trades += 1;
    if (pnl > 0) assetMap[formattedAsset].win_count += 1;
  });

  const pnl_by_asset_class = Object.values(assetMap)
    .map((a) => ({
      name: a.name,
      pnl: Number(a.pnl.toFixed(2)),
      trades: a.trades,
      winRate: a.trades > 0 ? Number(((a.win_count / a.trades) * 100).toFixed(2)) : 0,
      isProfit: a.pnl >= 0,
    }))
    .sort((a, b) => b.pnl - a.pnl);

  // Symbol stats for best/worst asset
  const symbolMap = {};
  closedTrades.forEach((t) => {
    const sym = t.symbol || 'N/A';
    if (!symbolMap[sym]) {
      symbolMap[sym] = {
        name: sym,
        pnl: 0,
        win_count: 0,
        trades: 0,
        price: Number(t.exit_price || t.entry_price || 0),
      };
    }
    const pnl = Number(t.net_pnl || 0);
    symbolMap[sym].pnl += pnl;
    symbolMap[sym].trades += 1;
    if (pnl > 0) symbolMap[sym].win_count += 1;
    if (t.exit_price) symbolMap[sym].price = Number(t.exit_price);
  });

  const symbolList = Object.values(symbolMap)
    .map((s) => ({
      name: s.name,
      pnl: Number(s.pnl.toFixed(2)),
      price: s.price,
      winRate: s.trades > 0 ? Number(((s.win_count / s.trades) * 100).toFixed(2)) : 0,
      trades: s.trades,
    }))
    .sort((a, b) => b.pnl - a.pnl);

  const best_asset = symbolList.length > 0 ? symbolList[0] : null;
  const worst_asset = symbolList.length > 0 ? symbolList[symbolList.length - 1] : null;

  // Trading Sessions breakdown
  const sessionMap = { 'New York': 0, 'London': 0, 'Asian': 0 };
  closedTrades.forEach((t) => {
    let sess = t.session || 'NEW_YORK';
    if (sess === 'NEW_YORK') sess = 'New York';
    else if (sess === 'LONDON') sess = 'London';
    else if (sess === 'ASIAN') sess = 'Asian';
    sessionMap[sess] = (sessionMap[sess] || 0) + Number(t.net_pnl || 0);
  });

  const pnl_by_session = Object.keys(sessionMap).map((sess) => ({
    session: sess,
    net_pnl: Number(sessionMap[sess].toFixed(2)),
  }));

  // Emotion breakdown
  const emotionMap = { Disciplined: 0, Patient: 0, FOMO: 0, Revenge: 0, Fearful: 0, Greedy: 0 };
  closedTrades.forEach((t) => {
    let emo = t.emotion || 'DISCIPLINED';
    const formattedEmo = emo.charAt(0).toUpperCase() + emo.slice(1).toLowerCase();
    emotionMap[formattedEmo] = (emotionMap[formattedEmo] || 0) + Number(t.net_pnl || 0);
  });

  const pnl_by_emotion = Object.keys(emotionMap).map((emo) => ({
    emotion: emo,
    net_pnl: Number(emotionMap[emo].toFixed(2)),
  }));

  // Chronological equity curve
  const sortedChronological = [...closedTrades].sort((a, b) => {
    const dA = new Date(a.entry_time || a.created_at || 0).getTime();
    const dB = new Date(b.entry_time || b.created_at || 0).getTime();
    return dA - dB;
  });

  let runningPnl = 0;
  const equity_curve = sortedChronological.map((t) => {
    const pnl = Number(t.net_pnl || 0);
    runningPnl += pnl;
    return {
      date: t.entry_time || t.created_at,
      cumulative_pnl: Number(runningPnl.toFixed(2)),
      trade_pnl: Number(pnl.toFixed(2)),
    };
  });

  return {
    overview: {
      total_trades: totalTrades,
      closed_trades: totalClosed,
      win_count,
      loss_count,
      breakeven_count,
      win_rate,
      total_gross_pnl,
      total_fees,
      total_net_pnl,
      total_profit,
      total_loss,
      profit_factor,
      avg_win,
      avg_loss,
      expectancy,
      avg_rrr,
      highest_win,
      highest_loss,
      avg_pnl_per_trade,
      avg_trades_per_day,
      win_days,
      loss_days,
    },
    best_strategy,
    worst_strategy,
    best_asset,
    worst_asset,
    strategy_performance,
    pnl_by_asset_class,
    pnl_by_session,
    pnl_by_emotion,
    equity_curve,
  };
};
