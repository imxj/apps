/**
 * TradeLog Pro — Data Store (localStorage-based)
 */

const Store = (function() {
    'use strict';

    const KEYS = {
        trades: 'tradelog_trades',
        accounts: 'tradelog_accounts',
        settings: 'tradelog_settings',
    };

    // ===== TRADES =====
    function getTrades() {
        try {
            return JSON.parse(localStorage.getItem(KEYS.trades)) || [];
        } catch { return []; }
    }

    function saveTrades(trades) {
        localStorage.setItem(KEYS.trades, JSON.stringify(trades));
    }

    function addTrade(trade) {
        const trades = getTrades();
        trade.id = generateId();
        trade.createdAt = new Date().toISOString();
        trades.push(trade);
        saveTrades(trades);
        return trade;
    }

    function updateTrade(id, updates) {
        const trades = getTrades();
        const idx = trades.findIndex(t => t.id === id);
        if (idx !== -1) {
            trades[idx] = { ...trades[idx], ...updates, updatedAt: new Date().toISOString() };
            saveTrades(trades);
            return trades[idx];
        }
        return null;
    }

    function deleteTrade(id) {
        const trades = getTrades().filter(t => t.id !== id);
        saveTrades(trades);
    }

    function getTradesByPeriod(days) {
        const trades = getTrades();
        if (!days || days === 0) return trades;
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);
        return trades.filter(t => new Date(t.date) >= cutoff);
    }

    // ===== ACCOUNTS =====
    function getAccounts() {
        try {
            return JSON.parse(localStorage.getItem(KEYS.accounts)) || [
                { id: 'default', name: 'Default', balance: 10000 }
            ];
        } catch {
            return [{ id: 'default', name: 'Default', balance: 10000 }];
        }
    }

    function saveAccounts(accounts) {
        localStorage.setItem(KEYS.accounts, JSON.stringify(accounts));
    }

    function addAccount(account) {
        const accounts = getAccounts();
        account.id = generateId();
        accounts.push(account);
        saveAccounts(accounts);
        return account;
    }

    function deleteAccount(id) {
        if (id === 'default') return false;
        const accounts = getAccounts().filter(a => a.id !== id);
        saveAccounts(accounts);
        return true;
    }

    // ===== SETTINGS =====
    function getSettings() {
        try {
            return JSON.parse(localStorage.getItem(KEYS.settings)) || {};
        } catch { return {}; }
    }

    function saveSettings(settings) {
        localStorage.setItem(KEYS.settings, JSON.stringify(settings));
    }

    // ===== EXPORT / IMPORT =====
    function exportAll() {
        return JSON.stringify({
            version: '1.0',
            exportedAt: new Date().toISOString(),
            trades: getTrades(),
            accounts: getAccounts(),
            settings: getSettings(),
        }, null, 2);
    }

    function exportCSV() {
        const trades = getTrades();
        if (trades.length === 0) return '';
        
        const headers = ['Date', 'Ticker', 'Type', 'Side', 'Entry', 'Exit', 'Qty', 'P&L', 'Commission', 'Strategy', 'Emotion', 'Account', 'Notes'];
        const rows = trades.map(t => [
            t.date,
            t.ticker,
            t.type,
            t.side,
            t.entry,
            t.exit,
            t.qty,
            calcPL(t).toFixed(2),
            t.commission || 0,
            t.strategy || '',
            t.emotion || '',
            t.account || 'default',
            (t.notes || '').replace(/"/g, '""'),
        ]);
        
        return [headers.join(','), ...rows.map(r => r.map(v => `"${v}"`).join(','))].join('\n');
    }

    function importData(jsonStr) {
        try {
            const data = JSON.parse(jsonStr);
            if (data.trades) saveTrades(data.trades);
            if (data.accounts) saveAccounts(data.accounts);
            if (data.settings) saveSettings(data.settings);
            return true;
        } catch { return false; }
    }

    function clearAll() {
        localStorage.removeItem(KEYS.trades);
        localStorage.removeItem(KEYS.accounts);
        localStorage.removeItem(KEYS.settings);
    }

    // ===== CALCULATIONS =====
    function calcPL(trade) {
        const entry = parseFloat(trade.entry) || 0;
        const exit = parseFloat(trade.exit) || 0;
        const qty = parseFloat(trade.qty) || 0;
        const commission = parseFloat(trade.commission) || 0;
        
        let multiplier = 1;
        if (trade.type === 'option_call' || trade.type === 'option_put') {
            multiplier = 100;
        }
        
        let pl;
        if (trade.side === 'long') {
            pl = (exit - entry) * qty * multiplier;
        } else {
            pl = (entry - exit) * qty * multiplier;
        }
        
        return pl - commission;
    }

    function getStats(trades) {
        if (!trades || trades.length === 0) {
            return { totalPL: 0, winRate: 0, winners: 0, losers: 0, avgWin: 0, avgLoss: 0, profitFactor: 0, totalTrades: 0 };
        }

        let totalPL = 0;
        let winners = 0;
        let losers = 0;
        let totalWin = 0;
        let totalLoss = 0;

        trades.forEach(t => {
            const pl = calcPL(t);
            totalPL += pl;
            if (pl > 0) {
                winners++;
                totalWin += pl;
            } else if (pl < 0) {
                losers++;
                totalLoss += Math.abs(pl);
            }
        });

        return {
            totalPL,
            winRate: trades.length > 0 ? (winners / trades.length) * 100 : 0,
            winners,
            losers,
            avgWin: winners > 0 ? totalWin / winners : 0,
            avgLoss: losers > 0 ? totalLoss / losers : 0,
            profitFactor: totalLoss > 0 ? totalWin / totalLoss : totalWin > 0 ? Infinity : 0,
            totalTrades: trades.length,
        };
    }

    // ===== HELPERS =====
    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }

    return {
        getTrades, saveTrades, addTrade, updateTrade, deleteTrade, getTradesByPeriod,
        getAccounts, saveAccounts, addAccount, deleteAccount,
        getSettings, saveSettings,
        exportAll, exportCSV, importData, clearAll,
        calcPL, getStats,
    };
})();
