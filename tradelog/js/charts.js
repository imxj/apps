/**
 * TradeLog Pro — Chart Rendering (Pure Canvas, no dependencies)
 */

const Charts = (function() {
    'use strict';

    const COLORS = {
        green: '#10b981',
        red: '#ef4444',
        blue: '#3b82f6',
        purple: '#8b5cf6',
        yellow: '#f59e0b',
        cyan: '#06b6d4',
        grid: 'rgba(255,255,255,0.05)',
        gridStrong: 'rgba(255,255,255,0.12)',
        text: '#6b6b80',
        textLight: '#9191a8',
        bg: '#1a1a26',
    };

    const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#f97316'];

    function setupCanvas(canvas) {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.parentElement.getBoundingClientRect();
        const w = rect.width;
        const h = 250;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
        const ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, w, h);
        return { ctx, w, h };
    }

    function drawLineChart(canvas, data, options = {}) {
        if (!canvas || !data || data.length === 0) return;
        
        const { ctx, w, h } = setupCanvas(canvas);
        const pad = { top: 20, right: 20, bottom: 35, left: 60 };
        const chartW = w - pad.left - pad.right;
        const chartH = h - pad.top - pad.bottom;

        const values = data.map(d => d.value);
        const min = options.minY !== undefined ? options.minY : Math.min(...values, 0);
        const max = Math.max(...values, 0);
        const range = max - min || 1;

        function x(i) { return pad.left + (i / (data.length - 1 || 1)) * chartW; }
        function y(v) { return pad.top + chartH - ((v - min) / range) * chartH; }

        // Grid
        ctx.strokeStyle = COLORS.grid;
        ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
            const val = min + (range / 4) * i;
            const yy = y(val);
            ctx.beginPath();
            ctx.moveTo(pad.left, yy);
            ctx.lineTo(w - pad.right, yy);
            ctx.stroke();
            
            ctx.fillStyle = COLORS.text;
            ctx.font = '10px JetBrains Mono, monospace';
            ctx.textAlign = 'right';
            ctx.fillText(formatNum(val), pad.left - 8, yy + 3);
        }

        // Zero line
        if (min < 0 && max > 0) {
            const zeroY = y(0);
            ctx.strokeStyle = COLORS.gridStrong;
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.moveTo(pad.left, zeroY);
            ctx.lineTo(w - pad.right, zeroY);
            ctx.stroke();
            ctx.setLineDash([]);
        }

        // X labels
        const xLabelsCount = Math.min(data.length, 8);
        const xStep = Math.floor(data.length / xLabelsCount) || 1;
        ctx.fillStyle = COLORS.text;
        ctx.font = '10px Inter, sans-serif';
        ctx.textAlign = 'center';
        for (let i = 0; i < data.length; i += xStep) {
            ctx.fillText(data[i].label || '', x(i), h - 8);
        }

        // Fill
        const gradient = ctx.createLinearGradient(0, pad.top, 0, h - pad.bottom);
        const color = options.color || (values[values.length - 1] >= (values[0] || 0) ? COLORS.green : COLORS.red);
        gradient.addColorStop(0, color.replace(')', ', 0.2)').replace('rgb', 'rgba'));
        gradient.addColorStop(1, color.replace(')', ', 0)').replace('rgb', 'rgba'));
        
        // Use hex to rgba conversion
        const fillAlpha = color.startsWith('#') ? hexToRGBA(color, 0.15) : color;
        const fillAlphaZero = color.startsWith('#') ? hexToRGBA(color, 0) : 'transparent';
        
        const grad = ctx.createLinearGradient(0, pad.top, 0, h - pad.bottom);
        grad.addColorStop(0, fillAlpha);
        grad.addColorStop(1, fillAlphaZero);

        ctx.beginPath();
        ctx.moveTo(x(0), y(0));
        for (let i = 0; i < data.length; i++) {
            ctx.lineTo(x(i), y(values[i]));
        }
        ctx.lineTo(x(data.length - 1), y(0));
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();

        // Line
        ctx.beginPath();
        for (let i = 0; i < data.length; i++) {
            if (i === 0) ctx.moveTo(x(i), y(values[i]));
            else ctx.lineTo(x(i), y(values[i]));
        }
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // End dot
        if (data.length > 0) {
            const lastI = data.length - 1;
            ctx.beginPath();
            ctx.arc(x(lastI), y(values[lastI]), 4, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
        }
    }

    function drawBarChart(canvas, data, options = {}) {
        if (!canvas || !data || data.length === 0) return;
        
        const { ctx, w, h } = setupCanvas(canvas);
        const pad = { top: 20, right: 20, bottom: 50, left: 60 };
        const chartW = w - pad.left - pad.right;
        const chartH = h - pad.top - pad.bottom;

        const values = data.map(d => d.value);
        const min = Math.min(...values, 0);
        const max = Math.max(...values, 0);
        const range = max - min || 1;

        function y(v) { return pad.top + chartH - ((v - min) / range) * chartH; }

        // Grid
        ctx.strokeStyle = COLORS.grid;
        ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
            const val = min + (range / 4) * i;
            const yy = y(val);
            ctx.beginPath();
            ctx.moveTo(pad.left, yy);
            ctx.lineTo(w - pad.right, yy);
            ctx.stroke();
            
            ctx.fillStyle = COLORS.text;
            ctx.font = '10px JetBrains Mono, monospace';
            ctx.textAlign = 'right';
            ctx.fillText(formatNum(val), pad.left - 8, yy + 3);
        }

        // Zero line
        if (min < 0 && max > 0) {
            ctx.strokeStyle = COLORS.gridStrong;
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.moveTo(pad.left, y(0));
            ctx.lineTo(w - pad.right, y(0));
            ctx.stroke();
            ctx.setLineDash([]);
        }

        // Bars
        const barWidth = Math.min((chartW / data.length) * 0.7, 40);
        const gap = (chartW / data.length - barWidth) / 2;
        
        data.forEach((d, i) => {
            const barX = pad.left + (chartW / data.length) * i + gap;
            const barY = y(Math.max(d.value, 0));
            const barH = Math.abs(y(d.value) - y(0));
            const color = d.color || (d.value >= 0 ? COLORS.green : COLORS.red);
            
            ctx.fillStyle = color;
            ctx.globalAlpha = 0.8;
            ctx.beginPath();
            roundRect(ctx, barX, d.value >= 0 ? barY : y(0), barWidth, barH, 3);
            ctx.fill();
            ctx.globalAlpha = 1;
            
            // Label
            ctx.fillStyle = COLORS.text;
            ctx.font = '10px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.save();
            ctx.translate(barX + barWidth / 2, h - 5);
            if (data.length > 8) {
                ctx.rotate(-0.5);
            }
            ctx.fillText(d.label || '', 0, 0);
            ctx.restore();
        });
    }

    function drawHorizontalBarChart(canvas, data, options = {}) {
        if (!canvas || !data || data.length === 0) return;
        
        const { ctx, w, h } = setupCanvas(canvas);
        const pad = { top: 10, right: 40, bottom: 10, left: 80 };
        const chartW = w - pad.left - pad.right;
        const chartH = h - pad.top - pad.bottom;

        const values = data.map(d => d.value);
        const max = Math.max(...values, 1);

        const barHeight = Math.min((chartH / data.length) * 0.7, 30);
        const gap = (chartH / data.length - barHeight) / 2;

        data.forEach((d, i) => {
            const barY = pad.top + (chartH / data.length) * i + gap;
            const barW = (d.value / max) * chartW;
            const color = d.color || CHART_COLORS[i % CHART_COLORS.length];
            
            // Label
            ctx.fillStyle = COLORS.textLight;
            ctx.font = '11px Inter, sans-serif';
            ctx.textAlign = 'right';
            ctx.fillText(d.label || '', pad.left - 8, barY + barHeight / 2 + 4);
            
            // Bar
            ctx.fillStyle = color;
            ctx.globalAlpha = 0.8;
            ctx.beginPath();
            roundRect(ctx, pad.left, barY, Math.max(barW, 2), barHeight, 3);
            ctx.fill();
            ctx.globalAlpha = 1;
            
            // Value
            ctx.fillStyle = COLORS.textLight;
            ctx.font = '11px JetBrains Mono, monospace';
            ctx.textAlign = 'left';
            ctx.fillText(formatNum(d.value), pad.left + barW + 6, barY + barHeight / 2 + 4);
        });
    }

    // Helpers
    function roundRect(ctx, x, y, w, h, r) {
        if (h === 0) return;
        r = Math.min(r, Math.abs(h) / 2, w / 2);
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
    }

    function formatNum(n) {
        if (Math.abs(n) >= 1000) {
            return (n >= 0 ? '$' : '-$') + Math.abs(n / 1000).toFixed(1) + 'k';
        }
        return (n >= 0 ? '$' : '-$') + Math.abs(n).toFixed(0);
    }

    function hexToRGBA(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r},${g},${b},${alpha})`;
    }

    return {
        drawLineChart,
        drawBarChart,
        drawHorizontalBarChart,
        COLORS,
        CHART_COLORS,
    };
})();
