/**
 * TradeLog Pro — In-App Calculator (mirrors landing page calculator with app-prefixed IDs)
 */

(function() {
    'use strict';

    const $ = id => document.getElementById(id);

    const STRATEGIES = {
        long_call: { needsSpread: false },
        long_put: { needsSpread: false },
        covered_call: { needsSpread: false },
        bull_call_spread: { needsSpread: true },
        bear_put_spread: { needsSpread: true },
        iron_condor: { needsSpread: true },
        straddle: { needsSpread: false },
        strangle: { needsSpread: true },
    };

    function init() {
        const strategySelect = $('appCalcStrategy');
        const calcBtn = $('appCalcBtn');
        
        if (!strategySelect || !calcBtn) return;

        strategySelect.addEventListener('change', () => {
            const config = STRATEGIES[strategySelect.value];
            const spread = $('appSpreadInputs');
            if (spread) spread.style.display = config.needsSpread ? 'flex' : 'none';
        });

        calcBtn.addEventListener('click', calculate);
    }

    function val(id) {
        return parseFloat($(id)?.value) || 0;
    }

    function calculate() {
        const strategy = $('appCalcStrategy').value;
        const stockPrice = val('appCalcStockPrice');
        const strike = val('appCalcStrike');
        const premium = val('appCalcPremium');
        const strike2 = val('appCalcStrike2');
        const premium2 = val('appCalcPremium2');
        const contracts = val('appCalcContracts') || 1;
        const multiplier = contracts * 100;

        const minPrice = Math.max(0, stockPrice * 0.6);
        const maxPrice = stockPrice * 1.4;
        const step = (maxPrice - minPrice) / 100;
        
        const prices = [];
        const pls = [];
        
        for (let p = minPrice; p <= maxPrice; p += step) {
            prices.push(p);
            pls.push(calcPL(strategy, p, stockPrice, strike, premium, strike2, premium2) * multiplier);
        }

        const maxProfit = Math.max(...pls);
        const maxLoss = Math.min(...pls);
        
        const breakevens = [];
        for (let i = 1; i < pls.length; i++) {
            if ((pls[i-1] <= 0 && pls[i] >= 0) || (pls[i-1] >= 0 && pls[i] <= 0)) {
                breakevens.push(prices[i].toFixed(2));
            }
        }

        $('appMaxProfit').textContent = maxProfit > 1000000 ? 'Unlimited' : formatCurrency(maxProfit);
        $('appMaxLoss').textContent = formatCurrency(maxLoss);
        $('appBreakeven').textContent = breakevens.length ? '$' + breakevens.join(' / $') : '—';
        
        const rr = maxLoss !== 0 ? Math.abs(maxProfit / maxLoss) : Infinity;
        $('appRiskReward').textContent = rr > 100 ? 'Unlimited' : '1:' + rr.toFixed(2);

        drawChart(prices, pls, stockPrice, breakevens.map(Number));
    }

    function calcPL(strategy, price, stockPrice, strike, premium, strike2, premium2) {
        switch (strategy) {
            case 'long_call':
                return Math.max(price - strike, 0) - premium;
            case 'long_put':
                return Math.max(strike - price, 0) - premium;
            case 'covered_call':
                return (price - stockPrice) + premium - Math.max(price - strike, 0);
            case 'bull_call_spread':
                return (Math.max(price - strike, 0) - premium) + (premium2 - Math.max(price - strike2, 0));
            case 'bear_put_spread':
                return (Math.max(strike - price, 0) - premium) + (premium2 - Math.max(strike2 - price, 0));
            case 'straddle':
                return Math.max(price - strike, 0) + Math.max(strike - price, 0) - premium * 2;
            case 'strangle':
                return Math.max(price - strike, 0) + Math.max(strike2 - price, 0) - premium - premium2;
            default:
                return 0;
        }
    }

    function formatCurrency(val) {
        const neg = val < 0;
        return (neg ? '-$' : '+$') + Math.abs(val).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    function drawChart(prices, pls, currentPrice, breakevens) {
        const canvas = $('appPLChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.parentElement.getBoundingClientRect();
        
        canvas.width = rect.width * dpr;
        canvas.height = 280 * dpr;
        canvas.style.width = rect.width + 'px';
        canvas.style.height = '280px';
        ctx.scale(dpr, dpr);
        
        const w = rect.width;
        const h = 280;
        const pad = { top: 20, right: 20, bottom: 40, left: 65 };
        const chartW = w - pad.left - pad.right;
        const chartH = h - pad.top - pad.bottom;

        ctx.clearRect(0, 0, w, h);

        const minPL = Math.min(...pls, 0);
        const maxPL = Math.max(...pls, 0);
        const plRange = maxPL - minPL || 1;
        const minPrice = prices[0];
        const maxPrice = prices[prices.length - 1];
        const priceRange = maxPrice - minPrice || 1;

        function xScale(p) { return pad.left + ((p - minPrice) / priceRange) * chartW; }
        function yScale(pl) { return pad.top + chartH - ((pl - minPL) / plRange) * chartH; }

        // Grid
        ctx.strokeStyle = 'rgba(255,255,255,0.05)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 5; i++) {
            const pl = minPL + (plRange / 5) * i;
            const y = yScale(pl);
            ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(w - pad.right, y); ctx.stroke();
            ctx.fillStyle = '#6b6b80';
            ctx.font = '11px JetBrains Mono, monospace';
            ctx.textAlign = 'right';
            ctx.fillText('$' + pl.toFixed(0), pad.left - 8, y + 4);
        }

        // X labels
        for (let i = 0; i <= 6; i++) {
            const p = minPrice + (priceRange / 6) * i;
            ctx.fillStyle = '#6b6b80';
            ctx.font = '11px JetBrains Mono, monospace';
            ctx.textAlign = 'center';
            ctx.fillText('$' + p.toFixed(0), xScale(p), h - 8);
        }

        // Zero line
        if (minPL < 0 && maxPL > 0) {
            ctx.strokeStyle = 'rgba(255,255,255,0.15)';
            ctx.setLineDash([5, 5]);
            ctx.beginPath(); ctx.moveTo(pad.left, yScale(0)); ctx.lineTo(w - pad.right, yScale(0)); ctx.stroke();
            ctx.setLineDash([]);
        }

        // Current price line
        const cpx = xScale(currentPrice);
        ctx.strokeStyle = 'rgba(139, 92, 246, 0.4)';
        ctx.setLineDash([5, 5]);
        ctx.beginPath(); ctx.moveTo(cpx, pad.top); ctx.lineTo(cpx, h - pad.bottom); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#8b5cf6';
        ctx.font = '10px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Current: $' + currentPrice.toFixed(0), cpx, pad.top - 4);

        // Green/red fills
        const zeroY = yScale(0);
        
        ctx.beginPath();
        ctx.moveTo(xScale(prices[0]), zeroY);
        for (let i = 0; i < prices.length; i++) ctx.lineTo(xScale(prices[i]), Math.min(yScale(Math.max(pls[i], 0)), zeroY));
        ctx.lineTo(xScale(prices[prices.length - 1]), zeroY);
        ctx.closePath();
        ctx.fillStyle = 'rgba(16, 185, 129, 0.1)';
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(xScale(prices[0]), zeroY);
        for (let i = 0; i < prices.length; i++) ctx.lineTo(xScale(prices[i]), Math.max(yScale(Math.min(pls[i], 0)), zeroY));
        ctx.lineTo(xScale(prices[prices.length - 1]), zeroY);
        ctx.closePath();
        ctx.fillStyle = 'rgba(239, 68, 68, 0.1)';
        ctx.fill();

        // P&L line
        ctx.beginPath();
        for (let i = 0; i < prices.length; i++) {
            if (i === 0) ctx.moveTo(xScale(prices[i]), yScale(pls[i]));
            else ctx.lineTo(xScale(prices[i]), yScale(pls[i]));
        }
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Breakeven dots
        breakevens.forEach(be => {
            ctx.beginPath();
            ctx.arc(xScale(be), yScale(0), 5, 0, Math.PI * 2);
            ctx.fillStyle = '#f59e0b';
            ctx.fill();
            ctx.strokeStyle = '#0a0a0f';
            ctx.lineWidth = 2;
            ctx.stroke();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
