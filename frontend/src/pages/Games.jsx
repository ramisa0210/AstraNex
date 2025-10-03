import React, { useEffect, useRef, useState } from 'react';

const AsteroidDefender = () => {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('menu');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [earthHealth, setEarthHealth] = useState(100);
  const [activePowerUp, setActivePowerUp] = useState(null);
  const [powerUpTimer, setPowerUpTimer] = useState(0);
  const [level, setLevel] = useState(1);
  const [asteroidFact, setAsteroidFact] = useState('');
  const [missedAsteroids, setMissedAsteroids] = useState(0);

  // Image preloading
  const images = useRef({
    earth: null,
    asteroid: null,
    ship: null,
    background: null
  }).current;

  // NASA asteroid facts
  const asteroidFacts = [
    "NASA's DART mission successfully changed an asteroid's orbit in 2022 - the first planetary defense test!",
    "Asteroids are rocky remnants left over from the early formation of our solar system about 4.6 billion years ago.",
    "The largest asteroid in our solar system is Ceres, which is about 590 miles (950 km) in diameter.",
    "NASA tracks near-Earth objects that could potentially impact our planet through the Planetary Defense Coordination Office.",
    "Asteroid Bennu has a 1-in-1,750 chance of impacting Earth between now and the year 2300.",
    "OSIRIS-REx is NASA's first mission to collect a sample from an asteroid and return it to Earth.",
    "Most asteroids orbit the sun in the asteroid belt between Mars and Jupiter.",
    "Asteroids can contain valuable resources like water, metals, and minerals that could be used in future space missions."
  ];

  // Game objects
  const game = useRef({
    ship: { x: 400, y: 450, width: 60, height: 80, speed: 8 },
    bullets: [],
    asteroids: [],
    powerUps: [],
    lastShot: 0,
    shotDelay: 300,
    keys: {},
    animationId: null,
    lastAsteroidSpawn: 0,
    asteroidSpawnDelay: 1000,
    gameTime: 0,
    doubleLaser: false,
    stars: [],
    particles: []
  }).current;

  // Preload images and initialize
  useEffect(() => {
    // Create space background
    const bgCanvas = document.createElement('canvas');
    bgCanvas.width = 800;
    bgCanvas.height = 600;
    const bgCtx = bgCanvas.getContext('2d');
    
    // Create deep space background with stars and nebulae
    const gradient = bgCtx.createLinearGradient(0, 0, 0, 600);
    gradient.addColorStop(0, '#000011');
    gradient.addColorStop(1, '#000022');
    bgCtx.fillStyle = gradient;
    bgCtx.fillRect(0, 0, 800, 600);
    
    // Add stars
    bgCtx.fillStyle = '#ffffff';
    for (let i = 0; i < 300; i++) {
      const x = Math.random() * 800;
      const y = Math.random() * 600;
      const size = Math.random() * 1.5 + 0.5;
      const brightness = Math.random() * 100 + 155;
      bgCtx.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness})`;
      bgCtx.fillRect(x, y, size, size);
    }
    
    // Add some distant galaxies/nebulae
    bgCtx.fillStyle = 'rgba(30, 30, 80, 0.3)';
    bgCtx.beginPath();
    bgCtx.arc(150, 100, 60, 0, Math.PI * 2);
    bgCtx.fill();
    
    bgCtx.fillStyle = 'rgba(80, 30, 80, 0.2)';
    bgCtx.beginPath();
    bgCtx.arc(650, 150, 80, 0, Math.PI * 2);
    bgCtx.fill();
    
    images.background = bgCanvas;

    // Create Earth image (fallback)
    const earthImg = new Image();
    earthImg.onload = () => images.earth = earthImg;
    earthImg.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYwIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDE2MCAxNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNjAiIGhlaWdodD0iMTYwIiBmaWxsPSIjMGExYTM0Ii8+CjxjaXJjbGUgY3g9IjgwIiBjeT0iODAiIHI9Ijc1IiBmaWxsPSIjMWE1ZmI0Ii8+CjxwYXRoIGQ9Ik00MCA1MEM2MCAzMCAxMDAgMzAgMTIwIDUwQzEwMCA3MCA2MCA3MCA0MCA1MFoiIGZpbGw9IiMyZGE0NTYiLz4KPHBhdGggZD0iTTYwIDQwQzgwIDIwIDEwMCA0MCA5MCA4MEM4MCAxMDAgNjAgOTAgNjAgODBDNjAgNjAgNDAgNjAgNjAgNDBaIiBmaWxsPSIjMWVhMzc1Ii8+Cjwvc3ZnPgo=';

    // Create Asteroid image (fallback)
    const asteroidImg = new Image();
    asteroidImg.onload = () => images.asteroid = asteroidImg;
    asteroidImg.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAiIGhlaWdodD0iNzAiIHZpZXdCb3g9IjAgMCA3MCA3MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzUiIGN5PSIzNSIgcj0iMzUiIGZpbGw9IiM1NTU1NTUiLz4KPGNpcmNsZSBjeD0iMjUiIGN5PSIyNSIgcj0iOCIgZmlsbD0iIzMzMzMzMyIvPgo8Y2lyY2xlIGN4PSI0NSIgY3k9IjIwIiByPSI2IiBmaWxsPSIjNDQ0NDQ0Ii8+CjxjaXJjbGUgY3g9IjE1IiBjeT0iNDAiIHI9IjUiIGZpbGw9IiMyMjIyMjIiLz4KPGNpcmNsZSBjeD0iNTAiIGN5PSI0NSIgcj0iNyIgZmlsbD0iIzMzMzMzMyIvPgo8L3N2Zz4K';

    // Create ship image
    const shipCanvas = document.createElement('canvas');
    shipCanvas.width = 60;
    shipCanvas.height = 80;
    const shipCtx = shipCanvas.getContext('2d');
    
    // NASA satellite design
    shipCtx.fillStyle = '#ffffff';
    shipCtx.fillRect(25, 0, 10, 50); // Main body
    shipCtx.fillRect(15, 15, 30, 5); // Solar panel left
    shipCtx.fillRect(15, 25, 30, 5); // Solar panel right
    shipCtx.fillStyle = '#ff4444';
    shipCtx.fillRect(20, 50, 20, 10); // Thruster
    shipCtx.fillStyle = '#00ffff';
    shipCtx.fillRect(28, 0, 4, 10); // Laser emitter
    
    images.ship = shipCanvas;

    // Initialize stars for animation
    for (let i = 0; i < 150; i++) {
      game.stars.push({
        x: Math.random() * 800,
        y: Math.random() * 600,
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 2 + 0.5,
        brightness: Math.random() * 100 + 155
      });
    }

    // Initialize high score
    const savedHighScore = localStorage.getItem('asteroidDefenderHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
    setAsteroidFact(asteroidFacts[Math.floor(Math.random() * asteroidFacts.length)]);
  }, []);

  const drawAnimatedBackground = (ctx) => {
    if (images.background) {
      ctx.drawImage(images.background, 0, 0);
    }
    
    // Animate stars
    ctx.fillStyle = '#ffffff';
    game.stars.forEach(star => {
      star.y += star.speed;
      if (star.y > 600) {
        star.y = 0;
        star.x = Math.random() * 800;
      }
      ctx.fillStyle = `rgb(${star.brightness}, ${star.brightness}, ${star.brightness})`;
      ctx.fillRect(star.x, star.y, star.size, star.size);
    });
    
    // Draw moving asteroids in background for theme
    ctx.fillStyle = 'rgba(100, 100, 100, 0.3)';
    for (let i = 0; i < 5; i++) {
      const x = (Date.now() * 0.02 + i * 100) % 900 - 50;
      const y = 100 + i * 80;
      ctx.beginPath();
      ctx.arc(x, y, 20 + i * 5, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const gameLoop = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Clear canvas with animated background
    drawAnimatedBackground(ctx);
    
    game.gameTime += 16;
    
    if (gameState === 'playing') {
      updateGame();
      checkCollisions();
      checkLevelProgression();
    }
    
    drawGameElements(ctx);
    game.animationId = requestAnimationFrame(gameLoop);
  };

  const updateGame = () => {
    // Move ship
    if (game.keys.ArrowLeft && game.ship.x > 20) {
      game.ship.x -= game.ship.speed;
    }
    if (game.keys.ArrowRight && game.ship.x < 720) {
      game.ship.x += game.ship.speed;
    }
    
    // Shooting
    if (game.keys.Space && game.gameTime - game.lastShot > game.shotDelay) {
      shoot();
      game.lastShot = game.gameTime;
    }
    
    // Update bullets
    game.bullets = game.bullets.filter(bullet => {
      bullet.y -= 15;
      return bullet.y > 0;
    });
    
    // Spawn asteroids
    if (game.gameTime - game.lastAsteroidSpawn > game.asteroidSpawnDelay) {
      spawnAsteroid();
      game.lastAsteroidSpawn = game.gameTime;
    }
    
    // Update asteroids
    game.asteroids.forEach(asteroid => {
      asteroid.y += asteroid.speed;
      asteroid.rotation += asteroid.rotationSpeed;
    });
    
    game.asteroids = game.asteroids.filter(asteroid => {
      if (asteroid.y > 600) {
        setMissedAsteroids(prev => prev + 1);
        // Score for asteroids that miss Earth completely
        if (asteroid.x < 300 || asteroid.x > 500) {
          setScore(prev => prev + 2);
        }
        return false;
      }
      return true;
    });
    
    // Update power-ups
    game.powerUps.forEach(powerUp => powerUp.y += 3);
    game.powerUps = game.powerUps.filter(powerUp => powerUp.y < 600);
    
    // Power-up timer
    if (activePowerUp && game.gameTime > powerUpTimer) {
      setActivePowerUp(null);
      game.doubleLaser = false;
    }
    
    if (earthHealth <= 0) {
      endGame();
    }
  };

  const checkCollisions = () => {
    // Bullet vs Asteroid
    for (let i = game.bullets.length - 1; i >= 0; i--) {
      for (let j = game.asteroids.length - 1; j >= 0; j--) {
        const dx = game.bullets[i].x - game.asteroids[j].x;
        const dy = game.bullets[i].y - game.asteroids[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < game.asteroids[j].radius + 3) {
          game.bullets.splice(i, 1);
          const points = game.asteroids[j].size === 'large' ? 5 : 3;
          setScore(prev => prev + points);
          game.asteroids.splice(j, 1);
          break;
        }
      }
    }
    
    // Asteroid vs Earth collision
    for (let i = game.asteroids.length - 1; i >= 0; i--) {
      const asteroid = game.asteroids[i];
      const earthCenterX = 400;
      const earthCenterY = 650;
      const earthRadius = 70;
      
      const dx = asteroid.x - earthCenterX;
      const dy = asteroid.y - earthCenterY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < asteroid.radius + earthRadius) {
        game.asteroids.splice(i, 1);
        setEarthHealth(prev => Math.max(0, prev - 15));
        if (earthHealth <= 15) {
          endGame();
        }
      }
    }
    
    // Ship vs Asteroid
    for (let i = game.asteroids.length - 1; i >= 0; i--) {
      const asteroid = game.asteroids[i];
      const dx = game.ship.x + 30 - asteroid.x;
      const dy = game.ship.y + 40 - asteroid.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < asteroid.radius + 30) {
        if (activePowerUp === 'shield') {
          game.asteroids.splice(i, 1);
        } else {
          endGame();
        }
      }
    }
  };

  const checkLevelProgression = () => {
    const newLevel = Math.floor(game.gameTime / 15000) + 1;
    if (newLevel > level) {
      setLevel(newLevel);
      game.asteroidSpawnDelay = Math.max(300, 1000 - (newLevel * 100));
    }
  };

  const drawGameElements = (ctx) => {
    // Draw Earth at bottom
    if (images.earth) {
      ctx.drawImage(images.earth, 320, 550, 160, 160);
    } else {
      ctx.fillStyle = '#1a5fb4';
      ctx.beginPath();
      ctx.arc(400, 630, 70, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Draw Earth health bar
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(300, 520, 200, 20);
    ctx.fillStyle = earthHealth > 50 ? '#00ff88' : earthHealth > 20 ? '#ffaa00' : '#ff4444';
    ctx.fillRect(300, 520, (earthHealth / 100) * 200, 20);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(300, 520, 200, 20);
    
    // Draw ship
    if (images.ship) {
      ctx.drawImage(images.ship, game.ship.x, game.ship.y);
    }
    
    // Draw bullets as lasers
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 2;
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00ffff';
    game.bullets.forEach(bullet => {
      ctx.beginPath();
      ctx.moveTo(bullet.x, bullet.y);
      ctx.lineTo(bullet.x, bullet.y - 15);
      ctx.stroke();
    });
    ctx.shadowBlur = 0;
    
    // Draw asteroids
    game.asteroids.forEach(asteroid => {
      ctx.save();
      ctx.translate(asteroid.x, asteroid.y);
      ctx.rotate(asteroid.rotation);
      
      if (images.asteroid) {
        ctx.drawImage(images.asteroid, -asteroid.radius, -asteroid.radius, asteroid.radius * 2, asteroid.radius * 2);
      } else {
        ctx.fillStyle = '#888888';
        ctx.beginPath();
        ctx.arc(0, 0, asteroid.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });
    
    // Draw UI overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(10, 10, 180, 120);
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 1;
    ctx.strokeRect(10, 10, 180, 120);
    
    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.fillText(`SCORE: ${score}`, 20, 30);
    ctx.fillText(`HIGH SCORE: ${highScore}`, 20, 55);
    ctx.fillText(`LEVEL: ${level}`, 20, 80);
    ctx.fillText(`MISSED: ${missedAsteroids}`, 20, 105);
    ctx.fillText(`EARTH HEALTH: ${earthHealth}%`, 20, 130);
    
    if (gameState === 'menu') {
      drawMenuScreen(ctx);
    } else if (gameState === 'gameOver') {
      drawGameOverScreen(ctx);
    }
  };

  const drawMenuScreen = (ctx) => {
    ctx.fillStyle = 'rgba(0, 0, 30, 0.9)';
    ctx.fillRect(150, 150, 500, 300);
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 3;
    ctx.strokeRect(150, 150, 500, 300);
    
    ctx.font = 'bold 32px Arial';
    ctx.fillStyle = '#00ffff';
    ctx.textAlign = 'center';
    ctx.fillText('ASTEROID DEFENDER', 400, 190);
    
    ctx.font = '18px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('NASA Planetary Defense Simulation', 400, 220);
    
    ctx.font = '16px Arial';
    ctx.fillStyle = '#ffaa00';
    ctx.fillText('Click START MISSION or Press SPACE to Begin', 400, 260);
    
    ctx.font = '14px Arial';
    ctx.fillStyle = '#88ff88';
    ctx.fillText('← → Arrow Keys: Move Satellite', 400, 290);
    ctx.fillText('Spacebar: Fire Lasers • R: Restart', 400, 310);
    
    // Start button
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(350, 330, 100, 40);
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('START MISSION', 400, 355);
  };

  const drawGameOverScreen = (ctx) => {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillRect(0, 0, 800, 600);
    
    ctx.font = 'bold 36px Arial';
    ctx.fillStyle = '#ff4444';
    ctx.textAlign = 'center';
    ctx.fillText('MISSION FAILED', 400, 150);
    
    ctx.font = '24px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`Final Score: ${score}`, 400, 200);
    ctx.fillText(`High Score: ${highScore}`, 400, 230);
    
    ctx.font = '18px Arial';
    ctx.fillStyle = '#ffaa00';
    ctx.fillText('Press R to Restart Mission', 400, 280);
  };

  const shoot = () => {
    if (game.doubleLaser) {
      game.bullets.push({ x: game.ship.x + 15, y: game.ship.y });
      game.bullets.push({ x: game.ship.x + 45, y: game.ship.y });
    } else {
      game.bullets.push({ x: game.ship.x + 30, y: game.ship.y });
    }
  };

  const spawnAsteroid = () => {
    const size = Math.random() < 0.3 ? 'large' : 'small';
    const radius = size === 'large' ? 30 : 18;
    const speed = size === 'large' ? 1.5 + (level * 0.2) : 2.5 + (level * 0.3);
    
    game.asteroids.push({
      x: Math.random() * (800 - radius * 2) + radius,
      y: -radius,
      radius,
      speed,
      size,
      rotation: 0,
      rotationSpeed: (Math.random() - 0.5) * 0.1
    });
  };

  const startGame = () => {
    resetGame();
    setGameState('playing');
  };

  const endGame = () => {
    setGameState('gameOver');
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('asteroidDefenderHighScore', score.toString());
    }
  };

  const resetGame = () => {
    game.ship.x = 400;
    game.bullets = [];
    game.asteroids = [];
    game.powerUps = [];
    game.lastShot = 0;
    game.lastAsteroidSpawn = 0;
    game.gameTime = 0;
    game.doubleLaser = false;
    game.asteroidSpawnDelay = 1000;
    
    setScore(0);
    setEarthHealth(100);
    setActivePowerUp(null);
    setPowerUpTimer(0);
    setLevel(1);
    setMissedAsteroids(0);
  };

  // Event handlers
  useEffect(() => {
    const handleKeyDown = (e) => {
      game.keys[e.code] = true;
      
      if (e.code === 'Space' && gameState === 'menu') {
        startGame();
      }
      
      if (e.code === 'KeyR' && gameState === 'gameOver') {
        startGame();
      }
    };

    const handleKeyUp = (e) => {
      game.keys[e.code] = false;
    };

    const handleClick = (e) => {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      if (gameState === 'menu' && x >= 350 && x <= 450 && y >= 330 && y <= 370) {
        startGame();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    canvasRef.current?.addEventListener('click', handleClick);

    game.animationId = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      canvasRef.current?.removeEventListener('click', handleClick);
      if (game.animationId) {
        cancelAnimationFrame(game.animationId);
      }
    };
  }, [gameState]);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      background: '#000000',
      minHeight: '100vh',
      padding: '0',
      margin: '0',
      overflow: 'hidden',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Game Header */}
      <div style={{
        background: 'linear-gradient(135deg, #001122 0%, #003366 100%)',
        padding: '15px 30px',
        width: '100%',
        textAlign: 'center',
        borderBottom: '3px solid #00ffff',
        boxShadow: '0 0 20px rgba(0, 255, 255, 0.5)'
      }}>
        <h1 style={{ 
          margin: '0', 
          color: '#00ffff', 
          fontSize: '2.8em',
          textShadow: '0 0 15px #00ffff, 0 0 25px #00ffff'
        }}>
           NASA ASTEROID DEFENDER
        </h1>
        <p style={{ 
          margin: '5px 0 0 0', 
          color: '#ffffff', 
          fontSize: '1.1em',
          fontWeight: 'bold'
        }}>
          Planetary Defense Mission Simulation
        </p>
      </div>

      {/* Game Canvas */}
      <div style={{ position: 'relative', margin: '20px 0' }}>
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          style={{ 
            border: '3px solid #00ffff',
            borderRadius: '10px',
            boxShadow: '0 0 40px rgba(0, 255, 255, 0.6)',
            background: 'transparent'
          }}
        />
      </div>

      {/* Instructions Sidebar */}
      <div style={{
        background: 'rgba(0, 20, 40, 0.9)',
        padding: '20px',
        borderRadius: '10px',
        margin: '0 20px',
        border: '2px solid #00ffff',
        maxWidth: '800px',
        textAlign: 'center'
      }}>
        <h3 style={{ color: '#00ffff', margin: '0 0 15px 0', fontSize: '1.4em' }}>
          🎯 Mission Objectives
        </h3>
        <div style={{ 
          color: '#ffffff', 
          lineHeight: '1.6',
          fontSize: '14px',
          textAlign: 'left',
          display: 'inline-block'
        }}>
          <p>• Destroy incoming asteroids before they hit Earth</p>
          <p>• Asteroids that miss Earth and land on ground: <span style={{color: '#88ff88'}}>+2 points</span></p>
          <p>• Asteroids hitting Earth: <span style={{color: '#ff4444'}}>-15% health</span></p>
          <p>• Protect Earth's health - survive as long as possible!</p>
          <p>• <span style={{color: '#ffaa00'}}>Press SPACE to start</span> • Use arrow keys to move</p>
        </div>
      </div>

     
    </div>
  );
};

export default AsteroidDefender;