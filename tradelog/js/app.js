/**
 * TradeLog Pro — Main App Controller
 */

(function() {
    'use strict';

    const $ = id => document.getElementById(id);
    let currentPage = 'dashboard';
    let editingTradeId = null;

    // ===== INIT =====
    function init() {
        setupNavigation();
        setupModal();
        setupAccountModal();
        setupDataManagement();
        setupFilters();
        loadSampleDataIfEmpty();
        render();
    }

    // ===== NAVIGATION =====
    function setupNavigation() {
        document.querySelectorAll('[data-page]').forEach(btn => {
            btn.addEventListener('click', () => navigateTo(btn.dataset.page));
        });

        // Mobile toggle
        const toggle = $('mobileToggle');
        const sidebar = $('sidebar');
        if (toggle && sidebar) {
            toggle.addEventListener('click', () => {
                sidebar.classList.toggle('open');
            });
        }
    }

    function navigateTo(page) {
        currentPage = page;
        document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
        const pageEl = $('page-' + page);
        if (pageEl) pageEl.style.display = 'block';

        document.querySelectorAll('.sidebar-item').forEach(s => s.classList.remove('active'));
        document.querySelector(`.sidebar-item[data-page="${page}"]`)?.classList.add('active');

        // Close mobile sidebar
        $('sidebar')?.classList.remove('open');

        render();
    }

    // ===== RENDERING =====
    function render() {
        switch (currentPage) {
            case 'dashboard': renderDashboard(); break;
            case 'trades': renderTradeLog(); break;
            case 'analytics': renderAnalytics(); break;
            case 'accounts': renderAccounts(); break;
        }
        updateTradeCount();
    }

    function updateTradeCount() {
        const count = Store.getTrades().length;
        const el = $('tradeCount');
        if (el) el.textContent = `${count} trade${count !== 1 ? 's' : ''} logged`;
    }

    // ===== DASHBOARD =====
    function renderDashboard() {
        const period = parseInt($('dashPeriod')?.value || 30);
        const trades = Store.getTradesByPeriod(period);
        const stats = Store.getStats(trades);

        // Update stat cards
        $('statPL').textContent = formatCurrency(stats.totalPL);
        $('statPL').className = `stat-value mono ${stats.totalPL >= 0 ? 'green' : 'red'}`;
        
        $('statWinRate').textContent = stats.totalTrades > 0 ? stats.winRate.toFixed(1) + '%' : '—';
        $('statWinRate').className = `stat-value mono ${stats.winRate >= 50 ? 'green' : stats.totalTrades > 0 ? 'red' : ''}`;
        
        $('statTrades').textContent = stats.totalTrades;
        
        $('statAvgWin').textContent = stats.winners > 0 ? formatCurrency(stats.avgWin) : '—';
        $('statAvgWin').className = 'stat-value mono green';
        
        $('statAvgLoss').textContent = stats.losers > 0 ? '-' + formatCurrency(stats.avgLoss) : '—';
        $('statAvgLoss').className = 'stat-value mono red';
        
        $('statPF').textContent = stats.profitFactor === Infinity ? '∞' : stats.profitFactor > 0 ? stats.profitFactor.toFixed(2) : '—';

        // Equity curve
        renderEquityCurve(trades);
        
        // Daily P&L
        renderDailyPL(trades);

        // Calendar heatmap
        renderCalendar(trades);

        // Recent trades table (last 10)
        const recent = [...trades].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);
        $('recentTradesBody').innerHTML = recent.map(t => tradeRow(t, false)).join('');
    }

    function renderEquityCurve(trades) {
        if (!trades.length) {
            Charts.drawLineChart($('equityChart'), [{ label: 'No data', value: 0 }]);
            return;
        }

        const sorted = [...trades].sort((a, b) => new Date(a.date) - new Date(b.date));
        let cum = 0;
        const data = sorted.map(t => {
            cum += Store.calcPL(t);
            return {
                label: formatDate(t.date),
                value: cum,
            };
        });

        Charts.drawLineChart($('equityChart'), data);
    }

    function renderDailyPL(trades) {
        if (!trades.length) {
            Charts.drawBarChart($('dailyPLChart'), [{ label: 'No data', value: 0 }]);
            return;
        }

        // Group by date
        const byDate = {};
        trades.forEach(t => {
            const d = t.date;
            byDate[d] = (byDate[d] || 0) + Store.calcPL(t);
        });

        const data = Object.entries(byDate)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .slice(-20) // last 20 days
            .map(([date, pl]) => ({
                label: formatDate(date),
                value: pl,
            }));

        Charts.drawBarChart($('dailyPLChart'), data);
    }

    function renderCalendar(trades) {
        const container = $('calendarHeatmap');
        if (!container) return;

        // Build 90-day calendar
        const today = new Date();
        const start = new Date(today);
        start.setDate(start.getDate() - 89);

        // Group PL by date
        const plByDate = {};
        trades.forEach(t => {
            plByDate[t.date] = (plByDate[t.date] || 0) + Store.calcPL(t);
        });

        // Day headers
        let html = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
            .map(d => `<div class="calendar-day-header">${d}</div>`).join('');

        // Pad start
        const startDay = start.getDay();
        for (let i = 0; i < startDay; i++) {
            html += '<div class="calendar-day cal-empty"></div>';
        }

        // Days
        const d = new Date(start);
        while (d <= today) {
            const key = d.toISOString().split('T')[0];
            const pl = plByDate[key] || 0;
            let cls = 'cal-neutral';
            
            if (pl > 500) cls = 'cal-green-4';
            else if (pl > 200) cls = 'cal-green-3';
            else if (pl > 50) cls = 'cal-green-2';
            else if (pl > 0) cls = 'cal-green-1';
            else if (pl < -500) cls = 'cal-red-4';
            else if (pl < -200) cls = 'cal-red-3';
            else if (pl < -50) cls = 'cal-red-2';
            else if (pl < 0) cls = 'cal-red-1';

            const title = `${key}: ${pl !== 0 ? formatCurrency(pl) : 'No trades'}`;
            html += `<div class="calendar-day ${cls}" title="${title}"></div>`;
            
            d.setDate(d.getDate() + 1);
        }

        container.innerHTML = html;
    }

    // ===== TRADE LOG =====
    function renderTradeLog() {
        const trades = Store.getTrades();
        const search = ($('tradeSearch')?.value || '').toUpperCase();
        const typeFilter = $('tradeFilterType')?.value || '';

        let filtered = trades;
        if (search) filtered = filtered.filter(t => t.ticker.toUpperCase().includes(search));
        if (typeFilter) filtered = filtered.filter(t => t.type === typeFilter);

        const sorted = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));

        if (sorted.length === 0) {
            $('allTradesBody').innerHTML = '';
            $('emptyState').style.display = 'block';
        } else {
            $('emptyState').style.display = 'none';
            $('allTradesBody').innerHTML = sorted.map(t => tradeRow(t, true)).join('');

            // Wire up action buttons
            document.querySelectorAll('.edit-trade').forEach(btn => {
                btn.addEventListener('click', () => openEditModal(btn.dataset.id));
            });
            document.querySelectorAll('.delete-trade').forEach(btn => {
                btn.addEventListener('click', () => {
                    if (confirm('Delete this trade?')) {
                        Store.deleteTrade(btn.dataset.id);
                        render();
                        showToast('Trade deleted', 'success');
                    }
                });
            });
        }
    }

    function tradeRow(trade, showActions) {
        const pl = Store.calcPL(trade);
        const plClass = pl >= 0 ? 'green' : 'red';
        const typeLabel = {
            stock: 'Stock',
            option_call: 'Call',
            option_put: 'Put',
            futures: 'Futures',
            crypto: 'Crypto',
        }[trade.type] || trade.type;

        const sideTag = trade.side === 'long' 
            ? '<span class="tag tag-green">Long</span>' 
            : '<span class="tag tag-red">Short</span>';

        const strategyTag = trade.strategy 
            ? `<span class="tag tag-purple">${trade.strategy}</span>` 
            : '<span class="text-muted">—</span>';

        let actions = '';
        if (showActions) {
            actions = `<td>
                <div class="trade-actions">
                    <button class="btn btn-ghost btn-sm edit-trade" data-id="${trade.id}">✏️</button>
                    <button class="btn btn-ghost btn-sm delete-trade" data-id="${trade.id}">🗑️</button>
                </div>
            </td>`;
            const notes = trade.notes ? `<td class="text-sm text-secondary" style="max-width:150px;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(trade.notes)}</td>` : '<td class="text-muted">—</td>';
            return `<tr>
                <td class="mono text-sm">${formatDate(trade.date)}</td>
                <td><strong>${escapeHtml(trade.ticker)}</strong></td>
                <td><span class="tag tag-blue">${typeLabel}</span></td>
                <td>${sideTag}</td>
                <td class="mono">$${parseFloat(trade.entry).toFixed(2)}</td>
                <td class="mono">$${parseFloat(trade.exit).toFixed(2)}</td>
                <td class="mono">${trade.qty}</td>
                <td class="mono ${plClass}">${formatCurrency(pl)}</td>
                <td>${strategyTag}</td>
                ${notes}
                ${actions}
            </tr>`;
        }

        return `<tr>
            <td class="mono text-sm">${formatDate(trade.date)}</td>
            <td><strong>${escapeHtml(trade.ticker)}</strong></td>
            <td><span class="tag tag-blue">${typeLabel}</span></td>
            <td>${sideTag}</td>
            <td class="mono">$${parseFloat(trade.entry).toFixed(2)}</td>
            <td class="mono">$${parseFloat(trade.exit).toFixed(2)}</td>
            <td class="mono">${trade.qty}</td>
            <td class="mono ${plClass}">${formatCurrency(pl)}</td>
            <td>${strategyTag}</td>
        </tr>`;
    }

    // ===== ANALYTICS =====
    function renderAnalytics() {
        const period = parseInt($('analyticsPeriod')?.value || 90);
        const trades = Store.getTradesByPeriod(period);

        renderPLByTicker(trades);
        renderWinRateByStrategy(trades);
        renderPLByDayOfWeek(trades);
        renderDurationDist(trades);
        renderCumulativePL(trades);
    }

    function renderPLByTicker(trades) {
        const byTicker = {};
        trades.forEach(t => {
            byTicker[t.ticker] = (byTicker[t.ticker] || 0) + Store.calcPL(t);
        });

        const data = Object.entries(byTicker)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([ticker, pl]) => ({
                label: ticker,
                value: pl,
                color: pl >= 0 ? Charts.COLORS.green : Charts.COLORS.red,
            }));

        Charts.drawBarChart($('plByTickerChart'), data.length ? data : [{ label: 'No data', value: 0 }]);
    }

    function renderWinRateByStrategy(trades) {
        const byStrat = {};
        trades.forEach(t => {
            const s = t.strategy || 'None';
            if (!byStrat[s]) byStrat[s] = { wins: 0, total: 0 };
            byStrat[s].total++;
            if (Store.calcPL(t) > 0) byStrat[s].wins++;
        });

        const data = Object.entries(byStrat)
            .filter(([_, v]) => v.total >= 2)
            .sort((a, b) => (b[1].wins / b[1].total) - (a[1].wins / a[1].total))
            .map(([strat, v], i) => ({
                label: strat,
                value: Math.round((v.wins / v.total) * 100),
                color: Charts.CHART_COLORS[i % Charts.CHART_COLORS.length],
            }));

        Charts.drawHorizontalBarChart($('winRateByStratChart'), data.length ? data : [{ label: 'No data', value: 0 }]);
    }

    function renderPLByDayOfWeek(trades) {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const byDay = [0, 0, 0, 0, 0, 0, 0];
        
        trades.forEach(t => {
            const d = new Date(t.date + 'T12:00:00').getDay();
            byDay[d] += Store.calcPL(t);
        });

        const data = days.map((day, i) => ({
            label: day,
            value: byDay[i],
        }));

        Charts.drawBarChart($('plByDayChart'), data);
    }

    function renderDurationDist(trades) {
        // Simple: group by type for now
        const byType = {};
        trades.forEach(t => {
            const type = t.type || 'stock';
            byType[type] = (byType[type] || 0) + 1;
        });

        const labels = {
            stock: 'Stock', option_call: 'Calls', option_put: 'Puts',
            futures: 'Futures', crypto: 'Crypto',
        };

        const data = Object.entries(byType).map(([type, count], i) => ({
            label: labels[type] || type,
            value: count,
            color: Charts.CHART_COLORS[i % Charts.CHART_COLORS.length],
        }));

        Charts.drawBarChart($('durationChart'), data.length ? data : [{ label: 'No data', value: 0 }]);
    }

    function renderCumulativePL(trades) {
        if (!trades.length) {
            Charts.drawLineChart($('cumulativePLChart'), [{ label: 'No data', value: 0 }]);
            return;
        }

        const sorted = [...trades].sort((a, b) => new Date(a.date) - new Date(b.date));
        let cum = 0;
        const data = sorted.map(t => {
            cum += Store.calcPL(t);
            return { label: formatDate(t.date), value: cum };
        });

        Charts.drawLineChart($('cumulativePLChart'), data);
    }

    // ===== ACCOUNTS =====
    function renderAccounts() {
        const accounts = Store.getAccounts();
        const trades = Store.getTrades();
        const container = $('accountsList');
        const empty = $('accountsEmpty');

        if (accounts.length <= 1 && accounts[0]?.id === 'default') {
            // Show default + empty state
        }

        container.innerHTML = accounts.map(acc => {
            const accTrades = trades.filter(t => (t.account || 'default') === acc.id);
            const stats = Store.getStats(accTrades);
            const balance = parseFloat(acc.balance || 0) + stats.totalPL;
            
            return `<div class="stat-card">
                <div class="stat-label">${escapeHtml(acc.name)}</div>
                <div class="stat-value ${stats.totalPL >= 0 ? 'green' : 'red'}">${formatCurrency(balance)}</div>
                <div class="stat-change text-sm text-muted">
                    ${accTrades.length} trades · P&L: <span class="${stats.totalPL >= 0 ? 'green' : 'red'}">${formatCurrency(stats.totalPL)}</span>
                </div>
            </div>`;
        }).join('');

        empty.style.display = accounts.length === 0 ? 'block' : 'none';
    }

    // ===== TRADE MODAL =====
    function setupModal() {
        const modal = $('tradeModal');
        const open = () => openTradeModal();
        const close = () => closeModal(modal);

        $('addTradeBtn')?.addEventListener('click', open);
        $('addTradeBtn2')?.addEventListener('click', open);
        $('addTradeBtn3')?.addEventListener('click', open);
        $('modalClose')?.addEventListener('click', close);
        $('modalCancel')?.addEventListener('click', close);
        
        modal?.addEventListener('click', e => {
            if (e.target === modal) close();
        });

        $('modalSave')?.addEventListener('click', saveTrade);

        // Set default date
        $('tradeDate').value = new Date().toISOString().split('T')[0];
    }

    function openTradeModal() {
        editingTradeId = null;
        $('modalTitle').textContent = 'Log Trade';
        $('tradeDate').value = new Date().toISOString().split('T')[0];
        $('tradeTicker').value = '';
        $('tradeType').value = 'stock';
        $('tradeSide').value = 'long';
        $('tradeEntry').value = '';
        $('tradeExit').value = '';
        $('tradeQty').value = '100';
        $('tradeComm').value = '0';
        $('tradeStrategy').value = '';
        $('tradeEmotion').value = '';
        $('tradeAccount').value = 'default';
        $('tradeNotes').value = '';
        
        // Populate accounts
        populateAccountSelect();
        
        $('tradeModal').classList.add('open');
    }

    function openEditModal(id) {
        const trade = Store.getTrades().find(t => t.id === id);
        if (!trade) return;

        editingTradeId = id;
        $('modalTitle').textContent = 'Edit Trade';
        $('tradeDate').value = trade.date;
        $('tradeTicker').value = trade.ticker;
        $('tradeType').value = trade.type;
        $('tradeSide').value = trade.side;
        $('tradeEntry').value = trade.entry;
        $('tradeExit').value = trade.exit;
        $('tradeQty').value = trade.qty;
        $('tradeComm').value = trade.commission || 0;
        $('tradeStrategy').value = trade.strategy || '';
        $('tradeEmotion').value = trade.emotion || '';
        $('tradeAccount').value = trade.account || 'default';
        $('tradeNotes').value = trade.notes || '';

        populateAccountSelect();
        
        $('tradeModal').classList.add('open');
    }

    function populateAccountSelect() {
        const select = $('tradeAccount');
        const accounts = Store.getAccounts();
        select.innerHTML = accounts.map(a => 
            `<option value="${a.id}">${escapeHtml(a.name)}</option>`
        ).join('');
    }

    function saveTrade() {
        const ticker = $('tradeTicker').value.trim().toUpperCase();
        if (!ticker) {
            showToast('Ticker is required', 'error');
            return;
        }

        const entry = parseFloat($('tradeEntry').value);
        const exit = parseFloat($('tradeExit').value);
        if (isNaN(entry) || isNaN(exit)) {
            showToast('Entry and exit prices are required', 'error');
            return;
        }

        const trade = {
            date: $('tradeDate').value,
            ticker,
            type: $('tradeType').value,
            side: $('tradeSide').value,
            entry,
            exit,
            qty: parseInt($('tradeQty').value) || 1,
            commission: parseFloat($('tradeComm').value) || 0,
            strategy: $('tradeStrategy').value,
            emotion: $('tradeEmotion').value,
            account: $('tradeAccount').value,
            notes: $('tradeNotes').value.trim(),
        };

        if (editingTradeId) {
            Store.updateTrade(editingTradeId, trade);
            showToast('Trade updated!', 'success');
        } else {
            Store.addTrade(trade);
            showToast('Trade logged!', 'success');
        }

        closeModal($('tradeModal'));
        render();
    }

    // ===== ACCOUNT MODAL =====
    function setupAccountModal() {
        const modal = $('accountModal');
        const open = () => {
            $('accountName').value = '';
            $('accountBalance').value = '10000';
            modal.classList.add('open');
        };
        const close = () => closeModal(modal);

        $('addAccountBtn')?.addEventListener('click', open);
        $('addAccountBtn2')?.addEventListener('click', open);
        $('accountModalClose')?.addEventListener('click', close);
        $('accountModalCancel')?.addEventListener('click', close);
        
        modal?.addEventListener('click', e => {
            if (e.target === modal) close();
        });

        $('accountModalSave')?.addEventListener('click', () => {
            const name = $('accountName').value.trim();
            if (!name) {
                showToast('Account name is required', 'error');
                return;
            }
            Store.addAccount({
                name,
                balance: parseFloat($('accountBalance').value) || 0,
            });
            close();
            render();
            showToast('Account added!', 'success');
        });
    }

    function closeModal(modal) {
        modal?.classList.remove('open');
        editingTradeId = null;
    }

    // ===== DATA MANAGEMENT =====
    function setupDataManagement() {
        // Export
        const doExport = () => {
            const data = Store.exportAll();
            download('tradelog-backup.json', data, 'application/json');
            showToast('Data exported!', 'success');
        };
        
        const doExportCSV = () => {
            const csv = Store.exportCSV();
            if (!csv) {
                showToast('No trades to export', 'error');
                return;
            }
            download('tradelog-trades.csv', csv, 'text/csv');
            showToast('CSV exported!', 'success');
        };

        const doImport = () => {
            $('importFileInput')?.click();
        };

        $('exportBtn')?.addEventListener('click', doExport);
        $('settingsExport')?.addEventListener('click', doExport);
        $('settingsExportCSV')?.addEventListener('click', doExportCSV);
        $('importBtn')?.addEventListener('click', doImport);
        $('settingsImport')?.addEventListener('click', doImport);

        $('importFileInput')?.addEventListener('change', e => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => {
                if (Store.importData(reader.result)) {
                    showToast('Data imported!', 'success');
                    render();
                } else {
                    showToast('Import failed. Invalid file format.', 'error');
                }
            };
            reader.readAsText(file);
            e.target.value = '';
        });

        $('settingsClear')?.addEventListener('click', () => {
            if (confirm('⚠️ This will delete ALL your trades and data. Are you sure?')) {
                if (confirm('This cannot be undone. Final confirmation?')) {
                    Store.clearAll();
                    render();
                    showToast('All data cleared', 'info');
                }
            }
        });
    }

    // ===== FILTERS =====
    function setupFilters() {
        $('dashPeriod')?.addEventListener('change', () => renderDashboard());
        $('analyticsPeriod')?.addEventListener('change', () => renderAnalytics());
        $('tradeSearch')?.addEventListener('input', () => renderTradeLog());
        $('tradeFilterType')?.addEventListener('change', () => renderTradeLog());
    }

    // ===== SAMPLE DATA =====
    function loadSampleDataIfEmpty() {
        if (Store.getTrades().length > 0) return;

        const tickers = ['AAPL', 'TSLA', 'NVDA', 'SPY', 'AMZN', 'META', 'MSFT', 'GOOGL', 'AMD', 'QQQ'];
        const types = ['stock', 'option_call', 'option_put', 'stock', 'stock'];
        const strategies = ['breakout', 'pullback', 'momentum', 'swing', 'scalp', 'theta_decay', 'covered_call', ''];
        const emotions = ['calm', 'confident', 'fomo', '', 'calm', 'confident', ''];
        const sides = ['long', 'long', 'long', 'short', 'long'];

        const trades = [];
        const today = new Date();
        
        for (let i = 0; i < 35; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - Math.floor(Math.random() * 60));
            
            const ticker = tickers[Math.floor(Math.random() * tickers.length)];
            const type = types[Math.floor(Math.random() * types.length)];
            const side = sides[Math.floor(Math.random() * sides.length)];
            
            let entry, exit;
            if (type === 'option_call' || type === 'option_put') {
                entry = +(Math.random() * 10 + 1).toFixed(2);
                const change = (Math.random() - 0.4) * entry;
                exit = +Math.max(0.01, entry + change).toFixed(2);
            } else {
                entry = +(Math.random() * 300 + 50).toFixed(2);
                const change = (Math.random() - 0.4) * 20;
                exit = +(entry + change).toFixed(2);
            }

            if (side === 'short') {
                [entry, exit] = [exit, entry]; // Reverse for short
            }

            trades.push({
                id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5) + i,
                date: date.toISOString().split('T')[0],
                ticker,
                type,
                side,
                entry,
                exit,
                qty: type.startsWith('option') ? Math.ceil(Math.random() * 5) : Math.ceil(Math.random() * 3) * 100,
                commission: +(Math.random() * 5).toFixed(2),
                strategy: strategies[Math.floor(Math.random() * strategies.length)],
                emotion: emotions[Math.floor(Math.random() * emotions.length)],
                account: 'default',
                notes: '',
                createdAt: new Date().toISOString(),
            });
        }

        Store.saveTrades(trades);
    }

    // ===== HELPERS =====
    function formatCurrency(val) {
        const neg = val < 0;
        const abs = Math.abs(val);
        const formatted = abs >= 1000 
            ? abs.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
            : abs.toFixed(2);
        return (neg ? '-$' : '$') + formatted;
    }

    function formatDate(dateStr) {
        const d = new Date(dateStr + 'T12:00:00');
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function download(filename, content, mime) {
        const blob = new Blob([content], { type: mime });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        a.click();
        URL.revokeObjectURL(a.href);
    }

    function showToast(message, type = 'info') {
        const container = $('toastContainer');
        if (!container) return;
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'} ${message}`;
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // ===== WINDOW RESIZE HANDLER =====
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(render, 300);
    });

    // Init
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
