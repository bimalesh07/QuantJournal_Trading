/**
 * Quantitative Analytics & Calculations Engine for TradeTrack PRO Backtesting Lab
 * Performs 100% isolated mathematical modeling on backtested historical trades.
 */

// Pre-populated default setup confluences
export const DEFAULT_CONFLUENCES = [
  '#HTF_Trend',
  '#LiquiditySweep',
  '#FairValueGap',
  '#EMA_Crossover',
  '#KeyLevelBounce',
  '#VolumeConfirmation',
  '#OrderBlock',
  '#Fibonacci_618',
  '#SessionOpenRaid'
];

export const RULE_ADHERENCE_OPTIONS = [
  { id: '100% Flawless', label: '100% Flawless Execution', color: 'emerald' },
  { id: 'Early Entry', label: 'Early Entry / Anticipated', color: 'amber' },
  { id: 'FOMO Chased', label: 'FOMO Chased Late', color: 'rose' },
  { id: 'Premature Exit', label: 'Premature Exit', color: 'purple' },
  { id: 'Wide SL Deviation', label: 'Wide SL Deviation', color: 'orange' },
];

export const ASSET_CLASS_OPTIONS = [
  'Indian F&O (NSE)',
  'Crypto',
  'Forex',
  'US Equities',
  'Commodities'
];

export const TIMEFRAME_OPTIONS = ['1m', '3m', '5m', '15m', '1H', '4H', 'Daily'];

export const SESSION_OPTIONS = [
  'NSE Normal Hours (09:15-15:30)',
  'Asian',
  'London',
  'New York'
];

/**
 * Realistic Institutional Backtest Dataset (Seeded for instant user value)
 */
