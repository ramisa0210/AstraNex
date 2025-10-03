import React, { useEffect, useRef, useState } from "react";
import { FaRocket, FaSatellite, FaChartLine, FaRobot, FaUserAstronaut, FaMeteor, FaGlobeAmericas, FaShieldAlt, FaExclamationTriangle } from "react-icons/fa";
import { Link } from "react-router-dom";

const AstraNexInterface = () => {
  const canvasRef = useRef(null);
  const [activeCard, setActiveCard] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const particles = [];
    const particleCount = 200;

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.3;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.alpha = Math.random() * 0.7 + 0.3;
        this.shine = Math.random() * 10;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
        this.shine += 0.03;
      }
      draw() {
        const shineFactor = Math.sin(this.shine) * 0.3 + 0.7;
        ctx.fillStyle = `rgba(255,255,255,${Math.min(
          1,
          this.alpha * shineFactor
        )})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) particles.push(new Particle());

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const grd = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        10,
        canvas.width / 2,
        canvas.height / 2,
        Math.max(canvas.width, canvas.height) * 0.7
      );
      grd.addColorStop(0, "rgba(14, 22, 48, 0.02)");
      grd.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);


  const moduleItems = [
    {
      name: "Live Asteroid Map",
      icon: "/assets/icons/globe.gif",
      description: "Explore in 3D",
      color: "from-blue-900/30 to-indigo-900/30",
      path: "/solar-system",
    },
    {
      name: "Impact Simulator",
      icon: "/assets/icons/Risk.gif",
      description: "Launch Simulation",
      color: "from-purple-900/30 to-red-900/30",
      path: "/impact",
    },
    {
      name: "Asteroid Statistics",
      icon: "/assets/icons/stat.gif",
      description: "Explore asteroid impact trends and insights",
      color: "from-green-900/30 to-teal-900/30",
      path: "/statistics",
    },
  ];

  const statusItems = [
    {
      title: "NEOs TRACKED",
      value: "33,000+",
      icon: <FaSatellite className="text-purple-400" />,
    },
    {
      title: "HAZARDOUS OBJECTS",
      value: "2,300+",
      icon: <FaExclamationTriangle className="text-red-400" />,
    },
    {
      title: "IMPACTS SIMULATED",
      value: "10,240",
      icon: <FaChartLine className="text-cyan-400" />,
    },
    {
      title: "DEFLECTION TESTS",
      value: "3,451",
      icon: <FaShieldAlt className="text-green-400" />,
    },
  ];

  const recentActivities = [
    { 
      action: "Simulated Impact on", 
      subject: "Pacific Ocean", 
      time: "2 hours ago", 
      user: "User", 
      icon: <FaMeteor className="text-orange-400" />,
      status: "pending",
      path: "/view-report"
    },
    { 
      action: "New NEO Detected", 
      subject: "(2025 CD3)", 
      time: "5 hours ago", 
      user: "System", 
      icon: <FaSatellite className="text-purple-400" />,
      status: "completed",
      path: "/analyze-threat"
    },
    { 
      action: "Tested Kinetic Impactor on", 
      subject: "Asteroid Bennu", 
      time: "Yesterday", 
      user: "User", 
      icon: <FaRocket className="text-blue-400" />,
      status: "completed",
      path: "/deflection-results"
    },
    { 
      action: "USGS Elevation Data", 
      subject: "Synced", 
      time: "2 days ago", 
      user: "Data Update", 
      icon: <FaChartLine className="text-cyan-400" />,
      status: "completed",
      path: "/details"
    },
  ];

  const defenseAnalytics = [
    { 
      category: "HIGH-RISK ASTEROIDS",
      items: [
        { label: "Monitored", value: "150" },
        { label: "Deflection Ready", value: "45" }
      ]
    },
    { 
      category: "SIMULATION DATA",
      items: [
        { label: "Impacts Simulated", value: "10,240" },
        { label: "Deflection Tests", value: "3,451" }
      ]
    },
    { 
      category: "GLOBAL READINESS",
      items: [
        { label: "Response Models", value: "78%" },
        { label: "Data Accuracy", value: "94%" }
      ]
    },
  ];

  const systemStatus = [
    { name: "NASA NEO API", status: "live", color: "text-green-400" },
    { name: "USGS DATA FEED", status: "live", color: "text-green-400" },
    { name: "IMPACT SIMULATION ENGINE", status: "active", color: "text-green-400" },
  ];

  return (
    <div className="min-h-screen relative bg-black text-white">
      {/* Stars canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ background: "transparent" }}
      />

      {/* Grid background */}
      <div className="absolute inset-0 z-1 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(25, 130, 255, 0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(25, 130, 255, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      ></div>

      {/* Main content */}
      <main className="relative z-20 container mx-auto px-4 py-8 pt-20">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-wide">
            Astra<span className="text-blue-400">Nex</span>
          </h1>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-snug">
            Asteroid Threat Simulation & Mitigation Platform
          </p>
        </div>

        {/* Module cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {moduleItems.map((item, idx) => (
            <div
              key={idx}
              onMouseEnter={() => setActiveCard(idx)}
              onMouseLeave={() => setActiveCard(null)}
              className={`relative rounded-2xl backdrop-blur-md border border-white/10
                          transition-all duration-500 h-72
                          shadow-lg hover:shadow-blue-500/20 group
                          glass-effect`}
              style={{
                transform: activeCard === idx ?
                  "translateY(-8px) scale(1.03)" :
                  "translateY(0) scale(1)",
              }}
            >
              <div className="p-6 h-full flex flex-col items-center justify-between">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-blue-900/25 flex items-center justify-center p-2 border border-blue-500/20 transform transition-transform duration-700 group-hover:rotate-12">
                    <img
                      src={item.icon}
                      alt={item.name}
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {item.name}
                  </h3>
                  <p className="text-blue-200 text-sm">{item.description}</p>
                </div>

                <div className="w-full h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent my-4"></div>

                <Link to={item.path} className="w-full">
                  <button className="w-full py-3 bg-gradient-to-r from-blue-600/10 to-blue-600/5 border border-blue-500/25 rounded-full flex items-center justify-center space-x-2 transition-all duration-500 shadow-md backdrop-blur-sm glass-glow transform group-hover:-translate-y-1">
                    <span className="text-white font-medium text-sm">
                      ACCESS MODULE
                    </span>
                    <span className="text-blue-300 transform transition-transform duration-500 group-hover:translate-x-1">→</span>
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Mission Status */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
            <span className="w-4 h-4 bg-green-500 rounded-full mr-3 animate-pulse"></span>
            MISSION STATUS: <span className="text-green-400 ml-2">MONITORING</span>
          </h2>
          
          {/* System Status */}
          <div className="flex flex-wrap gap-4 mb-6">
            {systemStatus.map((system, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-slate-800/30 px-3 py-1 rounded-full border border-slate-700/30">
                <span className={`text-xs font-mono ${system.color}`}>●</span>
                <span className="text-white text-sm font-mono">{system.name}</span>
                <span className={`text-xs font-mono ${system.color} uppercase`}>{system.status}</span>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {statusItems.map((item, idx) => (
              <div
                key={idx}
                className="rounded-xl backdrop-blur-md border border-white/10 p-5
                             bg-slate-900/30 h-32 flex flex-col justify-center transform transition-all duration-500 hover:-translate-y-1 hover:shadow-lg glass-effect"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-900/20 rounded-lg">
                    {item.icon}
                  </div>
                  <div className="text-blue-300 text-sm font-mono uppercase tracking-wider">
                    {item.title}
                  </div>
                </div>
                <div className="text-white text-3xl font-mono font-bold">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Two-column layout: Recent Activities and Defense Preparedness Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          
          {/* Recent Activities */}
          <div className="backdrop-blur-md rounded-2xl p-6 border border-blue-500/20 transform transition-all duration-500 hover:-translate-y-1 glass-effect">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Recent Activities</h2>
              <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors font-mono">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl border border-slate-700/30 hover:border-blue-500/30 transition-all duration-300 group transform hover:-translate-y-0.5">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${activity.status === 'pending' ? 'bg-orange-500/20' : 'bg-blue-500/20'} group-hover:bg-blue-500/30 transition-colors`}>
                        {activity.icon}
                      </div>
                      <div className="flex items-center gap-2">
                        {activity.status === 'pending' ? (
                          <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                        ) : (
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        )}
                        <span className="text-xs font-mono text-gray-400 uppercase">{activity.user}</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-white">
                        {activity.action} <span className="text-blue-400">{activity.subject}</span>
                      </h3>
                      <p className="text-xs text-gray-400 font-mono">{activity.time}</p>
                    </div>
                  </div>
                  <Link to={activity.path} className="text-blue-400 hover:text-blue-300 text-sm font-mono transition-colors">
                    View {activity.user === 'System' ? 'Threat' : activity.user === 'Data Update' ? 'Details' : 'Report'}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Defense Preparedness Analytics */}
          <div className="backdrop-blur-md rounded-2xl p-6 border border-blue-500/20 transform transition-all duration-500 hover:-translate-y-1 glass-effect">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Defense Preparedness Analytics</h2>
              <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors font-mono">
                Full Report
              </button>
            </div>
            <div className="space-y-6">
              {defenseAnalytics.map((category, index) => (
                <div key={index} className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/30">
                  <h3 className="text-blue-300 font-mono text-sm uppercase tracking-wider mb-3">{category.category}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {category.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="text-center p-3 bg-slate-900/50 rounded-lg transform transition-all duration-500 hover:-translate-y-1">
                        <div className="text-lg font-bold text-blue-400">{item.value}</div>
                        <div className="text-xs text-gray-400 font-mono">{item.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Control buttons */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <button className="px-6 py-3 rounded-full border border-blue-500/30 bg-blue-900/20 text-white font-mono text-sm uppercase transition-all duration-300 hover:bg-blue-900/30 hover:border-blue-500/50 transform hover:-translate-y-1">
            Emergency Protocols
          </button>
          <button className="px-6 py-3 rounded-full border border-green-500/30 bg-green-900/20 text-white font-mono text-sm uppercase transition-all duration-300 hover:bg-green-900/30 hover:border-green-500/50 transform hover:-translate-y-1">
            Data Analysis
          </button>
          <button className="px-6 py-3 rounded-full border border-purple-500/30 bg-purple-900/20 text-white font-mono text-sm uppercase transition-all duration-300 hover:bg-purple-900/30 hover:border-purple-500/50 transform hover:-translate-y-1">
            System Diagnostics
          </button>
        </div>
      </main>

      <style jsx>{`
        .glass-glow {
          box-shadow: 0 0 15px rgba(100, 150, 255, 0.6),
                      0 0 30px rgba(100, 150, 255, 0.3) inset;
        }
        
        .glass-effect {
          background: rgba(255, 255, 255, 0.05) !important;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.36) !important;
        }
      `}</style>
    </div>
  );
};

export default AstraNexInterface;