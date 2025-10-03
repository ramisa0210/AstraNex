// src/pages/Statistics.jsx
import React, { useEffect, useState } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AsteroidStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ---- dark theme palette ----
  const darkColors = {
    background: '#000000',
    cardBg: 'rgba(17, 24, 39, 0.7)',
    border: 'rgba(55, 65, 81, 0.5)',
    text: '#f0f0f0',
    grid: 'rgba(255, 255, 255, 0.1)',
    primaryBlue: '#2C7FB8',
    secondaryBlue: '#4F98C3',
    chartColors: [
      '#042b69ff', '#4d99beff', '#6182beff', '#77c9ddff',
      '#3baaebff', '#0D526D', '#644899ff', '#7b6aacff', '#268bddff'
    ]
  };

  // Normalize backend payloads (DB-style or NASA-style)
  function normalizeStats(raw) {
    // DB-style:
    // { totalImpacts, impactsOverTime: {year:count}, impactsByCountry: {...}, hazardousCount? }
    if (raw?.impactsOverTime || raw?.impactsByCountry || raw?.totalImpacts) {
      return {
        totalImpacts: Number(raw.totalImpacts ?? 0),
        hazardousCount: Number(raw.hazardousCount ?? 0),
        impactsOverTime: raw.impactsOverTime ?? {},
        impactsByCountry: raw.impactsByCountry ?? {}
      };
    }

    // NASA-style:
    // { range:{start,end}, totalAsteroidsTracked, hazardousCount, nearEarthThisMonth }
    const total = Number(
      raw?.totalAsteroidsTracked ??
      raw?.nearEarthThisMonth ??
      0
    );
    const hazardous = Number(raw?.hazardousCount ?? 0);
    const bucketLabel = raw?.range
      ? `${raw.range.start}–${raw.range.end}`
      : 'last-7-days';

    return {
      totalImpacts: total,
      hazardousCount: hazardous,
      impactsOverTime: { [bucketLabel]: total },
      impactsByCountry: {}
    };
  }

  useEffect(() => {
    (async () => {
      try {
        // Use backend env base; fallback to localhost for dev
        const RAW =
          import.meta.env.VITE_API_BASE ||
          import.meta.env.VITE_API_URL || // if your project had this older name
          'http://localhost:5000/api';

        const API_BASE = RAW.replace(/\/+$/, '');
        const url = `${API_BASE}/stats`;
        console.log('[Statistics] fetching:', url);

        const resp = await fetch(url, { headers: { Accept: 'application/json' } });
        if (!resp.ok) throw new Error(`HTTP ${resp.status} for ${url}`);

        const raw = await resp.json();
        const normalized = normalizeStats(raw);

        setStats(normalized);
        setLoading(false);
      } catch (e) {
        console.error('Statistics load error:', e);
        setError(
          'Failed to load statistics JSON. Check VITE_API_BASE (or VITE_API_URL) and that /api/stats returns JSON.'
        );
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div style={{
        background: darkColors.background, minHeight: '100vh',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        color: darkColors.text, fontSize: '1.5rem', fontWeight: 500
      }}>
        Loading asteroid impact statistics...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        background: darkColors.background, minHeight: '100vh',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        color: darkColors.text, fontSize: '1.2rem'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div>Error: {error}</div>
        </div>
      </div>
    );
  }

  if (!stats || Number(stats.totalImpacts) === 0) {
    return (
      <div style={{
        background: darkColors.background, minHeight: '100vh',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        color: darkColors.text, fontSize: '1.2rem'
      }}>
        No asteroid impact data found.
      </div>
    );
  }

  // ---- Charts ----
  const years = Object.keys(stats.impactsOverTime || {}).sort();
  const impactsData = years.map((y) => Number(stats.impactsOverTime[y]));

  const barChartData = {
    labels: years,
    datasets: [{
      label: 'Number of Impacts',
      data: impactsData,
      backgroundColor: darkColors.primaryBlue,
      borderColor: darkColors.primaryBlue,
      borderWidth: 1,
      borderRadius: 4,
      hoverBackgroundColor: darkColors.secondaryBlue
    }]
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'IMPACTS OVER TIME',
        color: darkColors.text,
        font: { size: 18, weight: 'bold' }
      },
      tooltip: {
        backgroundColor: 'rgba(23, 60, 121, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff'
      }
    },
    scales: {
      x: {
        grid: { color: darkColors.grid },
        ticks: { color: darkColors.text, font: { size: 12, weight: 'bold' } }
      },
      y: {
        beginAtZero: true,
        grid: { color: darkColors.grid },
        ticks: { color: darkColors.text, font: { size: 12, weight: 'bold' }, stepSize: 1 }
      }
    },
    animation: { duration: 1500, easing: 'easeOutQuart' }
  };

  const countryEntries = Object.entries(stats.impactsByCountry || {})
    .map(([k, v]) => [k, Number(v)])
    .sort((a, b) => b[1] - a[1]);

  const chartLabels = countryEntries.map(([country]) => country);
  const chartData = countryEntries.map(([, value]) => value);

  const getColorForIndex = (i) => darkColors.chartColors[i % darkColors.chartColors.length];
  const backgroundColors = chartData.map((_, i) => getColorForIndex(i));

  const pieChartData = {
    labels: chartLabels,
    datasets: [{
      data: chartData,
      backgroundColor: backgroundColors,
      borderColor: darkColors.background,
      borderWidth: 2,
      hoverBorderWidth: 3,
      hoverOffset: 8
    }]
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: darkColors.text,
          font: { size: 12, weight: 'bold' },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      title: {
        display: true,
        text: 'IMPACT DISTRIBUTION BY COUNTRY',
        color: darkColors.text,
        font: { size: 16, weight: 'bold' },
        padding: { top: 10, bottom: 20 }
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const label = ctx.label || '';
            const value = Number(ctx.raw);
            const total = ctx.dataset.data.reduce((a, b) => Number(a) + Number(b), 0);
            const percentage = total ? ((value / total) * 100).toFixed(1) : '0.0';
            return `${label}: ${value} impacts (${percentage}%)`;
          }
        },
        backgroundColor: 'rgba(30, 41, 59, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff'
      }
    },
    cutout: '50%',
    animation: { animateScale: true, animateRotate: true, duration: 1500 }
  };

  const totalImpacts = Number(stats.totalImpacts || 0);

  return (
    <div style={{
      background: darkColors.background,
      minHeight: '100vh',
      padding: '30px 20px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      color: darkColors.text,
      boxSizing: 'border-box'
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '40px',
        background: darkColors.cardBg,
        backdropFilter: 'blur(5px)',
        border: `1px solid ${darkColors.border}`,
        padding: '30px',
        borderRadius: '15px',
        boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
      }}>
        <h1 style={{
          fontSize: '2.8rem',
          fontWeight: '700',
          marginBottom: '10px',
          color: darkColors.text,
          textTransform: 'uppercase'
        }}>
          ASTEROID IMPACT ANALYTICS
        </h1>
        <p style={{ fontSize: '1.3rem', color: darkColors.text, fontWeight: 500, opacity: 0.8 }}>
          Exploring Cosmic Impact Data
        </p>
      </div>

      {/* Main Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '30px',
        gridTemplateAreas: '"left right" "bottom bottom"'
      }}>
        {/* Bar Chart */}
        <div style={{
          gridArea: 'left',
          background: darkColors.cardBg,
          backdropFilter: 'blur(5px)',
          border: `1px solid ${darkColors.border}`,
          borderRadius: '15px',
          padding: '30px',
          boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
        }}>
          <div style={{ height: '400px' }}>
            <Bar data={barChartData} options={barChartOptions} />
          </div>
        </div>

        {/* Right column */}
        <div style={{ gridArea: 'right', display: 'flex', flexDirection: 'column', gap: '50px' }}>
          {/* Doughnut */}
          <div style={{
            background: darkColors.cardBg,
            backdropFilter: 'blur(5px)',
            border: `1px solid ${darkColors.border}`,
            borderRadius: '15px',
            padding: '30px',
            boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
            minHeight: '400px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ height: '300px', flex: 1 }}>
              <Doughnut data={pieChartData} options={pieChartOptions} />
            </div>
          </div>

          {/* Total card */}
          <div style={{
            background: darkColors.cardBg,
            backdropFilter: 'blur(5px)',
            border: `1px solid ${darkColors.border}`,
            borderRadius: '15px',
            padding: '25px',
            boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
            textAlign: 'center'
          }}>
            <h3 style={{ color: darkColors.text, marginBottom: '15px', fontSize: '1.4rem' }}>
              TOTAL COSMIC IMPACTS
            </h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 700, color: darkColors.primaryBlue }}>
              {totalImpacts}
            </div>
            <div style={{ color: darkColors.text, opacity: 0.8 }}>
              Aggregated from the API
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AsteroidStats;