export const SEED_BACKTEST_TRADES = [
  {
    id: 'bt-101',
    strategy: 'ICT Silver Bullet',
    symbol: 'Nifty 50',
    asset_class: 'Indian F&O (NSE)',
    timeframe: '5m',
    session: 'NSE Normal Hours (09:15-15:30)',
    timestamp: '2026-08-20T09:45:00',
    direction: 'LONG',
    entry_price: 24500.0,
    stop_loss: 24460.0,
    take_profit: 24620.0,
    exit_price: 24620.0,
    planned_rrr: 3.0,
    outcome_type: 'FULL_TP',
    realized_r: 3.0,
    confluences: ['#LiquiditySweep', '#FairValueGap', '#HTF_Trend'],
    rule_adherence: '100% Flawless',
    mae_r: -0.2,
    mfe_r: 3.0,
    chart_before_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1000&q=80',
    chart_after_url: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=1000&q=80',
    notes: 'Swept morning low at 09:35, filled 5m FVG with HTF trend alignment. Clean 1:3 RR expansion.'
  },
  {
    id: 'bt-102',
    strategy: 'Breakout & Retest',
    symbol: 'BankNifty',
    asset_class: 'Indian F&O (NSE)',
    timeframe: '15m',
    session: 'NSE Normal Hours (09:15-15:30)',
    timestamp: '2026-08-21T10:30:00',
    direction: 'LONG',
    entry_price: 52100.0,
    stop_loss: 51980.0,
    take_profit: 52460.0,
    exit_price: 52460.0,
    planned_rrr: 3.0,
    outcome_type: 'FULL_TP',
    realized_r: 3.0,
    confluences: ['#KeyLevelBounce', '#VolumeConfirmation', '#HTF_Trend'],
    rule_adherence: '100% Flawless',
    mae_r: -0.1,
    mfe_r: 3.2,
    chart_before_url: '',
    chart_after_url: '',
    notes: '15m resistance turned support with spike in buy volume. Flawless retest execution.'
  },
  {
    id: 'bt-103',
    strategy: 'FVG Scalp',
    symbol: 'BTC/USD',
    asset_class: 'Crypto',
    timeframe: '3m',
    session: 'New York',
    timestamp: '2026-08-22T14:15:00',
    direction: 'SHORT',
    entry_price: 64200.0,
    stop_loss: 64400.0,
    take_profit: 63600.0,
    exit_price: 64400.0,
    planned_rrr: 3.0,
    outcome_type: 'STOP_LOSS',
    realized_r: -1.0,
    confluences: ['#FairValueGap', '#LiquiditySweep'],
    rule_adherence: 'Early Entry',
    mae_r: -1.0,
    mfe_r: 0.5,
    chart_before_url: '',
    chart_after_url: '',
    notes: 'Entered before 3m candle close. NY session volatility spiked against short position.'
  },
  {
    id: 'bt-104',
    strategy: 'ICT Silver Bullet',
    symbol: 'Gold/XAUUSD',
    asset_class: 'Commodities',
    timeframe: '5m',
    session: 'London',
    timestamp: '2026-08-23T08:15:00',
    direction: 'LONG',
    entry_price: 2510.0,
    stop_loss: 2504.0,
    take_profit: 2528.0,
    exit_price: 2528.0,
    planned_rrr: 3.0,
    outcome_type: 'FULL_TP',
    realized_r: 3.0,
    confluences: ['#SessionOpenRaid', '#FairValueGap', '#LiquiditySweep'],
    rule_adherence: '100% Flawless',
    mae_r: -0.3,
    mfe_r: 3.1,
    chart_before_url: '',
    chart_after_url: '',
    notes: 'London open liquidity raid below Asian High/Low. 5m Displacement up into 1:3 TP.'
  },
  {
    id: 'bt-105',
    strategy: 'Trend Pullback',
    symbol: 'EUR/USD',
    asset_class: 'Forex',
    timeframe: '1H',
    session: 'London',
    timestamp: '2026-08-24T11:00:00',
    direction: 'SHORT',
    entry_price: 1.0880,
    stop_loss: 1.0900,
    take_profit: 1.0820,
    exit_price: 1.0820,
    planned_rrr: 3.0,
    outcome_type: 'FULL_TP',
    realized_r: 3.0,
    confluences: ['#EMA_Crossover', '#HTF_Trend', '#VolumeConfirmation'],
    rule_adherence: '100% Flawless',
    mae_r: -0.2,
    mfe_r: 3.0,
    chart_before_url: '',
    chart_after_url: '',
    notes: '1H 20/50 EMA bearish cross with clean retest of broken support level.'
  },
  {
    id: 'bt-106',
    strategy: 'Breakout & Retest',
    symbol: 'Nifty 50',
    asset_class: 'Indian F&O (NSE)',
    timeframe: '15m',
    session: 'NSE Normal Hours (09:15-15:30)',
    timestamp: '2026-08-25T13:45:00',
    direction: 'LONG',
    entry_price: 24650.0,
    stop_loss: 24600.0,
    take_profit: 24800.0,
    exit_price: 24650.0,
    planned_rrr: 3.0,
    outcome_type: 'BREAKEVEN',
    realized_r: 0.0,
    confluences: ['#KeyLevelBounce', '#HTF_Trend'],
    rule_adherence: 'Premature Exit',
    mae_r: -0.4,
    mfe_r: 1.8,
    chart_before_url: '',
    chart_after_url: '',
    notes: 'Moved stop loss to BE after +1.8R move. Price re-visited entry before target hit.'
  },
  {
    id: 'bt-107',
    strategy: 'ICT Silver Bullet',
    symbol: 'Nifty 50',
    asset_class: 'Indian F&O (NSE)',
    timeframe: '5m',
    session: 'NSE Normal Hours (09:15-15:30)',
    timestamp: '2026-08-26T10:15:00',
    direction: 'SHORT',
    entry_price: 24780.0,
    stop_loss: 24820.0,
    take_profit: 24660.0,
    exit_price: 24660.0,
    planned_rrr: 3.0,
    outcome_type: 'FULL_TP',
    realized_r: 3.0,
    confluences: ['#LiquiditySweep', '#FairValueGap', '#OrderBlock'],
    rule_adherence: '100% Flawless',
    mae_r: -0.1,
    mfe_r: 3.3,
    chart_before_url: '',
    chart_after_url: '',
    notes: 'Swept yesterday high liquidity, bearish FVG formed. Targeted previous day midpoint.'
  },
  {
    id: 'bt-108',
    strategy: 'FVG Scalp',
    symbol: 'BTC/USD',
    asset_class: 'Crypto',
    timeframe: '5m',
    session: 'New York',
    timestamp: '2026-08-27T16:00:00',
    direction: 'LONG',
    entry_price: 65100.0,
    stop_loss: 64800.0,
    take_profit: 65800.0,
    exit_price: 65550.0,
    planned_rrr: 2.33,
    outcome_type: 'PARTIAL',
    realized_r: 1.5,
    confluences: ['#FairValueGap', '#VolumeConfirmation'],
    rule_adherence: 'Premature Exit',
    mae_r: -0.3,
    mfe_r: 2.1,
    chart_before_url: '',
    chart_after_url: '',
    notes: 'Manually closed at +1.5R due to upcoming FOMC speeches.'
  },
  {
    id: 'bt-109',
    strategy: 'Trend Pullback',
    symbol: 'Gold/XAUUSD',
    asset_class: 'Commodities',
    timeframe: '1H',
    session: 'New York',
    timestamp: '2026-08-28T13:30:00',
    direction: 'LONG',
    entry_price: 2525.0,
    stop_loss: 2515.0,
    take_profit: 2555.0,
    exit_price: 2555.0,
    planned_rrr: 3.0,
    outcome_type: 'FULL_TP',
    realized_r: 3.0,
    confluences: ['#HTF_Trend', '#Fibonacci_618', '#KeyLevelBounce'],
    rule_adherence: '100% Flawless',
    mae_r: -0.2,
    mfe_r: 3.1,
    chart_before_url: '',
    chart_after_url: '',
    notes: '61.8% Fib retest on 1H chart with strong NY buying momentum.'
  },
  {
    id: 'bt-110',
    strategy: 'Breakout & Retest',
    symbol: 'Sensex',
    asset_class: 'Indian F&O (NSE)',
    timeframe: '15m',
    session: 'NSE Normal Hours (09:15-15:30)',
    timestamp: '2026-08-29T11:30:00',
    direction: 'SHORT',
    entry_price: 80500.0,
    stop_loss: 80800.0,
    take_profit: 79600.0,
    exit_price: 80800.0,
    planned_rrr: 3.0,
    outcome_type: 'STOP_LOSS',
    realized_r: -1.0,
    confluences: ['#EMA_Crossover'],
    rule_adherence: 'FOMO Chased',
    mae_r: -1.0,
    mfe_r: 0.2,
    chart_before_url: '',
    chart_after_url: '',
    notes: 'Chased entry after breakdown candle closed far from SL level.'
  }
];

