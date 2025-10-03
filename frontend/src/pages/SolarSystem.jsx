import React from 'react';

function SolarSystem() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100vh',
      padding: '20px',
      boxSizing: 'border-box',
      backgroundColor: '#000',
      color: '#fff'
    }}>
      <h1 style={{ textAlign: 'center' }}>NASA's Eyes on Asteroids</h1>
      <p style={{ textAlign: 'center' }}>Explore the solar system's asteroids and comets in real-time.</p>
      <iframe
        src="https://eyes.nasa.gov/apps/asteroids/#/home"
        title="NASA Eyes on Asteroids"
        allowFullScreen
        style={{
          width: '100%',
          height: '80vh',
          border: 'none'
        }}
      ></iframe>
    </div>
  );
}

export default SolarSystem;