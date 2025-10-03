import { useState, useEffect } from "react";
import { 
  FaHome, 
  FaUser, 
  FaBars,
  FaTimes,
  FaGlobeAmericas,
  FaMeteor,
  FaShieldAlt,
  FaChartLine,
  FaGamepad,
  FaRobot,
  FaSatellite,
  FaSignInAlt,
  FaUserPlus
} from "react-icons/fa";
import AuthForm from "./AuthForm";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPagesOpen, setIsPagesOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [modalType, setModalType] = useState(""); // login or register

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openModal = (type) => {
    setModalType(type);
    setIsMenuOpen(false); // Close mobile menu when opening auth modal
  };
  const closeModal = () => setModalType("");

  return (
    <>
      <style>{`
        :root {
          --primary-color: #947bf8ff;
          --primary-hover: #6366f1;
          --text-color: #f8fafc;
          --background: rgba(15,23,42,0.95);
          --dropdown-bg: rgba(15,23,42,0.98);
          --shadow: 0 4px 20px rgba(0,0,0,0.25);
          --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
       .navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  padding: 0.75rem 0;
  background: #000; /* always black */
  transition: var(--transition);
}

        .navbar.scrolled {
  background: #000; /* changed to black */
  backdrop-filter: blur(12px);
  box-shadow: var(--shadow);
  padding: 0.5rem 0;
}

        
        .navbar-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }
        
        .navbar-logo a {
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .logo-text {
          font-size: 1.5rem;
          font-weight: 700;
          background: linear-gradient(90deg, #818cf8 0%, #c7d2fe 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .navbar-menu {
          display: flex;
          list-style: none;
          gap: 2.5rem;
          margin: 0;
          padding: 0;
        }
        
        .navbar-item {
          position: relative;
        }
        
        .navbar-link {
          text-decoration: none;
          color: var(--text-color);
          font-weight: 500;
          font-size: 1rem;
          padding: 0.5rem 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: var(--transition);
        }
        
        .navbar-link:hover {
          color: #c7d2fe;
        }
        
        .dropdown-toggle {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        
        .dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          background: var(--dropdown-bg);
          backdrop-filter: blur(16px);
          border-radius: 0.75rem;
          padding: 0.75rem 0;
          min-width: 240px;
          opacity: 0;
          visibility: hidden;
          transform: translateY(12px);
          transition: var(--transition);
          z-index: 1000;
          box-shadow: var(--shadow);
          border: 1px solid rgba(255,255,255,0.1);
        }
        
        .dropdown-menu.active {
          opacity: 1;
          visibility: visible;
          transform: translateY(8px);
        }
        
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1.5rem;
          color: var(--text-color);
          text-decoration: none;
          font-weight: 500;
          transition: var(--transition);
        }
        
        .dropdown-item:hover {
  background: rgba(255,255,255,0.05); /* subtle highlight */
  color: #c7d2fe;
}

        
        .navbar-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
        }
        
        .auth-btn {
          padding: 0.7rem 1.5rem;
          border-radius: 9999px;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: var(--transition);
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          color: var(--text-color);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          backdrop-filter: blur(10px);
        }
        
        .auth-btn:hover {
          background: var(--primary-color);
          border-color: var(--primary-color);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
        }
        
        .navbar-toggle {
          display: none;
          flex-direction: column;
          cursor: pointer;
          padding: 0.5rem;
          z-index: 1001;
        }
        
        .toggle-bar {
          width: 24px;
          height: 2.5px;
          background-color: var(--text-color);
          margin: 2.5px 0;
          border-radius: 2px;
          transition: var(--transition);
        }
        
        .navbar-toggle.active .toggle-bar:nth-child(1) {
          transform: rotate(45deg) translate(6px, 6px);
        }
        
        .navbar-toggle.active .toggle-bar:nth-child(2) {
          opacity: 0;
        }
        
        .navbar-toggle.active .toggle-bar:nth-child(3) {
          transform: rotate(-45deg) translate(6px, -6px);
        }
        
        @media (max-width: 968px) {
          .navbar-menu {
            position: fixed;
            left: -100%;
            top: 0;
            flex-direction: column;
            background: var(--dropdown-bg);
            width: 80%;
            max-width: 320px;
            height: 100vh;
            padding: 5rem 1.5rem 2rem;
            gap: 0;
            transition: left 0.3s ease;
            box-shadow: var(--shadow);
            overflow-y: auto;
          }
          
          .navbar-menu.active {
            left: 0;
          }
          
          .navbar-item {
            width: 100%;
            border-bottom: 1px solid rgba(255,255,255,0.1);
          }
          
          .navbar-link {
            font-size: 1.1rem;
            padding: 1rem 0;
          }
          
          .dropdown-menu {
            position: static;
            opacity: 1;
            visibility: visible;
            margin: 0 0 0 1rem;
            display: none;
            background: transparent;
            box-shadow: none;
            border: none;
            width: 100%;
          }
          
          .dropdown-menu.active {
            display: block;
            transform: none;
          }
          
          .dropdown-item {
            padding: 0.875rem 0;
            font-size: 1rem;
          }
          
          .navbar-actions {
            display: none;
            position: absolute;
            bottom: 2rem;
            left: 0;
            right: 0;
            padding: 0 1.5rem;
            flex-direction: column;
          }
          
          .navbar-menu.active + .navbar-actions {
            display: flex;
          }
          
          .navbar-toggle {
            display: flex;
          }
        }
        
        @media (max-width: 480px) {
          .navbar-container {
            padding: 0 1rem;
          }
          
          .logo-text {
            font-size: 1.25rem;
          }
        }
      `}</style>

      <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
        <div className="navbar-container">
          {/* Logo */}
          <div className="navbar-logo">
            <a href="/">
              <FaGlobeAmericas className="text-indigo-400 text-2xl" />
              <span className="logo-text">AstraNex</span>
            </a>
          </div>

          {/* Menu */}
          <ul className={`navbar-menu ${isMenuOpen ? "active" : ""}`}>
            <li className="navbar-item">
              <a href="/home" className="navbar-link">
                <FaHome /> Home
              </a>
            </li>

           

            <li className="navbar-item">
    <a href="/Asteroid" className="navbar-link">
        <FaMeteor /> Asteroid  
    </a>
</li>


            <li className="navbar-item">
              <a href="/ai-buddy" className="navbar-link">
                <FaRobot /> AI Buddy
              </a>
            </li>
          </ul>

          {/* Auth Buttons */}
          <div className="navbar-actions">
            <button className="auth-btn" onClick={() => openModal("login")}>
              <FaSignInAlt /> Login
            </button>
            <button className="auth-btn" onClick={() => openModal("register")}>
              <FaUserPlus /> Sign Up
            </button>
          </div>

          {/* Mobile Toggle */}
          <div
            className={`navbar-toggle ${isMenuOpen ? "active" : ""}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="toggle-bar"></span>
            <span className="toggle-bar"></span>
            <span className="toggle-bar"></span>
          </div>
        </div>
      </nav>

      {/* Auth Modal */}
      {modalType && <AuthForm type={modalType} closeModal={closeModal} />}
    </>
  );
}

export default Navbar;