import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DashboardOverview from './components/DashboardOverview';
import AnalyticsCharts from './components/AnalyticsCharts';
import PnLCalendar from './components/PnLCalendar';
import TradeTable from './components/TradeTable';
import TradeFormModal from './components/TradeFormModal';
import TradeDetailModal from './components/TradeDetailModal';
import StrategyManagerModal from './components/StrategyManagerModal';
import AuthScreen from './components/AuthScreen';

import { 
  getTrades, 
  getStrategies, 
  getAnalytics, 
  createTrade, 
  updateTrade, 
  deleteTrade, 
  createStrategy, 
  deleteStrategy,
  getMe
} from './services/api';

export default function App() {
  // Authentication State
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('quant_journal_token') || null);
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('quant_journal_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [showLandingPage, setShowLandingPage] = useState(() => !localStorage.getItem('quant_journal_token'));
  const [activeTab, setActiveTab] = useState('dashboard');
  const [trades, setTrades] = useState([]);
  const [strategies, setStrategies] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  // Theme State (Dark / Light)
  const [theme, setTheme] = useState(() => localStorage.getItem('quant_journal_theme') || 'dark');

  useEffect(() => {
    localStorage.setItem('quant_journal_theme', theme);
    if (theme === 'light') {
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Filters State
  const [filters, setFilters] = useState({
    symbol: '',
    asset_class: '',
    trade_type: '',
    strategy: '',
    outcome: '',
    date_from: '',
    date_to: '',
  });

  // Modal States
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
  const [editingTrade, setEditingTrade] = useState(null);
  
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedTradeForDetail, setSelectedTradeForDetail] = useState(null);

  const [isStrategyModalOpen, setIsStrategyModalOpen] = useState(false);

  // Notification Banner
  const [notification, setNotification] = useState(null);

  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Check auth session validity on startup
  useEffect(() => {
    const checkAuth = async () => {
      if (authToken) {
        try {
          const res = await getMe();
          setCurrentUser(res.user);
          localStorage.setItem('quant_journal_user', JSON.stringify(res.user));
        } catch (err) {
          handleLogout();
        }
      }
    };
    checkAuth();
  }, [authToken]);

  const handleAuthSuccess = (data) => {
    setAuthToken(data.token);
    setCurrentUser(data.user);
    localStorage.setItem('quant_journal_token', data.token);
    localStorage.setItem('quant_journal_user', JSON.stringify(data.user));
    showNotification(`Welcome back, ${data.user.username}!`);
  };

  const handleLogout = () => {
    setAuthToken(null);
    setCurrentUser(null);
    localStorage.removeItem('quant_journal_token');
    localStorage.removeItem('quant_journal_user');
    showNotification('System locked. Session ended.', 'error');
  };

  // Initial Data Fetching
  const fetchAllData = async () => {
    if (!authToken || !currentUser) return;
    try {
      setLoading(true);
      const [tradesData, strategiesData, analyticsData] = await Promise.all([
        getTrades(filters),
        getStrategies(),
        getAnalytics(filters)
      ]);
      setTrades(tradesData);
      setStrategies(strategiesData);
      setAnalytics(analyticsData);
    } catch (err) {
      console.error('Failed to load application data:', err);
      showNotification('Error connecting to TradeTrack PRO server.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Local Auto-Backup Trigger (Saves JSON snapshot to localStorage on every trade change)
  useEffect(() => {
    if (trades && trades.length > 0) {
      try {
        const backupSnapshot = {
          timestamp: new Date().toISOString(),
          user: currentUser ? currentUser.username : 'Trader',
          total_trades: trades.length,
          trades: trades
        };
        localStorage.setItem('quant_journal_auto_backup', JSON.stringify(backupSnapshot));
      } catch (err) {
        console.error('Failed to save local JSON backup snapshot:', err);
      }
    }
  }, [trades, currentUser]);

  useEffect(() => {
    if (authToken && currentUser) {
      fetchAllData();
    }
  }, [filters, authToken, currentUser]);

  // Trade Modal Handlers
  const handleOpenNewTradeModal = () => {
    setEditingTrade(null);
    setIsTradeModalOpen(true);
  };

  const handleOpenEditTradeModal = (trade) => {
    setEditingTrade(trade);
    setIsTradeModalOpen(true);
  };

  const handleSaveTrade = async (formData, tradeId) => {
    try {
      if (tradeId) {
        await updateTrade(tradeId, formData);
        showNotification('Trade updated successfully!');
      } else {
        await createTrade(formData);
        showNotification('New trade logged successfully!');
      }
      setIsTradeModalOpen(false);
      setEditingTrade(null);
      fetchAllData();
    } catch (err) {
      console.error('Failed to save trade:', err);
      showNotification('Failed to save trade record. Check input values.', 'error');
    }
  };

  const handleDeleteTrade = async (id) => {
    if (!window.confirm('Are you sure you want to delete this trade record?')) return;
    try {
      await deleteTrade(id);
      showNotification('Trade deleted successfully.');
      fetchAllData();
    } catch (err) {
      console.error('Failed to delete trade:', err);
      showNotification('Error deleting trade.', 'error');
    }
  };

  const handleImportTrades = async (importedTrades) => {
    try {
      setLoading(true);
      let count = 0;
      for (const trade of importedTrades) {
        await createTrade(trade);
        count++;
      }
      showNotification(`Successfully imported ${count} trades from CSV!`);
      await fetchAllData();
    } catch (err) {
      console.error('Failed to import trades:', err);
      showNotification('Error importing trades from CSV.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Trade Detail Retrospective View
  const handleViewTradeDetail = (trade) => {
    setSelectedTradeForDetail(trade);
    setIsDetailModalOpen(true);
  };

  // Strategy Handlers
  const handleCreateStrategy = async (stratData) => {
    try {
      const created = await createStrategy(stratData);
      showNotification(`Strategy "${created?.name || stratData.name}" created successfully!`);
      const updatedStrat = await getStrategies();
      setStrategies(updatedStrat);
    } catch (err) {
      console.error('Failed to create strategy:', err);
      showNotification('Error creating strategy. Please try again.', 'error');
    }
  };

  const handleDeleteStrategy = async (id) => {
    try {
      await deleteStrategy(id);
      showNotification('Strategy deleted.');
      const updatedStrat = await getStrategies();
      setStrategies(updatedStrat);
    } catch (err) {
      console.error('Failed to delete strategy:', err);
      showNotification('Error deleting strategy.', 'error');
    }
  };

  // Calendar Day Filter Handler
  const handleSelectCalendarDate = (dateStr) => {
    setFilters(prev => ({
      ...prev,
      date_from: dateStr ? `${dateStr}T00:00:00` : '',
      date_to: dateStr ? `${dateStr}T23:59:59` : ''
    }));
    setActiveTab('trades');
    showNotification(`Filtered trade log for date: ${dateStr}`);
  };

  const handleResetFilters = () => {
    setFilters({
      symbol: '',
      asset_class: '',
      trade_type: '',
      strategy: '',
      outcome: '',
      date_from: '',
      date_to: '',
    });
  };

  // If Landing Page is active
  if (showLandingPage) {
    return (
      <LandingPage
        onEnterApp={() => setShowLandingPage(false)}
        onLoginClick={() => setShowLandingPage(false)}
      />
    );
  }

  // If unauthenticated, present AuthScreen lock screen
  if (!authToken || !currentUser) {
    return <AuthScreen onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen flex flex-col transition-colors">
      
      {/* Top Header Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenTradeModal={handleOpenNewTradeModal}
        onOpenStrategyModal={() => setIsStrategyModalOpen(true)}
        currentUser={currentUser}
        onLogout={handleLogout}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Notification Toast */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 animate-bounce">
          <div className={`px-4 py-3 rounded-xl shadow-2xl border text-xs font-semibold flex items-center gap-2 ${
            notification.type === 'error'
              ? 'bg-rose-950 text-rose-300 border-rose-500/50'
              : 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
          }`}>
            <span>{notification.msg}</span>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-6">
        
        {loading && !analytics ? (
          <div className="py-20 text-center text-slate-500 space-y-2">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-mono text-emerald-400">Connecting to TradeTrack PRO Secure Cloud Server...</p>
          </div>
        ) : (
          <>
            {/* View Tab 1: Dashboard Overview */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6 animate-fadeIn">
                <DashboardOverview analytics={analytics} />
                <AnalyticsCharts analytics={analytics} />
                <TradeTable
                  trades={trades}
                  strategies={strategies}
                  onViewTrade={handleViewTradeDetail}
                  onEditTrade={handleOpenEditTradeModal}
                  onDeleteTrade={handleDeleteTrade}
                  onImportTrades={handleImportTrades}
                  filters={filters}
                  setFilters={setFilters}
                  onResetFilters={handleResetFilters}
                />
              </div>
            )}

            {/* View Tab 2: Trade Log */}
            {activeTab === 'trades' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                  <h2 className="text-lg sm:text-xl font-bold font-mono text-white tracking-wide">Execution Log & Retrospective</h2>
                  <span className="text-xs text-slate-400 font-mono">Showing {trades.length} trades</span>
                </div>
                <TradeTable
                  trades={trades}
                  strategies={strategies}
                  onViewTrade={handleViewTradeDetail}
                  onEditTrade={handleOpenEditTradeModal}
                  onDeleteTrade={handleDeleteTrade}
                  onImportTrades={handleImportTrades}
                  filters={filters}
                  setFilters={setFilters}
                  onResetFilters={handleResetFilters}
                />
              </div>
            )}

            {/* View Tab 3: Analytics Engine */}
            {activeTab === 'analytics' && (
              <div className="space-y-6 animate-fadeIn">
                <DashboardOverview analytics={analytics} />
                <AnalyticsCharts analytics={analytics} />
              </div>
            )}

            {/* View Tab 4: PnL Calendar */}
            {activeTab === 'calendar' && (
              <div className="space-y-6 animate-fadeIn">
                <PnLCalendar
                  analytics={analytics}
                  onSelectDateFilter={handleSelectCalendarDate}
                />
              </div>
            )}
          </>
        )}

      </main>

      {/* Modals */}
      <TradeFormModal
        isOpen={isTradeModalOpen}
        onClose={() => setIsTradeModalOpen(false)}
        onSubmit={handleSaveTrade}
        initialData={editingTrade}
        strategies={strategies}
      />

      <TradeDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        trade={selectedTradeForDetail}
      />

      <StrategyManagerModal
        isOpen={isStrategyModalOpen}
        onClose={() => setIsStrategyModalOpen(false)}
        strategies={strategies}
        onCreateStrategy={handleCreateStrategy}
        onDeleteStrategy={handleDeleteStrategy}
      />

      <footer className="border-t border-slate-800/80 py-6 px-4 text-center text-xs text-slate-400 font-mono">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 leading-relaxed">
          <span>TradeTrack PRO System</span>
          <span className="hidden sm:inline">•</span>
          <span>Built & Owned by <span className="text-emerald-400 font-bold">Bimalesh Yadav</span></span>
          <span className="hidden sm:inline">•</span>
          <span className="text-[11px] text-slate-500">Quantitative Trading & Analytics Engine</span>
        </div>
      </footer>

    </div>
  );
}
