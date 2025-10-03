import React, { useState, useEffect } from 'react';

const DiscoverAsteroids = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAsteroid, setSelectedAsteroid] = useState(null);
  
  // Sample asteroid data with high-resolution images using the ashX.jpg format
  const asteroids = [
    { 
      id: 1, 
      name: "Vesta", 
      image: "/asteroid/vesta.png",
      diameter: "525 km",
      description: "Vesta is one of the largest asteroids in the Solar System, discovered by Heinrich Wilhelm Olbers on March 29, 1807.",
      discovery: "Discovered in 1807",
      composition: "Rocky surface with basaltic features"
    },
    { 
      id: 2, 
      name: "Psyche", 
      image: "/asteroid/phyche.png",
      diameter: "226 km",
      description: "Psyche is a large M-type asteroid believed to be the exposed iron core of a protoplanet.",
      discovery: "Discovered in 1852",
      composition: "Metallic (iron-nickel)"
    },
    { 
      id: 3, 
      name: "Bennu", 
      image: "/asteroid/bennu.png",
      diameter: "0.49 km",
      description: "Bennu is a carbonaceous asteroid and the target of NASA's OSIRIS-REx mission which collected samples from its surface.",
      discovery: "Discovered in 1999",
      composition: "Carbon-rich material"
    },
    { 
      id: 4, 
      name: "Eros", 
      image: "/asteroid/eros.png",
      diameter: "16.84 km",
      description: "433 Eros was the first asteroid to be orbited by a spacecraft (NEAR Shoemaker) and the first to have a spacecraft land on it.",
      discovery: "Discovered in 1898",
      composition: "Stony (S-type) asteroid"
    },
    { 
      id: 5, 
      name: "Ida and Dactyl", 
      image: "/asteroid/ida.png",
      diameter: "32 km",
      description: "Ida is a Koronis family asteroid that has a small moon named Dactyl, making it the first asteroid discovered to have a natural satellite.",
      discovery: "Discovered in 1884",
      composition: "Stony (S-type) asteroid with a moon"
    },
    { 
      id: 6, 
      name: "7 Iris", 
      image: "/asteroid/iris.png",
      diameter: "200 km",
      description: "7 Iris is a large main-belt asteroid and one of the brightest asteroids in the night sky.",
      discovery: "Discovered in 1847",
      composition: "Stony (S-type) asteroid"
    },
    { 
      id: 7, 
      name: "433 Eros", 
      image: "/asteroid/433.png",
      diameter: "16.84 km",
      description: "433 Eros was the first asteroid to be orbited by a spacecraft (NEAR Shoemaker) and the first to have a spacecraft land on it.",
      discovery: "Discovered in 1898",
      composition: "Stony (S-type) asteroid"
    },
    { 
      id: 8, 
      name: "1036 Ganymed", 
      image: "/asteroid/gany.png",
      diameter: "35 km",
      description: "1036 Ganymed is the largest near-Earth asteroid, approximately 35 kilometers in diameter.",
      discovery: "Discovered in 1924",
      composition: "Stony (S-type) asteroid"
    }
  ];

  // Filter asteroids based on search term
  const filteredAsteroids = asteroids.filter(asteroid =>
    asteroid.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle back button click
const handleBackClick = () => {
  // Navigate to home page
  window.location.href = '/home';
};

const DiscoverAsteroids = () => {
  const navigate = useNavigate();
  
  // Handle back button click with React Router
  const handleBackClick = () => {
    navigate('/home');
  };
  
};

  // Handle clear search
  const handleClearSearch = () => {
    setSearchTerm('');
  };

  // Handle asteroid click to show details
  const handleAsteroidClick = (asteroid) => {
    setSelectedAsteroid(asteroid);
  };

  // Close the modal
  const handleCloseModal = () => {
    setSelectedAsteroid(null);
  };

  // Add hover effects
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .asteroidCard:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.4);
      }
      
      .asteroidCard:hover .asteroidImage {
        transform: scale(1.1);
      }
      
      .backButton:hover {
        background-color: rgba(0, 0, 0, 0.7) !important;
      }
      
      .navLink:hover {
        background-color: rgba(255, 255, 255, 0.1) !important;
      }
      
      .clearButton:hover {
        background-color: rgba(255, 255, 255, 0.1) !important;
      }
      
      
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div style={styles.pageContainer}>
      {/* Main Content */}
      <div style={styles.mainContent}>
        <div style={styles.backgroundDecorations}>
          {/* Decorative SVG elements */}
          <div style={styles.decorationTopRight}>
            <svg fill="none" height="200" viewBox="0 0 200 200" width="200" xmlns="http://www.w3.org/2000/svg">
              <path d="M200 0C150 50 150 150 200 200" stroke="white" strokeOpacity="0.5" strokeWidth="2"></path>
              <path d="M180 0C130 50 130 150 180 200" stroke="white" strokeOpacity="0.4" strokeWidth="2"></path>
              <path d="M160 0C110 50 110 150 160 200" stroke="white" strokeOpacity="0.3" strokeWidth="2"></path>
              <path d="M140 0C90 50 90 150 140 200" stroke="white" strokeOpacity="0.2" strokeWidth="2"></path>
              <path d="M120 0C70 50 70 150 120 200" stroke="white" strokeOpacity="0.1" strokeWidth="2"></path>
            </svg>
          </div>
          <div style={styles.decorationBottomLeft}>
            <svg fill="none" height="200" viewBox="0 0 200 200" width="200" xmlns="http://www.w3.org/2000/svg">
              <path d="M200 0C150 50 150 150 200 200" stroke="white" strokeOpacity="0.5" strokeWidth="2"></path>
              <path d="M180 0C130 50 130 150 180 200" stroke="white" strokeOpacity="0.4" strokeWidth="2"></path>
              <path d="M160 0C110 50 110 150 160 200" stroke="white" strokeOpacity="0.3" strokeWidth="2"></path>
              <path d="M140 0C90 50 90 150 140 200" stroke="white" strokeOpacity="0.2" strokeWidth="2"></path>
              <path d="M120 0C70 50 70 150 120 200" stroke="white" strokeOpacity="0.1" strokeWidth="2"></path>
            </svg>
          </div>
        </div>

        {/* Header */}
        <header style={styles.header}>
          <button 
            style={styles.backButton}
            onClick={handleBackClick}
            className="backButton"
          >
            <span style={styles.backButtonIcon}>←</span>
            <span style={styles.backButtonText}>Back</span>
          </button>
          <h1 style={styles.title}>Discover Asteroids</h1>
        </header>

        {/* Search Bar */}
        <div style={styles.searchContainer}>
          <div style={styles.searchWrapper}>
            <input 
              style={styles.searchInput}
              placeholder="Search asteroids..." 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span style={styles.searchIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            {searchTerm && (
              <button 
                style={styles.clearButton}
                onClick={handleClearSearch}
                className="clearButton"
              >
                <span style={styles.clearIcon}>×</span>
              </button>
            )}
          </div>
        </div>

        {/* Asteroids Grid */}
        <main style={styles.asteroidsGrid}>
          {filteredAsteroids.map(asteroid => (
            <div 
              key={asteroid.id} 
              style={styles.asteroidCard}
              onClick={() => handleAsteroidClick(asteroid)}
              className="asteroidCard"
            >
              <img 
                alt={`Asteroid ${asteroid.name}`} 
                style={styles.asteroidImage}
                src={asteroid.image} 
                className="asteroidImage"
                onError={(e) => {
                  // Fallback to high-res images if ashX.jpg paths don't work
                  e.target.src = "ash1.jpg";
                }}
              />
              <div style={styles.asteroidInfo}>
                <h2 style={styles.asteroidName}>{asteroid.name}</h2>
                <p style={styles.asteroidDiameter}>Diameter: {asteroid.diameter}</p>
              </div>
            </div>
          ))}
        </main>

        {/* Modal for asteroid details */}
        {selectedAsteroid && (
          <div style={styles.modalOverlay} onClick={handleCloseModal}>
            <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <button style={styles.closeButton} onClick={handleCloseModal}>×</button>
              <img 
                src={selectedAsteroid.image} 
                alt={selectedAsteroid.name}
                style={styles.modalImage}
              />
              <div style={styles.modalDetails}>
                <h2 style={styles.modalTitle}>{selectedAsteroid.name}</h2>
                <p style={styles.modalText}><strong>Diameter:</strong> {selectedAsteroid.diameter}</p>
                <p style={styles.modalText}><strong>Discovery:</strong> {selectedAsteroid.discovery}</p>
                <p style={styles.modalText}><strong>Composition:</strong> {selectedAsteroid.composition}</p>
                <p style={styles.modalDescription}>{selectedAsteroid.description}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    minHeight: '100vh',
    backgroundColor: '#0f0f0f',
    color: 'white',
  },
  mainContent: {
    position: 'relative',
    padding: '100px 20px 40px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  backgroundDecorations: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    pointerEvents: 'none',
  },
  decorationTopRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    opacity: 0.1,
  },
  decorationBottomLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    opacity: 0.1,
    transform: 'rotate(180deg)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '30px',
    marginTop: '20px',
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    backgroundColor: 'black',
    border: 'none',
    borderRadius: '20px',
    color: 'white',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.3s',
  },
  backButtonIcon: {
    fontSize: '18px',
  },
  backButtonText: {
    fontWeight: 'bold',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginLeft: '20px',
    color: 'white',
  },
  searchContainer: {
    marginBottom: '30px',
  },
  searchWrapper: {
    position: 'relative',
    maxWidth: '500px',
    margin: '0 auto',
  },
  searchInput: {
    width: '100%',
    padding: '15px 50px 15px 20px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '25px',
    color: 'white',
    fontSize: '1rem',
  },
  searchIcon: {
    position: 'absolute',
    right: '20px',
    top: '50%',
    transform: 'translateY(-50%)',
    opacity: 0.7,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButton: {
    position: 'absolute',
    right: '45px',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: 'transparent',
    border: 'none',
    color: 'rgba(255, 255, 255, 0.7)',
    cursor: 'pointer',
    padding: '5px',
    borderRadius: '50%',
  },
  clearIcon: {
    fontSize: '20px',
  },
  asteroidsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
  },
  asteroidCard: {
    aspectRatio: '1 / 1',
    borderRadius: '16px',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
    cursor: 'pointer',
    transition: 'transform 0.3s, box-shadow 0.3s',
  },
  asteroidImage: {
    width: '90%',
    height: '90%',
    objectFit: 'cover',
    transition: 'transform 0.5s',
  },
  asteroidInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '20px',
    textAlign: 'center',
    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
  },
  asteroidName: {
    fontSize: '1.2rem',
    fontWeight: '600',
    marginBottom: '8px',
    color: 'white',
  },
  asteroidDiameter: {
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.8)',
    margin: 0,
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: '12px',
    maxWidth: '800px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
  },
  modalImage: {
    width: '50%',
    height: '600px',
    objectFit: 'cover',
    borderTopLeftRadius: '12px',
    borderTopRightRadius: '12px',
  },
  modalDetails: {
    padding: '20px',
  },
  modalTitle: {
    fontSize: '2rem',
    marginBottom: '15px',
    color: 'white',
  },
  modalText: {
    fontSize: '1.1rem',
    marginBottom: '10px',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  modalDescription: {
    fontSize: '1rem',
    lineHeight: '1.6',
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: '15px',
  },
  closeButton: {
    position: 'absolute',
    top: '15px',
    right: '15px',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    color: 'white',
    fontSize: '1.5rem',
    cursor: 'pointer',
    zIndex: 1001,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export default DiscoverAsteroids;