/**
 * Auto Calculate Planned RRR
 */
export const calculatePlannedRRR = (entry, sl, tp, direction) => {
  const e = parseFloat(entry);
  const s = parseFloat(sl);
  const t = parseFloat(tp);

  if (isNaN(e) || isNaN(s) || isNaN(t) || e <= 0 || s <= 0 || t <= 0) return 0;

  if (direction === 'LONG') {
    const risk = e - s;
    const reward = t - e;
    if (risk <= 0) return 0;
    return parseFloat((reward / risk).toFixed(2));
  } else {
    const risk = s - e;
    const reward = e - t;
    if (risk <= 0) return 0;
    return parseFloat((reward / risk).toFixed(2));
  }
};

/**
 * Calculate Realized R based on Outcome Quick Selector or Custom Exit Price
 */
export const calculateRealizedR = (outcomeType, plannedRRR, entry, sl, exitPrice, direction) => {
  const pRRR = parseFloat(plannedRRR) || 0;
  if (outcomeType === 'FULL_TP') return pRRR;
  if (outcomeType === 'STOP_LOSS') return -1.0;
  if (outcomeType === 'BREAKEVEN') return 0.0;

  // PARTIAL or Custom Exit
  const e = parseFloat(entry);
  const s = parseFloat(sl);
  const ex = parseFloat(exitPrice);
  if (isNaN(e) || isNaN(s) || isNaN(ex)) return 0.0;

  if (direction === 'LONG') {
    const risk = e - s;
    if (risk <= 0) return 0.0;
    return parseFloat(((ex - e) / risk).toFixed(2));
  } else {
    const risk = s - e;
    if (risk <= 0) return 0.0;
    return parseFloat(((e - ex) / risk).toFixed(2));
  }
};

