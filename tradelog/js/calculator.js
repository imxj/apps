/**
 * TradeLog Pro — Options Profit Calculator
 * Calculates P&L for common options strategies with interactive chart
 */

(function() {
    'use strict';

    const $ = id => document.getElementById(id);

    // Strategy configurations
    const STRATEGIES = {
        long_call: { name: 'Long Call', legs: 1, needsSpread: false, needsCondor: false },
        long_put: { name: 'Long Put', legs: 1, needsSpread: false, needsCondor: false },
        covered_call: { name: 'Covered Call', legs: 1, needsSpread: false, needsCondor: false },
        bull_call_spread: { name: 'Bull Call Spread', legs: 2, needsSpread: true, needsCondor: false },
        bear_put_spread: { name: 'Bear Put Spread', legs: 2, needsSpread: true, needsCondor: false },
        iron_condor: { name: 'Iron Condor', legs: 4, needsSpread: true, needsCondor: true },
        straddle: { name: 'Long Straddle', legs: 2, needsSpread: false, needsCondor: false },
        strangle: { name: 'Long Strangle', legs: 2, needsSpread: true, needsCondor: false },
    };

    function init() {
        const strategySelect = $('calcStrategy');
        const calcBtn = $('calcBtn');
        
        if (!strategySelect || !calcBtn) return;

        strategySelect.addEventListener('change', onStrategyChange);
        calcBtn.addEventListener('click', calculate);

        // Set defaults for strangle
        onStrategyChange();
    }

    function onStrategyChange() {
        const strategy = $('calcStrategy').value;
        const config = STRATEGIES[strategy];
        
        const spreadInputs = $('spreadInputs');
        const condorInputs = $('condorInputs');
        
        if (spreadInputs) spreadInputs.style.display = config.needsSpread ? 'flex' : 'none';
        if (condorInputs) condorInputs.style.display = config.needsCondor ? 'flex' : 'none';

        // Auto-adjust labels based on strategy
        if (strategy === 'strangle') {
            // Strike 1 = Call strike (higher), Strike 2 = Put strike (lower)
            setLabel('calcStrike', 'Call Strike');
            setLabel('calcStrike2', 'Put Strike');
            setLabel('calcPremium', 'Call Premium');
            setLabel('calcPremium2', 'Put Premium');
        } else if (config.needsSpread) {
            setLabel('calcStrike', 'Strike 1');
            setLabel('calcStrike2', 'Strike 2');
            setLabel('calcPremium', 'Premium 1');
            setLabel('calcPremium2', 'Premium 2');
        }
    }

    function setLabel(inputId, text) {
        const input = $(inputId);
        if (input && input.parentElement) {
            const label = input.parentElement.querySelector('label');
            if (label) label.textContent = text;
        }
    }

    function val(id) {
        return parseFloat($(id).value) || 0;
    }

    function calculate() {
        const strategy = $('calcStrategy').value;
        const stockPrice = val('calcStockPrice');
        const strike = val('calcStrike');
        const premium = val('calcPremium');
        const strike2 = val('calcStrike2');
        const premium2 = val('calcPremium2');
        const putStrike = val('calcPutStrike');
        const putStrike2 = val('calcPutStrike2');
        const contracts = val('calcContracts') || 1;
        const multiplier = contracts * 100;

        // Calculate P&L at a range of stock prices
        const minPrice = Math.max(0, stockPrice * 0.6);
        const maxPrice = stockPrice * 1.4;
        const step = (maxPrice - minPrice) / 100;
        
        const prices = [];
        const pls = [];
        
        for (let p = minPrice; p <= maxPrice; p += step) {
            prices.push(p);
            pls.push(calcPL(strategy, p, strike, premium, strike2, premium2, putStrike, putStrike2) * multiplier);
        }

        // Find max profit, max loss, breakeven
        const maxProfit = Math.max(...pls);
        const maxLoss = Math.min(...pls);
        
        // Find breakeven points
        const breakevens = [];
        for (let i = 1; i < pls.length; i++) {
            if ((pls[i-1] <= 0 && pls[i] >= 0) || (pls[i-1] >= 0 && pls[i] <= 0)) {
                breakevens.push(prices[i].toFixed(2));
            }
        }

        // Update stats
        $('maxProfit').textContent = maxProfit === Infinity || maxProfit > 1000000 
            ? 'Unlimited' 
            : formatCurrency(maxProfit);
        $('maxProfit').className = 'calc-stat-value green';
        
        $('maxLoss').textContent = formatCurrency(maxLoss);
        $('maxLoss').className = 'calc-stat-value red';
        
        $('breakeven').textContent = breakevens.length > 0 
            ? '$' + breakevens.join(' / $') 
            : '—';
        
        const rr = maxLoss !== 0 ? Math.abs(maxProfit / maxLoss) : Infinity;
        $('riskReward').textContent = rr === Infinity || rr > 100 
            ? 'Unlimited' 
            : '1:' + rr.toFixed(2);

        drawChart(prices, pls, stockPrice, breakevens.map(Number));
    }

    function calcPL(strategy, price, strike, premium, strike2, premium2, putStrike, putStrike2) {
        switch (strategy) {
            case 'long_call':
                return Math.max(price - strike, 0) - premium;
            
            case 'long_put':
                return Math.max(strike - price, 0) - premium;
            
            case 'covered_call':
                // Own 100 shares + sell call
                const stockPL = price - val('calcStockPrice');
                const callPL = premium - Math.max(price - strike, 0);
                return stockPL + callPL;
            
            case 'bull_call_spread':
                // Buy lower strike call, sell higher strike call
                const buyCall = Math.max(price - strike, 0) - premium;
                const sellCall = premium2 - Math.max(price - strike2, 0);
                return buyCall + sellCall;
            
            case 'bear_put_spread':
                // Buy higher strike put, sell lower strike put
                const buyPut = Math.max(strike - price, 0) - premium;
                const sellPut = premium2 - Math.max(strike2 - price, 0);
                return buyPut + sellPut;
            
            case 'iron_condor':
                // Sell call spread + sell put spread
                // Sell call at strike, buy call at strike2
                // Sell put at putStrike, buy put at putStrike2
                const shortCall = premium - Math.max(price - strike, 0);
                const longCall = Math.max(price - strike2, 0) - premium2;
                const shortPut = premium - Math.max(putStrike - price, 0);
                const longPut2 = Math.max(putStrike2 - price, 0) - premium2;
                return shortCall + longCall + shortPut + longPut2;
            
            case 'straddle':
                // Buy call and put at same strike
                const straddleCall = Math.max(price - strike, 0) - premium;
                const straddlePut = Math.max(strike - price, 0) - premium;
                return straddleCall + straddlePut;
            
            case 'strangle':
                // Buy OTM call and OTM put
                const strangleCall = Math.max(price - strike, 0) - premium;
                const stranglePut = Math.max(strike2 - price, 0) - premium2;
                return strangleCall + stranglePut;
            
            default:
                return 0;
        }
    }

    function formatCurrency(val) {
        const neg = val < 0;
        const abs = Math.abs(val);
        return (neg ? '-$' : '+$') + abs.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    function drawChart(prices, pls, currentPrice, breakevens) {
        const canvas = $('plChart');
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

        // Clear
        ctx.clearRect(0, 0, w, h);

        // Find bounds
        const minPL = Math.min(...pls, 0);
        const maxPL = Math.max(...pls, 0);
        const plRange = maxPL - minPL || 1;
        const minPrice = prices[0];
        const maxPrice = prices[prices.length - 1];
        const priceRange = maxPrice - minPrice || 1;

        function xScale(p) { return pad.left + ((p - minPrice) / priceRange) * chartW; }
        function yScale(pl) { return pad.top + chartH - ((pl - minPL) / plRange) * chartH; }

        // Grid lines
        ctx.strokeStyle = 'rgba(255,255,255,0.05)';
        ctx.lineWidth = 1;
        
        const yTicks = 5;
        for (let i = 0; i <= yTicks; i++) {
            const pl = minPL + (plRange / yTicks) * i;
            const y = yScale(pl);
            ctx.beginPath();
            ctx.moveTo(pad.left, y);
            ctx.lineTo(w - pad.right, y);
            ctx.stroke();
            
            ctx.fillStyle = '#6b6b80';
            ctx.font = '11px JetBrains Mono, monospace';
            ctx.textAlign = 'right';
            ctx.fillText('$' + pl.toFixed(0), pad.left - 8, y + 4);
        }

        // X axis labels
        const xTicks = 6;
        for (let i = 0; i <= xTicks; i++) {
            const p = minPrice + (priceRange / xTicks) * i;
            const x = xScale(p);
            ctx.fillStyle = '#6b6b80';
            ctx.font = '11px JetBrains Mono, monospace';
            ctx.textAlign = 'center';
            ctx.fillText('$' + p.toFixed(0), x, h - 8);
        }

        // Zero line
        if (minPL < 0 && maxPL > 0) {
            const zeroY = yScale(0);
            ctx.strokeStyle = 'rgba(255,255,255,0.15)';
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(pad.left, zeroY);
            ctx.lineTo(w - pad.right, zeroY);
            ctx.stroke();
            ctx.setLineDash([]);
        }

        // Current price vertical line
        const cpx = xScale(currentPrice);
        ctx.strokeStyle = 'rgba(139, 92, 246, 0.4)';
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(cpx, pad.top);
        ctx.lineTo(cpx, h - pad.bottom);
        ctx.stroke();
        ctx.setLineDash([]);
        
        ctx.fillStyle = '#8b5cf6';
        ctx.font = '10px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Current: $' + currentPrice.toFixed(0), cpx, pad.top - 4);

        // P&L fill (green above zero, red below)
        const zeroY = yScale(0);
        
        // Green fill
        ctx.beginPath();
        ctx.moveTo(xScale(prices[0]), zeroY);
        for (let i = 0; i < prices.length; i++) {
            const x = xScale(prices[i]);
            const y = Math.min(yScale(Math.max(pls[i], 0)), zeroY);
            ctx.lineTo(x, y);
        }
        ctx.lineTo(xScale(prices[prices.length - 1]), zeroY);
        ctx.closePath();
        ctx.fillStyle = 'rgba(16, 185, 129, 0.1)';
        ctx.fill();

        // Red fill
        ctx.beginPath();
        ctx.moveTo(xScale(prices[0]), zeroY);
        for (let i = 0; i < prices.length; i++) {
            const x = xScale(prices[i]);
            const y = Math.max(yScale(Math.min(pls[i], 0)), zeroY);
            ctx.lineTo(x, y);
        }
        ctx.lineTo(xScale(prices[prices.length - 1]), zeroY);
        ctx.closePath();
        ctx.fillStyle = 'rgba(239, 68, 68, 0.1)';
        ctx.fill();

        // P&L line
        ctx.beginPath();
        for (let i = 0; i < prices.length; i++) {
            const x = xScale(prices[i]);
            const y = yScale(pls[i]);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Breakeven dots
        breakevens.forEach(be => {
            const x = xScale(be);
            const y = yScale(0);
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fillStyle = '#f59e0b';
            ctx.fill();
            ctx.strokeStyle = '#0a0a0f';
            ctx.lineWidth = 2;
            ctx.stroke();
        });
    }

    // Debounced resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if ($('plChart') && $('maxProfit').textContent !== '—') {
                $('calcBtn').click();
            }
        }, 200);
    });

    // Init
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
