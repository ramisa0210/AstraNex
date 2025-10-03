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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const statsUrl = import.meta.env.MODE === 'production'
                    ? '/api/stats'
                    : 'http://localhost:5000/api/stats';
                
                console.log('Fetching from:', statsUrl);
                
                const response = await fetch(statsUrl);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                console.log('Received data:', data);
                
                setStats(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Define the dark theme colors with a new, distinct chart palette
    const darkColors = {
    background: '#000000', // Pure black background
    cardBg: 'rgba(17, 24, 39, 0.7)', // Slightly transparent dark blue for cards
    border: 'rgba(55, 65, 81, 0.5)', // Subtle border
    text: '#f0f0f0', // Light grey text
    grid: 'rgba(255, 255, 255, 0.1)', // Light grid lines
    primaryBlue: '#2C7FB8', // A clear blue
    secondaryBlue: '#4F98C3', // Lighter Blue
    accentGreen: '#50C878', // A vibrant sea green
    accentPurple: '#B19CD9', // Light purple
    chartColors: [
        '#042b69ff',   // Very dark navy blue (like the USA color)
        '#4d99beff',   // Light sky blue
        '#6182beff',   // Dark green
        '#77c9ddff',   // A muted pink/red
        '#3baaebff',   // Very light blue
        '#0D526D',   // Dark cyan/blue
        '#644899ff',   // A clear purple
        '#7b6aacff',   // Orange
        '#268bddff'    // Steel Blue
    ] // New custom palette with shades of blue, green, and other distinct colors
};

    if (loading) {
        return (
            <div style={{
                background: darkColors.background,
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: darkColors.text,
                fontSize: '1.5rem',
                fontWeight: '500'
            }}>
                Loading asteroid impact statistics...
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                background: darkColors.background,
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: darkColors.text,
                fontSize: '1.2rem'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div>Error: {error}</div>
                    <div style={{ fontSize: '1rem', marginTop: '10px' }}>
                        Please make sure backend server is running on port 5000
                    </div>
                </div>
            </div>
        );
    }

    if (!stats || Object.keys(stats).length === 0 || stats.totalImpacts === 0) {
        return (
            <div style={{
                background: darkColors.background,
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: darkColors.text,
                fontSize: '1.2rem'
            }}>
                No asteroid impact data found. Please seed the database.
            </div>
        );
    }

    // Prepare data for Bar Chart (Impacts Over Time)
    const years = Object.keys(stats.impactsOverTime || {}).sort();
    const impactsData = years.map(year => stats.impactsOverTime[year]);

    const barChartData = {
        labels: years,
        datasets: [{
            label: 'Number of Impacts',
            data: impactsData,
            backgroundColor: darkColors.primaryBlue,
            borderColor: darkColors.primaryBlue,
            borderWidth: 1,
            borderRadius: 4,
            hoverBackgroundColor: darkColors.secondaryBlue,
        }],
    };

    const barChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: 'IMPACTS OVER TIME (2015-2025)',
                color: darkColors.text,
                font: {
                    size: 18,
                    weight: 'bold'
                }
            },
            tooltip: {
                backgroundColor: 'rgba(23, 60, 121, 0.9)',
                titleColor: '#fff',
                bodyColor: '#fff'
            }
        },
        scales: {
            x: {
                grid: {
                    color: darkColors.grid,
                },
                ticks: {
                    color: darkColors.text,
                    font: {
                        size: 12,
                        weight: 'bold'
                    }
                }
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: darkColors.grid,
                },
                ticks: {
                    color: darkColors.text,
                    font: {
                        size: 12,
                        weight: 'bold'
                    },
                    stepSize: 1
                }
            }
        },
        animation: {
            duration: 1500,
            easing: 'easeOutQuart'
        }
    };

    // Prepare data for Doughnut Chart (Impacts by Country)
    const countryData = Object.entries(stats.impactsByCountry || {});
    
    countryData.sort((a, b) => b[1] - a[1]);
    
    const chartLabels = countryData.map(item => item[0]);
    const chartData = countryData.map(item => item[1]);

    const getColorForIndex = (index) => {
        return darkColors.chartColors[index % darkColors.chartColors.length];
    };

    const backgroundColors = chartData.map((_, index) => getColorForIndex(index));

    const pieChartData = {
        labels: chartLabels,
        datasets: [{
            data: chartData,
            backgroundColor: backgroundColors,
            borderColor: darkColors.background,
            borderWidth: 2,
            hoverBorderWidth: 3,
            hoverOffset: 8,
        }],
    };

    const pieChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    color: darkColors.text,
                    font: {
                        size: 12,
                        weight: 'bold'
                    },
                    padding: 20,
                    usePointStyle: true,
                    pointStyle: 'circle'
                }
            },
            title: {
                display: true,
                text: 'IMPACT DISTRIBUTION BY COUNTRY',
                color: darkColors.text,
                font: {
                    size: 16,
                    weight: 'bold'
                },
                padding: {
                    top: 10,
                    bottom: 20
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const label = context.label || '';
                        const value = context.raw;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${label}: ${value} impacts (${percentage}%)`;
                    }
                },
                backgroundColor: 'rgba(30, 41, 59, 0.9)',
                titleColor: '#fff',
                bodyColor: '#fff'
            }
        },
        cutout: '50%',
        animation: {
            animateScale: true,
            animateRotate: true,
            duration: 1500
        }
    };

    // Calculate percentages for info boxes
    const totalImpacts = chartData.reduce((a, b) => a + b, 0);
    const countryPercentages = chartData.map((value, index) => ({
        country: chartLabels[index],
        percentage: ((value / totalImpacts) * 100).toFixed(1),
        value: value,
        color: backgroundColors[index]
    }));

    return (
        <div style={{
            background: darkColors.background,
            minHeight: '100vh',
            padding: '30px 20px',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            color: darkColors.text,
            boxSizing: 'border-box'
        }}>
            {/* Header Section */}
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
                <p style={{
                    fontSize: '1.3rem',
                    color: darkColors.text,
                    fontWeight: '500',
                    opacity: '0.8'
                }}>
                    Exploring Cosmic Impact Data from 2015 to 2025
                </p>
            </div>

            {/* Main Content Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr',
                gap: '30px',
                gridTemplateAreas: '"left right" "bottom bottom"',
                '@media (maxWidth: 1024px)': {
                    gridTemplateColumns: '1fr',
                    gridTemplateAreas: '"left" "right" "bottom"'
                }
            }}>
                {/* Left Section (Bar Chart) */}
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

                {/* Right Section (Doughnut Chart and Info Boxes) */}
                <div style={{
                    gridArea: 'right',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '50px'
                }}>
                    {/* Doughnut Chart Card - Increased size */}
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
                        <div style={{ 
                            height: '300px',
                            flex: '1'
                        }}>
                            <Doughnut data={pieChartData} options={pieChartOptions} />
                        </div>
                    </div>

                    {/* Total Impacts Info Card */}
                    <div style={{
                        background: darkColors.cardBg,
                        backdropFilter: 'blur(5px)',
                        border: `1px solid ${darkColors.border}`,
                        borderRadius: '15px',
                        padding: '25px',
                        boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
                        textAlign: 'center'
                    }}>
                        <h3 style={{
                            color: darkColors.text,
                            marginBottom: '15px',
                            fontSize: '1.4rem'
                        }}>
                            TOTAL COSMIC IMPACTS
                        </h3>
                        <div style={{
                            fontSize: '2.5rem',
                            fontWeight: '700',
                            color: darkColors.primaryBlue
                        }}>
                            {totalImpacts}
                        </div>
                        <div style={{ color: darkColors.text, opacity: '0.8' }}>
                            Impacts Recorded (2015-2025)
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AsteroidStats;