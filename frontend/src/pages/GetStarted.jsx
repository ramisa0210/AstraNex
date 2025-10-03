import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function GetStarted() {
  const navigate = useNavigate();
  const buttonRef = useRef(null);
  const canvasRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = (Math.random() - 0.5) * canvas.width;
        this.y = (Math.random() - 0.5) * canvas.height;
        this.z = Math.random() * canvas.width;
        this.size = Math.random() * 2 + 0.5;
        this.speed = 2;
      }
      update() {
        this.z -= this.speed;
        if (this.z <= 0) {
          this.reset();
          this.z = canvas.width;
        }
      }
      draw() {
        const fov = canvas.width / 2;
        const scale = fov / (this.z + 1);

        const x2d = (this.x - mouse.current.x) * scale + canvas.width / 2;
        const y2d = (this.y - mouse.current.y) * scale + canvas.height / 2;

        const radius = this.size * scale * 1.5;

        // Glowing star/asteroid effect using radial gradient
        const gradient = ctx.createRadialGradient(x2d, y2d, 0, x2d, y2d, radius);
        gradient.addColorStop(0, "rgba(255,255,255,1)");
        gradient.addColorStop(0.3, "rgba(255,255,255,0.8)");
        gradient.addColorStop(1, "rgba(255,255,255,0)");

        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(x2d, y2d, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const particles = [];
    for (let i = 0; i < 200; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    const handleMouseMove = (e) => {
      mouse.current.x = (e.clientX - canvas.width / 2) / 50;
      mouse.current.y = (e.clientY - canvas.height / 2) / 50;
    };
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const handleGetStarted = () => {
    navigate("/home");
  };

  const handleMouseMoveBtn = (e) => {
    const button = buttonRef.current;
    if (!button) return;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const angleY = (x - rect.width / 2) / 25;
    const angleX = (rect.height / 2 - y) / 25;
    button.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg)`;
  };

  const handleMouseLeaveBtn = () => {
    const button = buttonRef.current;
    if (button) {
      button.style.transform = "perspective(1000px) rotateX(0) rotateY(0)";
    }
  };

  return (
    <div className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute z-0 w-full h-full object-cover object-center"
      >
        <source src="/bgg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Particle Canvas ABOVE video but BELOW text */}
      <canvas ref={canvasRef} className="absolute z-10 w-full h-full" />

      {/* Enhanced Dark overlay with gradient for better text contrast */}
      <div className="absolute z-20 w-full h-full bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>

      {/* Enhanced Title with better visibility */}
      <div className="relative z-30 text-center mb-8 px-4">
        <h1 className="text-6xl md:text-8xl font-bold text-white tracking-wider 
                      drop-shadow-[0_5px_15px_rgba(0,0,0,0.9)] 
                      mb-4">
          AstraNex
        </h1>
        <p className="text-white text-sm sm:text-base uppercase tracking-[0.35em] 
                     font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]
                     mb-6">
          Powered by NASA NEO Data & USGS Analytics
        </p>
      </div>

      

      {/* Enhanced Button with better visibility */}
      <div className="relative z-30">
        <button
          ref={buttonRef}
          onMouseMove={handleMouseMoveBtn}
          onMouseLeave={handleMouseLeaveBtn}
          onClick={handleGetStarted}
          className="px-12 py-6 bg-white/20 backdrop-blur-xl border-2 border-white/60 
                   rounded-full text-xl font-semibold text-white 
                   shadow-[0_20px_50px_rgba(255,255,255,0.25)]
                   transform transition-all duration-300 ease-out 
                   hover:shadow-[0_25px_60px_rgba(255,255,255,0.35)] 
                   active:scale-95 flex items-center justify-center 
                   overflow-hidden relative group
                   drop-shadow-[0_5px_15px_rgba(0,0,0,0.7)]"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
          <span className="relative z-10 text-white font-bold 
                          drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]
                          group-hover:drop-shadow-[0_4px_20px_rgba(255,255,255,0.3)] 
                          transition-all duration-300">
            Enter Mission Control
          </span>
        </button>
      </div>

      {/* Enhanced Watch our mission video link */}
      <div className="fixed z-30 bottom-6 left-6 md:bottom-8 md:left-8">
        <a 
          href="https://youtu.be/oLiF81ebh-c?si=qdNmiZPLpQ3vOIqo" 
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 text-white hover:text-white 
                   transition-all duration-300 group p-3 rounded-xl 
                   hover:bg-white/20 backdrop-blur-md border border-white/30
                   shadow-[0_8px_32px_rgba(0,0,0,0.4)]
                   hover:shadow-[0_12px_40px_rgba(255,255,255,0.2)]"
        >
          <div className="relative">
            <svg 
              className="w-7 h-7 group-hover:scale-110 transition-transform duration-300 
                        drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
            <div className="absolute inset-0 rounded-full bg-white/30 group-hover:bg-white/40 transition-all duration-300 animate-pulse"></div>
          </div>
          <span className="text-base font-semibold border-b border-transparent 
                          group-hover:border-white transition-all duration-300
                          drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
            View Demo
          </span>
        </a>
      </div>
    </div>
  );
}