/**
 * Master Executive Analytics Calculator for Backtesting Lab
 */
export const calculateBacktestAnalytics = (trades = []) => {
  const total = trades.length;

  if (total === 0) {
    return {
      totalTrades: 0,
      sampleQuality: { score: 'No Data', color: 'text-slate-400', badge: '⚪ N = 0' },
      winsCount: 0,
      lossesCount: 0,
      breakevenCount: 0,
      winRate: 0,
      lossRate: 0,
      totalNetR: 0,
      sumPositiveR: 0,
      sumNegativeR: 0,
      avgWinR: 0,
      avgLossR: 0,
      profitFactor: 0,
      evPerTrade: 0,
      maxConsecutiveLosses: 0,
      maxRDrawdown: 0,
    };
  }

  let winsCount = 0;
  let lossesCount = 0;
  let breakevenCount = 0;
  let sumPositiveR = 0;
  let sumNegativeR = 0;

  let currentLossStreak = 0;
  let maxConsecutiveLosses = 0;

  let peakR = 0;
  let runningR = 0;
  let maxRDrawdown = 0;

  // Sort trades by timestamp ascending for sequential drawdown & equity curve modeling
  const sortedTrades = [...trades].sort(
    (a, b) => new Date(a.timestamp || 0) - new Date(b.timestamp || 0)
  );

  sortedTrades.forEach((t) => {
    const r = parseFloat(t.realized_r) || 0;
    runningR += r;

    if (runningR > peakR) {
      peakR = runningR;
    }
    const drawdown = peakR - runningR;
    if (drawdown > maxRDrawdown) {
      maxRDrawdown = drawdown;
    }

    if (r > 0.05) {
      winsCount++;
      sumPositiveR += r;
      currentLossStreak = 0;
    } else if (r < -0.05) {
      lossesCount++;
      sumNegativeR += Math.abs(r);
      currentLossStreak++;
      if (currentLossStreak > maxConsecutiveLosses) {
        maxConsecutiveLosses = currentLossStreak;
      }
    } else {
      breakevenCount++;
      currentLossStreak = 0;
    }
  });

  const winRate = parseFloat(((winsCount / total) * 100).toFixed(1));
  const lossRate = parseFloat(((lossesCount / total) * 100).toFixed(1));

  const avgWinR = winsCount > 0 ? parseFloat((sumPositiveR / winsCount).toFixed(2)) : 0;
  const avgLossR = lossesCount > 0 ? parseFloat((sumNegativeR / lossesCount).toFixed(2)) : 0;

  const profitFactor =
    sumNegativeR > 0
      ? parseFloat((sumPositiveR / sumNegativeR).toFixed(2))
      : sumPositiveR > 0
      ? 99.9
      : 0;

  const totalNetR = parseFloat((sumPositiveR - sumNegativeR).toFixed(2));

  // Mathematical Edge / Expected Value (EV) per trade in R = (WinRate * AvgWinR) - (LossRate * AvgLossR)
  const winRateDec = winsCount / total;
  const lossRateDec = lossesCount / total;
  const evPerTrade = parseFloat(
    (winRateDec * avgWinR - lossRateDec * avgLossR).toFixed(2)
  );

  // Sample Size Quality Rating
  let sampleQuality = { score: 'Low', color: 'text-amber-400', badge: '⚠️ Insufficient N (<10)' };
  if (total >= 30) {
    sampleQuality = { score: 'High', color: 'text-emerald-400', badge: '🟢 Statistically Valid (30+)' };
  } else if (total >= 10) {
    sampleQuality = { score: 'Moderate', color: 'text-cyan-400', badge: '⚡ Moderate N (10-29)' };
  }

  return {
    totalTrades: total,
    sampleQuality,
    winsCount,
    lossesCount,
    breakevenCount,
    winRate,
    lossRate,
    totalNetR,
    sumPositiveR,
    sumNegativeR,
    avgWinR,
    avgLossR,
    profitFactor,
    evPerTrade,
    maxConsecutiveLosses,
    maxRDrawdown: parseFloat(maxRDrawdown.toFixed(2)),
  };
};

/**
 * Strategy × Asset Compatibility Leaderboard Matrix
 */
