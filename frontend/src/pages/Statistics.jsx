// src/pages/Statistics.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function Statistics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // ======= THEME (image-like look) =======
  const T = {
    bg: "#0a0f1d",
    hero: "linear-gradient(135deg, #0f1e3a 0%, #0b162b 100%)",
    cardBg: "rgba(16, 24, 40, 0.7)",
    border: "rgba(90, 120, 180, .25)",
    text: "#e9f0ff",
    subtext: "rgba(233,240,255,.8)",
    accent: "#3ba9ff",
    barFrom: "#2C7FB8",
    barTo: "#4F98C3",
    donut: ["#1b3a73","#2b6bb0","#3fa0d9","#63c4ec","#8fdcff","#165a72","#6a56a5","#8a76c3","#2b8ddd","#5bc0de"],
    shadow: "0 10px 30px rgba(0,0,0,.35)",
    radius: 18,
  };

  // ======= HELPERS =======
  const buildApiBase = () => {
    const raw =
      import.meta.env.VITE_API_BASE ||
      import.meta.env.VITE_API_URL ||
      "http://localhost:5000/api";
    return raw.replace(/\/+$/, "");
  };

  const normalize = (raw) => {
    if (!raw) return null;
    // DB-style
    if (raw.impactsOverTime || raw.impactsByCountry || raw.totalImpacts != null) {
      return {
        total: Number(raw.totalImpacts ?? 0),
        byYear: raw.impactsOverTime || {},
        byCountry: raw.impactsByCountry || {},
      };
    }
    // NASA-style minimal
    const total = Number(raw.totalAsteroidsTracked ?? raw.nearEarthThisMonth ?? 0);
    const label = raw.range ? `${raw.range.start}–${raw.range.end}` : "last-7-days";
    return { total, byYear: { [label]: total }, byCountry: {} };
  };

  // STATIC 10-YR fallback (last 10 years, image-like proportions)
  const staticTenYears = useMemo(() => {
    // Base dataset for 2016–2025 (sum=56) — if current year > 2025, we slide the map
    const baseYears = {
      2016: 5, 2017: 7, 2018: 6, 2019: 8, 2020: 7,
      2021: 5, 2022: 6, 2023: 4, 2024: 5, 2025: 3,
    };
    const now = new Date().getUTCFullYear();
    let start = now - 9; // last 10 years (inclusive)
    let map = {};

    // If our base window (2016–2025) matches, use it; otherwise remap proportionally
    if (start === 2016) {
      map = baseYears;
    } else {
      const baseKeys = Object.keys(baseYears).map(Number);
      const baseMin = Math.min(...baseKeys);
      // shift years keeping counts
      for (let i = 0; i < 10; i++) {
        const year = start + i;
        const from = baseMin + i;
        map[year] = baseYears[from] ?? 5; // default 5 if out of range
      }
    }

    const byCountry = { USA: 9, Russia: 8, Australia: 8, India: 8, China: 8, Brazil: 6, Japan: 6, Canada: 5, Peru: 4 };
    const total = Object.values(map).reduce((a, b) => a + Number(b), 0);
    return { total, byYear: map, byCountry };
  }, []);

  // ======= DATA FETCH (with safe fallback) =======
  useEffect(() => {
    (async () => {
      try {
        const base = buildApiBase();
        const url = `${base}/stats`;
        const r = await fetch(url, { headers: { Accept: "application/json" } });
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const raw = await r.json();
        const n = normalize(raw);

        // Keep only last 10 years if series is yearly (keys numeric)
        const numericYears = Object.keys(n.byYear || {}).map((k) => Number(k)).filter((n) => Number.isFinite(n));
        if (numericYears.length >= 10) {
          const now = new Date().getUTCFullYear();
          const start = now - 9;
          const filtered = {};
          for (let y = start; y <= now; y++) filtered[y] = Number(n.byYear[y] ?? 0);
          const total = Object.values(filtered).reduce((a, b) => a + b, 0);
          setStats({ total, byYear: filtered, byCountry: n.byCountry || {} });
        } else {
          // if not yearly, fallback to static 10-year window
          setStats(staticTenYears);
        }
      } catch (e) {
        console.warn("[Statistics] API failed, using static 10-year data:", e);
        setStats(staticTenYears);
      } finally {
        setLoading(false);
      }
    })();
  }, [staticTenYears]);

  // ======= CHART GRADIENT (pretty bars) =======
  const barRef = useRef(null);
  const barGradient = (ctx) => {
    const chart = ctx.chart;
    const { ctx: c, chartArea } = chart;
    if (!chartArea) return T.barFrom; // initial pass
    const g = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
    g.addColorStop(0, T.barTo);
    g.addColorStop(1, T.barFrom);
    return g;
  };

  if (loading) {
    return (
      <div style={styles.page(T)}>
        <div style={styles.hero(T)}>
          <h1 style={styles.h1(T)}>ASTEROID IMPACT ANALYTICS</h1>
          <p style={styles.sub(T)}>Fetching 10-year statistics…</p>
        </div>
        <div style={{ ...styles.card(T), textAlign: "center" }}>
          <p>Loading…</p>
        </div>
      </div>
    );
  }

  const years = Object.keys(stats.byYear || {}).map(Number).sort((a, b) => a - b);
  const barValues = years.map((y) => Number(stats.byYear[y]));

  const barData = {
    labels: years,
    datasets: [
      {
        label: "Impacts",
        data: barValues,
        backgroundColor: barGradient,
        borderRadius: 8,
        hoverBackgroundColor: T.barTo,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: `IMPACTS OVER TIME (${years[0]}–${years[years.length - 1]})`,
        color: T.text,
        font: { size: 16, weight: "bold" },
        padding: { top: 0, bottom: 12 },
      },
      tooltip: {
        backgroundColor: "rgba(12,24,48,.9)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "rgba(255,255,255,.2)",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: { color: "rgba(255,255,255,.08)" },
        ticks: { color: T.subtext, font: { size: 12, weight: "600" } },
      },
      y: {
        beginAtZero: true,
        grid: { color: "rgba(255,255,255,.08)" },
        ticks: { color: T.subtext, font: { size: 12, weight: "600" }, stepSize: 1 },
      },
    },
    animation: { duration: 900, easing: "easeOutQuart" },
  };

  // Pie: country distribution (fallback if empty)
  const countryPairs = Object.entries(stats.byCountry || {});
  const pieLabels = countryPairs.length ? countryPairs.map(([k]) => k) : ["Other"];
  const pieValues = countryPairs.length ? countryPairs.map(([, v]) => Number(v)) : [stats.total];
  const pieColors = pieValues.map((_, i) => T.donut[i % T.donut.length]);

  const pieData = {
    labels: pieLabels,
    datasets: [
      {
        data: pieValues,
        backgroundColor: pieColors,
        borderColor: T.bg,
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          color: T.text,
          usePointStyle: true,
          pointStyle: "circle",
          font: { size: 12, weight: "bold" },
          padding: 16,
        },
      },
      title: {
        display: true,
        text: "IMPACT DISTRIBUTION BY COUNTRY",
        color: T.text,
        font: { size: 16, weight: "bold" },
        padding: { top: 0, bottom: 12 },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const label = ctx.label || "";
            const value = Number(ctx.raw);
            const total = ctx.dataset.data.reduce((a, b) => Number(a) + Number(b), 0);
            const pct = total ? ((value / total) * 100).toFixed(1) : "0.0";
            return `${label}: ${value} (${pct}%)`;
          },
        },
        backgroundColor: "rgba(12,24,48,.9)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "rgba(255,255,255,.2)",
        borderWidth: 1,
      },
    },
    cutout: "55%",
    animation: { duration: 900 },
  };

  const total = Number(stats.total || 0);

  return (
    <div style={styles.page(T)}>
      {/* HERO */}
      <div style={styles.hero(T)}>
        <h1 style={styles.h1(T)}>ASTEROID IMPACT ANALYTICS</h1>
        <p style={styles.sub(T)}>Exploring Cosmic Impact Data (last 10 years)</p>
      </div>

      {/* GRID */}
      <div style={styles.grid}>
        <div style={styles.leftCol}>
          <div style={styles.card(T)}>
            <div ref={barRef} style={{ height: 420 }}>
              <Bar data={barData} options={barOptions} />
            </div>
          </div>
        </div>

        <div style={styles.rightCol}>
          <div style={styles.card(T)}>
            <div style={{ height: 320 }}>
              <Doughnut data={pieData} options={pieOptions} />
            </div>
          </div>

          <div style={{ ...styles.card(T), textAlign: "center" }}>
            <h3 style={{ margin: 0, marginBottom: 8, letterSpacing: ".4px" }}>TOTAL COSMIC IMPACTS</h3>
            <div style={{ fontSize: "2.8rem", fontWeight: 800, color: T.accent, lineHeight: 1 }}>{total}</div>
            <div style={{ color: T.subtext, marginTop: 6 }}>Aggregated over the last 10 years</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================== STYLES ================== */
const styles = {
  page: (T) => ({
    minHeight: "100vh",
    background: T.bg,
    color: T.text,
    padding: "22px",
    fontFamily:
      "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji'",
  }),
  hero: (T) => ({
    background: T.hero,
    borderRadius: T.radius,
    border: `1px solid ${T.border}`,
    boxShadow: T.shadow,
    padding: "28px 24px",
    textAlign: "center",
    marginBottom: 22,
  }),
  h1: (T) => ({
    margin: 0,
    fontSize: "2.6rem",
    letterSpacing: ".5px",
    textTransform: "uppercase",
  }),
  sub: (T) => ({
    margin: "8px 0 0",
    color: T.subtext,
    fontWeight: 500,
  }),
  grid: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: 22,
  },
  leftCol: {},
  rightCol: { display: "flex", flexDirection: "column", gap: 22 },
  card: (T) => ({
    background: T.cardBg,
    backdropFilter: "blur(6px)",
    border: `1px solid ${T.border}`,
    borderRadius: T.radius,
    padding: 18,
    boxShadow: T.shadow,
  }),
};
