// src/pages/Statistics.jsx
import React, { useEffect, useState } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend, ArcElement
} from 'chart.js';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement
);

export default function Statistics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  // ---- theme ----
  const dark = {
    bg: '#000',
    card: 'rgba(17, 24, 39, 0.7)',
    border: 'rgba(55, 65, 81, 0.5)',
    text: '#f0f0f0',
    grid: 'rgba(255,255,255,0.1)',
    blue: '#2C7FB8',
    blue2: '#4F98C3',
    colors: ['#042b69ff','#4d99beff','#6182beff','#77c9ddff','#3baaebff','#0D526D','#644899ff','#7b6aacff','#268bddff']
  };

  // normalize DB-style or NASA-style payloads
  function normalize(raw) {
    // DB-style
    if (raw?.impactsOverTime || raw?.impactsByCountry || raw?.totalImpacts) {
      return {
        totalImpacts: Number(raw.totalImpacts ?? 0),
        hazardousCount: Number(raw.hazardousCount ?? 0),
        impactsOverTime: raw.impactsOverTime ?? {},
        impactsByCountry: raw.impactsByCountry ?? {}
      };
    }
    // NASA-style
    const total = Number(raw?.totalAsteroidsTracked ?? raw?.nearEarthThisMonth ?? 0);
    const haz   = Number(raw?.hazardousCount ?? 0);
    const label = raw?.range ? `${raw.range.start}–${raw.range.end}` : 'last-7-days';
    return {
      totalImpacts: total,
      hazardousCount: haz,
      impactsOverTime: { [label]: total },
      impactsByCountry: {}
    };
  }

  // helper to fetch with timeout (abort if backend hangs)
  async function fetchJson(url, opts = {}, timeoutMs = 10000) {
    const c = new AbortController();
    const t = setTimeout(() => c.abort(), timeoutMs);
    try {
      const resp = await fetch(url, { ...opts, signal: c.signal, headers: { Accept: 'application/json', ...(opts.headers||{}) } });
      if (!resp.ok) throw new Error(`HTTP ${resp.status} for ${url}`);
      return await resp.json();
    } finally {
      clearTimeout(t);
    }
  }

  useEffect(() => {
    (async () => {
      try {
        // Build backend base from env; keep your existing names
        const RAW =
          import.meta.env.VITE_API_BASE ||
          import.meta.env.VITE_API_URL ||
          'http://localhost:5000/api';
        const API_BASE = RAW.replace(/\/+$/, '');

        // 1) Try the primary stats endpoint
        const statsUrl = `${API_BASE}/stats`;
        console.log('[Statistics] fetching:', statsUrl);

        let raw;
        try {
          raw = await fetchJson(statsUrl, {}, 12000); // 12s timeout
        } catch (e) {
          console.warn('[Statistics] /api/stats failed, falling back to /api/asteroids:', e);

          // 2) Fallback: derive stats from today's asteroids
          const astUrl = `${API_BASE}/asteroids`;
          const list = await fetchJson(astUrl, {}, 12000); // returns array
          const total = Array.isArray(list) ? list.length : 0;
          const haz   = Array.isArray(list)
            ? list.filter(a => a?.is_potentially_hazardous_asteroid).length
            : 0;

          const today = new Date().toISOString().slice(0,10);
          raw = {
            totalAsteroidsTracked: total,
            hazardousCount: haz,
            range: { start: today, end: today }
          };
        }

        setStats(normalize(raw));
      } catch (err) {
        console.error('Statistics load error:', err);
        setError('Failed to load statistics from the API.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ---- UI states ----
  if (loading) {
    return (
      <div style={{ background: dark.bg, minHeight: '100vh', display:'flex', justifyContent:'center', alignItems:'center', color: dark.text, fontSize:'1.5rem', fontWeight:500 }}>
        Loading asteroid impact statistics...
      </div>
    );
  }
  if (error) {
    return (
      <div style={{ background: dark.bg, minHeight: '100vh', display:'flex', justifyContent:'center', alignItems:'center', color: dark.text }}>
        <div>{error}</div>
      </div>
    );
  }
  if (!stats || Number(stats.totalImpacts) === 0) {
    return (
      <div style={{ background: dark.bg, minHeight:'100vh', display:'flex', justifyContent:'center', alignItems:'center', color: dark.text }}>
        No asteroid impact data found.
      </div>
    );
  }

  // ---- charts ----
  const years = Object.keys(stats.impactsOverTime || {}).sort();
  const impactsData = years.map((y) => Number(stats.impactsOverTime[y]));

  const barData = {
    labels: years,
    datasets: [{
      label: 'Number of Impacts',
      data: impactsData,
      backgroundColor: dark.blue,
      borderColor: dark.blue,
      borderWidth: 1,
      borderRadius: 4,
      hoverBackgroundColor: dark.blue2
    }]
  };
  const barOpts = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'IMPACTS OVER TIME', color: dark.text, font: { size: 18, weight: 'bold' } },
      tooltip: { backgroundColor: 'rgba(23,60,121,0.9)', titleColor: '#fff', bodyColor: '#fff' }
    },
    scales: {
      x: { grid: { color: dark.grid }, ticks: { color: dark.text, font: { size: 12, weight: 'bold' } } },
      y: { beginAtZero: true, grid: { color: dark.grid }, ticks: { color: dark.text, font: { size: 12, weight: 'bold' }, stepSize: 1 } }
    },
    animation: { duration: 1500, easing: 'easeOutQuart' }
  };

  const entries = Object.entries(stats.impactsByCountry || {})
    .map(([k,v]) => [k, Number(v)])
    .sort((a,b) => b[1]-a[1]);
  const labels = entries.map(([c]) => c);
  const values = entries.map(([,v]) => v);
  const colors = values.map((_, i) => dark.colors[i % dark.colors.length]);

  const pieData = {
    labels,
    datasets: [{
      data: values,
      backgroundColor: colors,
      borderColor: dark.bg,
      borderWidth: 2,
      hoverBorderWidth: 3,
      hoverOffset: 8
    }]
  };
  const pieOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right', labels: { color: dark.text, font: { size: 12, weight: 'bold' }, padding: 20, usePointStyle: true, pointStyle: 'circle' } },
      title: { display: true, text: 'IMPACT DISTRIBUTION BY COUNTRY', color: dark.text, font: { size: 16, weight: 'bold' }, padding: { top: 10, bottom: 20 } },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const label = ctx.label || '';
            const value = Number(ctx.raw);
            const total = ctx.dataset.data.reduce((a,b)=>Number(a)+Number(b),0);
            const pct = total ? ((value/total)*100).toFixed(1) : '0.0';
            return `${label}: ${value} impacts (${pct}%)`;
          }
        },
        backgroundColor: 'rgba(30,41,59,0.9)', titleColor: '#fff', bodyColor: '#fff'
      }
    },
    cutout: '50%',
    animation: { animateScale:true, animateRotate:true, duration:1500 }
  };

  const totalImpacts = Number(stats.totalImpacts || 0);

  return (
    <div style={{ background: dark.bg, minHeight: '100vh', padding: '30px 20px', color: dark.text }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 40, background: dark.card, backdropFilter: 'blur(5px)', border: `1px solid ${dark.border}`, padding: 30, borderRadius: 15, boxShadow: '0 5px 15px rgba(0,0,0,0.2)' }}>
        <h1 style={{ fontSize: '2.6rem', fontWeight: 700, marginBottom: 10, textTransform: 'uppercase' }}>
          ASTEROID IMPACT ANALYTICS
        </h1>
        <p style={{ fontSize: '1.2rem', opacity: 0.8 }}>Exploring Cosmic Impact Data</p>
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 30 }}>
        {/* Bar */}
        <div style={{ background: dark.card, backdropFilter: 'blur(5px)', border: `1px solid ${dark.border}`, borderRadius: 15, padding: 30, boxShadow: '0 5px 15px rgba(0,0,0,0.2)' }}>
          <div style={{ height: 400 }}>
            <Bar data={barData} options={barOpts} />
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 50 }}>
          {/* Doughnut */}
          <div style={{ background: dark.card, backdropFilter: 'blur(5px)', border: `1px solid ${dark.border}`, borderRadius: 15, padding: 30, boxShadow: '0 5px 15px rgba(0,0,0,0.2)', minHeight: 400, display: 'flex', flexDirection: 'column' }}>
            <div style={{ height: 300, flex: 1 }}>
              <Doughnut data={pieData} options={pieOpts} />
            </div>
          </div>

          {/* Total */}
          <div style={{ background: dark.card, backdropFilter: 'blur(5px)', border: `1px solid ${dark.border}`, borderRadius: 15, padding: 25, boxShadow: '0 5px 15px rgba(0,0,0,0.2)', textAlign: 'center' }}>
            <h3 style={{ marginBottom: 15, fontSize: '1.3rem' }}>TOTAL COSMIC IMPACTS</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 700, color: dark.blue }}>{totalImpacts}</div>
            <div style={{ opacity: 0.8 }}>Aggregated from the API (with fallback)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