export const calculateStrategyAssetMatrix = (trades = []) => {
  const groups = {};

  trades.forEach((t) => {
    const strat = t.strategy || 'Uncategorized';
    const asset = t.symbol || 'General';
    const key = `${strat}___${asset}`;

    if (!groups[key]) {
      groups[key] = {
        strategy: strat,
        asset: asset,
        trades: [],
      };
    }
    groups[key].trades.push(t);
  });

  const matrix = Object.values(groups).map((group) => {
    const analytics = calculateBacktestAnalytics(group.trades);
    
    // Status Logic
    // Live Ready: EV >= +0.35R, Profit Factor >= 1.3
    // Low Edge: EV > 0.0R but < 0.35R
    // Unprofitable: EV <= 0.0R
    let status = { text: '❌ Unprofitable', badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/30' };
    if (analytics.evPerTrade >= 0.35 && analytics.profitFactor >= 1.3) {
      status = { text: '🚀 Live Ready', badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' };
    } else if (analytics.evPerTrade > 0) {
      status = { text: '⚠️ Low Edge', badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/30' };
    }

    return {
      strategy: group.strategy,
      asset: group.asset,
      sampleSize: analytics.totalTrades,
      winRate: analytics.winRate,
      avgRR: analytics.avgWinR > 0 ? `1:${analytics.avgWinR}` : 'N/A',
      profitFactor: analytics.profitFactor,
      ev: analytics.evPerTrade,
      totalNetR: analytics.totalNetR,
      status,
    };
  });

  // Sort matrix by EV (Mathematical Edge) descending
  return matrix.sort((a, b) => b.ev - a.ev);
};

/**
 * Format Cumulative R-Equity Growth Curve
 */
export const calculateCumulativeREquityCurve = (trades = []) => {
  const sortedTrades = [...trades].sort(
    (a, b) => new Date(a.timestamp || 0) - new Date(b.timestamp || 0)
  );

  let runningR = 0;
  const curve = [
    {
      index: 0,
      cumulativeR: 0,
      date: 'Start',
      tradeNote: 'Initial Baseline',
      symbol: 'BASE',
      realizedR: 0,
    },
  ];

  sortedTrades.forEach((t, idx) => {
    const r = parseFloat(t.realized_r) || 0;
    runningR += r;
    const formattedDate = t.timestamp ? new Date(t.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : `T#${idx+1}`;

    curve.push({
      index: idx + 1,
      cumulativeR: parseFloat(runningR.toFixed(2)),
      date: formattedDate,
      symbol: t.symbol,
      strategy: t.strategy,
      realizedR: r,
      direction: t.direction,
    });
  });

  return curve;
};

/**
 * Breakdown Performance by Trading Session
 */
export const calculateSessionPerformance = (trades = []) => {
  const sessions = ['NSE Normal Hours (09:15-15:30)', 'Asian', 'London', 'New York'];
  
  return sessions.map((sess) => {
    const sessionTrades = trades.filter((t) => (t.session || '').toLowerCase().includes(sess.toLowerCase().slice(0, 4)));
    const analytics = calculateBacktestAnalytics(sessionTrades);

    return {
      session: sess,
      shortLabel: sess.startsWith('NSE') ? 'NSE (09:15-15:30)' : sess,
      count: analytics.totalTrades,
      winRate: analytics.winRate,
      netR: analytics.totalNetR,
      ev: analytics.evPerTrade,
    };
  });
};

/**
 * Breakdown Performance by Timeframe
 */
export const calculateTimeframePerformance = (trades = []) => {
  const timeframes = TIMEFRAME_OPTIONS;

  return timeframes.map((tf) => {
    const tfTrades = trades.filter((t) => t.timeframe === tf);
    const analytics = calculateBacktestAnalytics(tfTrades);

    return {
      timeframe: tf,
      count: analytics.totalTrades,
      winRate: analytics.winRate,
      netR: analytics.totalNetR,
      ev: analytics.evPerTrade,
    };
  });
};

/**
 * Confluence Edge Power Leaderboard
 */
export const calculateConfluencePower = (trades = []) => {
  const tagStats = {};

  trades.forEach((t) => {
    const tags = t.confluences || [];
    tags.forEach((tag) => {
      if (!tagStats[tag]) {
        tagStats[tag] = [];
      }
      tagStats[tag].push(t);
    });
  });

  const list = Object.keys(tagStats).map((tag) => {
    const tagTrades = tagStats[tag];
    const analytics = calculateBacktestAnalytics(tagTrades);

    return {
      tag,
      sampleSize: analytics.totalTrades,
      winRate: analytics.winRate,
      netR: analytics.totalNetR,
      ev: analytics.evPerTrade,
    };
  });

  return list.sort((a, b) => b.winRate - a.winRate);
};

/**
 * Export Backtests to CSV
 */
export const exportBacktestsToCSV = (trades = []) => {
  if (!trades.length) return;

  const headers = [
    'ID',
    'Strategy',
    'Symbol',
    'Asset Class',
    'Timeframe',
    'Session',
    'Timestamp',
    'Direction',
    'Entry Price',
    'Stop Loss',
    'Take Profit',
    'Exit Price',
    'Planned RRR',
    'Outcome Type',
    'Realized R',
    'Confluences',
    'Rule Adherence',
    'MAE R',
    'MFE R',
    'Notes'
  ];

  const rows = trades.map((t) => [
    t.id || '',
    `"${t.strategy || ''}"`,
    `"${t.symbol || ''}"`,
    `"${t.asset_class || ''}"`,
    `"${t.timeframe || ''}"`,
    `"${t.session || ''}"`,
    `"${t.timestamp || ''}"`,
    t.direction || '',
    t.entry_price || '',
    t.stop_loss || '',
    t.take_profit || '',
    t.exit_price || '',
    t.planned_rrr || '',
    t.outcome_type || '',
    t.realized_r || '',
    `"${(t.confluences || []).join(';')}"`,
    `"${t.rule_adherence || ''}"`,
    t.mae_r || '',
    t.mfe_r || '',
    `"${(t.notes || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `TradeTrack_PRO_Backtests_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Parse CSV Text into Backtest Objects
 */
export const parseBacktestsFromCSV = (csvText) => {
  const lines = csvText.split('\n').filter((l) => l.trim().length > 0);
  if (lines.length <= 1) return [];

  const parsed = [];
  for (let i = 1; i < lines.length; i++) {
    // Simple CSV splitter honoring quotes
    const rawCols = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || lines[i].split(',');
    const cleanCols = rawCols.map((c) => c.replace(/^"|"$/g, '').trim());

    if (cleanCols.length >= 8) {
      const entry = parseFloat(cleanCols[8]) || 0;
      const sl = parseFloat(cleanCols[9]) || 0;
      const tp = parseFloat(cleanCols[10]) || 0;
      const dir = cleanCols[7] || 'LONG';
      const plannedRRR = calculatePlannedRRR(entry, sl, tp, dir);

      parsed.push({
        id: `bt-csv-${Date.now()}-${i}`,
        strategy: cleanCols[1] || 'CSV Strategy',
        symbol: cleanCols[2] || 'SYMBOL',
        asset_class: cleanCols[3] || 'Indian F&O (NSE)',
        timeframe: cleanCols[4] || '5m',
        session: cleanCols[5] || 'NSE Normal Hours (09:15-15:30)',
        timestamp: cleanCols[6] || new Date().toISOString(),
        direction: dir,
        entry_price: entry,
        stop_loss: sl,
        take_profit: tp,
        exit_price: parseFloat(cleanCols[11]) || entry,
        planned_rrr: plannedRRR,
        outcome_type: cleanCols[13] || 'FULL_TP',
        realized_r: parseFloat(cleanCols[14]) || plannedRRR,
        confluences: cleanCols[15] ? cleanCols[15].split(';').map((s) => s.trim()) : [],
        rule_adherence: cleanCols[16] || '100% Flawless',
        mae_r: parseFloat(cleanCols[17]) || 0,
        mfe_r: parseFloat(cleanCols[18]) || 0,
        notes: cleanCols[19] || '',
      });
    }
  }

  return parsed;
};

/**
 * Session Edge Performance Breakdown
 */
export const calculateSessionEdgeBreakdown = (trades = []) => {
  if (!trades || trades.length === 0) return [];

  const sessionMap = {};

  trades.forEach((t) => {
    const session = t.session || 'Unspecified';
    if (!sessionMap[session]) {
      sessionMap[session] = {
        session,
        totalTrades: 0,
        wins: 0,
        losses: 0,
        breakevens: 0,
        totalR: 0,
        winRSum: 0,
        lossRSum: 0,
      };
    }

    const r = parseFloat(t.realized_r) || 0;
    sessionMap[session].totalTrades += 1;
    sessionMap[session].totalR += r;

    if (r > 0) {
      sessionMap[session].wins += 1;
      sessionMap[session].winRSum += r;
    } else if (r < 0) {
      sessionMap[session].losses += 1;
      sessionMap[session].lossRSum += Math.abs(r);
    } else {
      sessionMap[session].breakevens += 1;
    }
  });

  return Object.values(sessionMap).map((s) => {
    const winRate = s.totalTrades > 0 ? (s.wins / s.totalTrades) * 100 : 0;
    const avgWinR = s.wins > 0 ? s.winRSum / s.wins : 0;
    const avgLossR = s.losses > 0 ? s.lossRSum / s.losses : 0;
    const expectancy = (winRate / 100) * avgWinR - ((100 - winRate) / 100) * avgLossR;

    return {
      ...s,
      winRate: Math.round(winRate * 10) / 10,
      totalR: Math.round(s.totalR * 10) / 10,
      expectancy: Math.round(expectancy * 100) / 100,
    };
  }).sort((a, b) => b.totalR - a.totalR);
};

/**
 * Timeframe Edge Performance Breakdown
 */
export const calculateTimeframeEdgeBreakdown = (trades = []) => {
  if (!trades || trades.length === 0) return [];

  const tfMap = {};

  trades.forEach((t) => {
    const tf = t.timeframe || 'Unspecified';
    if (!tfMap[tf]) {
      tfMap[tf] = {
        timeframe: tf,
        totalTrades: 0,
        wins: 0,
        losses: 0,
        totalR: 0,
        winRSum: 0,
        lossRSum: 0,
      };
    }

    const r = parseFloat(t.realized_r) || 0;
    tfMap[tf].totalTrades += 1;
    tfMap[tf].totalR += r;

    if (r > 0) {
      tfMap[tf].wins += 1;
      tfMap[tf].winRSum += r;
    } else if (r < 0) {
      tfMap[tf].losses += 1;
      tfMap[tf].lossRSum += Math.abs(r);
    }
  });

  return Object.values(tfMap).map((s) => {
    const winRate = s.totalTrades > 0 ? (s.wins / s.totalTrades) * 100 : 0;
    const avgWinR = s.wins > 0 ? s.winRSum / s.wins : 0;
    const avgLossR = s.losses > 0 ? s.lossRSum / s.losses : 0;
    const expectancy = (winRate / 100) * avgWinR - ((100 - winRate) / 100) * avgLossR;

    return {
      ...s,
      winRate: Math.round(winRate * 10) / 10,
      totalR: Math.round(s.totalR * 10) / 10,
      expectancy: Math.round(expectancy * 100) / 100,
    };
  }).sort((a, b) => b.totalR - a.totalR);
};

/**
 * MFE / Take-Profit Target Optimizer
 */
export const calculateMFEOptimizer = (trades = []) => {
  if (!trades || trades.length === 0) {
    return {
      avgMFE: 0,
      avgMAE: 0,
      optimalTargetR: 2.5,
      profitLeftOnTable: 0,
      recommendation: 'Log more trades with MFE/MAE metrics for target optimization.',
    };
  }

  let mfeSum = 0;
  let maeSum = 0;
  let validMFECount = 0;
  let leftOnTableSum = 0;

  trades.forEach((t) => {
    const mfe = parseFloat(t.mfe_r) || 0;
    const mae = parseFloat(t.mae_r) || 0;
    const realizedR = parseFloat(t.realized_r) || 0;

    if (mfe > 0) {
      mfeSum += mfe;
      validMFECount += 1;
      if (mfe > realizedR && realizedR > 0) {
        leftOnTableSum += mfe - realizedR;
      }
    }
    if (mae < 0) {
      maeSum += Math.abs(mae);
    }
  });

  const avgMFE = validMFECount > 0 ? Math.round((mfeSum / validMFECount) * 10) / 10 : 2.8;
  const avgMAE = validMFECount > 0 ? Math.round((maeSum / validMFECount) * 10) / 10 : 0.4;
  const profitLeftOnTable = Math.round(leftOnTableSum * 10) / 10;

  // Calculate sweet spot target R (85% of average peak MFE)
  const optimalTargetR = Math.max(1.5, Math.round(avgMFE * 0.85 * 10) / 10);

  let recommendation = `Setting Take-Profit target at ${optimalTargetR} R captures peak MFE while avoiding trend reversals.`;
  if (profitLeftOnTable > 5) {
    recommendation = `You left +${profitLeftOnTable} R on the table! Raising targets to ${optimalTargetR} R will significantly boost net PnL.`;
  }

  return {
    avgMFE,
    avgMAE,
    optimalTargetR,
    profitLeftOnTable,
    recommendation,
  };
};

/**
 * Monte Carlo Risk & Ruin Stress Simulator (1,000 Resamples)
 */
export const runMonteCarloSimulation = (trades = [], iterations = 1000) => {
  if (!trades || trades.length === 0) {
    return {
      iterations: 0,
      medianFinalR: 0,
      p95MaxDrawdownR: 0,
      worstMaxDrawdownR: 0,
      probabilityOfRuin: 0,
      sampledPaths: [],
    };
  }

  const rValues = trades.map((t) => parseFloat(t.realized_r) || 0);
  const n = rValues.length;

  const finalReturns = [];
  const maxDrawdowns = [];
  let ruinCount = 0;
  const RUIN_THRESHOLD_R = -10.0; // Account drawdown of -10 R

  const allPaths = [];

  // Run Monte Carlo Iterations
  for (let iter = 0; iter < iterations; iter++) {
    // Random shuffle using Fisher-Yates or random sampling with replacement
    const shuffled = [];
    for (let i = 0; i < n; i++) {
      const randIdx = Math.floor(Math.random() * n);
      shuffled.push(rValues[randIdx]);
    }

    let cumR = 0;
    let peakR = 0;
    let maxDd = 0;
    const pathPoints = [0];

    for (let i = 0; i < shuffled.length; i++) {
      cumR += shuffled[i];
      if (cumR > peakR) peakR = cumR;
      const dd = cumR - peakR;
      if (dd < maxDd) maxDd = dd;
      pathPoints.push(Math.round(cumR * 10) / 10);
    }

    finalReturns.push(cumR);
    maxDrawdowns.push(Math.abs(maxDd));

    if (maxDd <= RUIN_THRESHOLD_R) {
      ruinCount += 1;
    }

    // Save first 10 paths for multi-line Recharts visualization
    if (iter < 10) {
      allPaths.push(pathPoints);
    }
  }

  // Sort returns & drawdowns for percentile confidence intervals
  finalReturns.sort((a, b) => a - b);
  maxDrawdowns.sort((a, b) => a - b);

  const medianFinalR = Math.round(finalReturns[Math.floor(iterations * 0.5)] * 10) / 10;
  const p95MaxDrawdownR = Math.round(maxDrawdowns[Math.floor(iterations * 0.95)] * 10) / 10;
  const worstMaxDrawdownR = Math.round(maxDrawdowns[maxDrawdowns.length - 1] * 10) / 10;
  const probabilityOfRuin = Math.round((ruinCount / iterations) * 1000) / 10;

  // Format sampled paths for Recharts
  const sampledChartData = [];
  const numSteps = n + 1;
  for (let step = 0; step < numSteps; step++) {
    const pointObj = { step: `#${step}` };
    allPaths.forEach((path, pathIdx) => {
      pointObj[`Path ${pathIdx + 1}`] = path[step] !== undefined ? path[step] : path[path.length - 1];
    });
    sampledChartData.push(pointObj);
  }

  return {
    iterations,
    totalTradeCount: n,
    medianFinalR,
    p95MaxDrawdownR,
    worstMaxDrawdownR,
    probabilityOfRuin,
    sampledChartData,
  };
};
