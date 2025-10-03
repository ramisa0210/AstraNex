import React, { useState, useEffect, useRef } from "react";

export default function AiBuddy() {
  const [messages, setMessages] = useState([
    { 
      id: 1,
      sender: "ai", 
      text: "Hello! I am Astra Buddy 🚀. Ask me anything about space, NASA missions, or cosmic events.", 
      time: new Date() 
    }
  ]);
  const [input, setInput] = useState("");
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const chatEndRef = useRef(null);
  const starsCanvasRef = useRef(null);
  const chatCanvasRef = useRef(null);
  const sidebarRef = useRef(null);
  const textareaRef = useRef(null);
  const askedQuestions = useRef(new Set());

  const questionPool = [
    "What is Astra-Nex?",
    "Tell me about near-Earth asteroids today",
    "What are NASA's current missions?",
    "How does asteroid detection work?",
    "What's the difference between asteroids and meteors?",
    "Can you explain the Astra-Nex project?",
    "What cosmic events can I see this week?",
    "How does NASA track potentially hazardous asteroids?",
    "What technology does Astra-Nex use for detection?",
    "How can I contribute to space research?",
    "Latest discoveries from James Webb Telescope?",
    "How do we defend Earth from asteroid impacts?"
  ];

  useEffect(() => {
    rotateSuggestedQuestions();
    const interval = setInterval(rotateSuggestedQuestions, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Auto-adjust textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [input]);

  const getUniqueQuestions = () => {
    const availableQuestions = questionPool.filter(q => !askedQuestions.current.has(q));
    
    if (availableQuestions.length === 0) {
      askedQuestions.current.clear();
      return questionPool.sort(() => 0.5 - Math.random()).slice(0, 2);
    }
    
    if (availableQuestions.length === 1) {
      const secondQuestion = questionPool
        .filter(q => q !== availableQuestions[0])
        .sort(() => 0.5 - Math.random())[0];
      return [availableQuestions[0], secondQuestion];
    }
    
    return availableQuestions.sort(() => 0.5 - Math.random()).slice(0, 2);
  };

  const rotateSuggestedQuestions = () => {
    const uniqueQuestions = getUniqueQuestions();
    setSuggestedQuestions(uniqueQuestions);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Stars Canvas for background
  useEffect(() => {
    const canvas = starsCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const stars = [];
    const starCount = 200;
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5,
        speed: Math.random() * 0.3,
        opacity: Math.random()
      });
    }

    function drawStars() {
      ctx.clearRect(0, 0, width, height);
      stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${star.opacity})`;
        ctx.fill();
        star.y += star.speed;
        if (star.y > height) {
          star.y = 0;
          star.x = Math.random() * width;
        }
        if (Math.random() > 0.95) star.opacity = Math.random();
      });
      requestAnimationFrame(drawStars);
    }

    drawStars();
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Stars Canvas for chat area
  useEffect(() => {
    const canvas = chatCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const width = canvas.width = canvas.parentElement.clientWidth;
    const height = canvas.height = canvas.parentElement.clientHeight;

    const stars = [];
    const starCount = 80;
    for (let i = 0; i <starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 0.8,
        speed: Math.random() * 0.15,
        opacity: Math.random() * 0.4
      });
    }

    function drawStars() {
      ctx.clearRect(0, 0, width, height);
      stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${star.opacity})`;
        ctx.fill();
        star.y += star.speed;
        if (star.y > height) {
          star.y = 0;
          star.x = Math.random() * width;
        }
        if (Math.random() > 0.97) star.opacity = Math.random() * 0.4;
      });
      requestAnimationFrame(drawStars);
    }

    drawStars();
  }, []);

  const getAiResponse = (msg) => {
    const text = msg.toLowerCase();
    if (text.includes("astra-nex") || text.includes("project")) {
      return "Astra-Nex is an advanced asteroid detection platform designed to monitor near-Earth objects and space debris.";
    }
    if (text.includes("nasa")) {
      return "NASA leads missions like Artemis, Dragonfly, Europa Clipper, DART, and more. They track space objects and explore our universe!";
    }
    if (text.includes("asteroid") || text.includes("near-earth")) {
      return "Asteroids are rocky objects orbiting the Sun. NASA tracks NEOs closely to prevent potential collisions.";
    }
    if (text.includes("joke")) {
      return "Why did the star break up with the planet? Because it needed space! 🌟";
    }
    if (text.includes("cosmic") || text.includes("space")) {
      return "The universe is vast and mysterious. There are billions of galaxies, each containing billions of stars!";
    }
    return "I'm still learning about that. Please ask me about NASA missions, asteroids, cosmic events, or space exploration in general.";
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    // Add to asked questions
    askedQuestions.current.add(input);
    
    const userMsg = { 
      id: messages.length + 1,
      sender: "user", 
      text: input, 
      time: new Date() 
    };
    setMessages(prev => [...prev, userMsg]);
    setInput("");

    // Typing animation for AI
    const aiTyping = { 
      id: messages.length + 2,
      sender: "ai", 
      text: "...", 
      time: new Date(), 
      typing: true 
    };
    setMessages(prev => [...prev, aiTyping]);

    setTimeout(() => {
      const aiText = getAiResponse(userMsg.text);
      setMessages(prev => prev.map(msg => msg.typing ? { 
        id: msg.id,
        sender: "ai", 
        text: aiText, 
        time: new Date() 
      } : msg));
      speakText(aiText);
      
      // Show new suggestions after AI response
      setTimeout(() => {
        rotateSuggestedQuestions();
      }, 500);
    }, 1000);
  };

  const speakText = (text) => {
    if (!window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.volume = 0.8;
    window.speechSynthesis.speak(utterance);
  };

  const handleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Your browser does not support voice input.");
      return;
    }
    setIsListening(true);
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      setInput(speechResult);
      setIsListening(false);
      setTimeout(handleSend, 200);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const handleSuggestionClick = (q) => {
    // Add to asked questions
    askedQuestions.current.add(q);
    
    setInput(q);
    setTimeout(handleSend, 200);
  };

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const goBack = () => {
    // Navigate to home page
    window.location.href = "/home"; // Change this to your actual home route
  };

  // Filter messages based on search query
  const filteredMessages = searchQuery
    ? messages.filter(msg => 
        msg.text.toLowerCase().includes(searchQuery.toLowerCase()))
    : messages;

  return (
    <div className="min-h-screen relative overflow-hidden bg-black text-white">
      {/* Main gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-blue-950/50 to-purple-950/50 z-0"></div>
      
      {/* Animated stars canvas */}
      <canvas 
        ref={starsCanvasRef}
        className="absolute inset-0 z-5"
        style={{ background: 'transparent' }}
      ></canvas>
      
      {/* Back button */}
{/* Back button */}
<button 
  onClick={goBack}
  style={{
    position: "fixed",
    left: "1rem",
    top: "calc(80px + 1rem)", // Push below Navbar
    zIndex: 50, // Make sure it's above Navbar
    padding: "0.6rem 1rem",
    borderRadius: "0.5rem",
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(52, 53, 65, 0.8)",
    color: "white",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    fontSize: "0.875rem",
    transition: "all 0.3s ease",
    backdropFilter: "blur(10px)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3), inset 0 1px 3px rgba(255,255,255,0.1)",
    animation: "fadeIn 0.5s ease-out"
  }}


        onMouseEnter={(e) => {
          e.target.style.background = "rgba(64, 65, 79, 0.9)";
          e.target.style.transform = "translateX(-5px)";
          e.target.style.boxShadow = "0 6px 15px rgba(0,0,0,0.4), inset 0 1px 3px rgba(255,255,255,0.1)";
        }}
        onMouseLeave={(e) => {
          e.target.style.background = "rgba(52, 53, 65, 0.8)";
          e.target.style.transform = "translateX(0)";
          e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3), inset 0 1px 3px rgba(255,255,255,0.1)";
        }}
      >
        <span style={{ fontSize: "1.2rem" }}>←</span>
        <span>Back</span>
      </button>
      
      {/* Content */}
      <div className="relative z-10" style={{ paddingTop: '70px', paddingBottom: '20px' }}>
        <div style={{
          display: "flex",
          flex: 1,
          position: "relative",
          zIndex: 2,
          maxWidth: "1400px",
          width: "100%",
          margin: "0 auto",
          padding: "1rem",
          height: "calc(100vh - 90px)"
        }}>
          {/* Sidebar */}
          <div 
            ref={sidebarRef}
            style={{
              width: sidebarOpen ? "320px" : "0",
              background: "rgba(32, 33, 35, 0.8)",
              backdropFilter: "blur(10px)",
              overflow: "hidden",
              transition: "width 0.3s ease",
              borderRight: "1px solid rgba(255,255,255,0.1)",
              display: "flex",
              flexDirection: "column",
              boxShadow: "inset -10px 0 10px -10px rgba(0,0,0,0.5)",
              borderRadius: "0.5rem",
              marginRight: "1rem",
              height: "100%"
            }}
          >
            <div style={{ 
              padding: "1.25rem", 
              borderBottom: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(32, 33, 35, 0.95)"
            }}>
              <h2 style={{ 
                margin: "0 0 1rem 0", 
                fontSize: "1.2rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}>
                <span>Chat History</span>
                <span style={{
                  background: "rgba(52, 53, 65, 0.8)",
                  fontSize: "0.7rem",
                  padding: "0.2rem 0.5rem",
                  borderRadius: "0.5rem"
                }}>Astra-Nex</span>
              </h2>
              
              {/* Search input */}
              <div style={{
                position: "relative",
                marginBottom: "1rem"
              }}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search conversations..."
                  style={{
                    width: "100%",
                    padding: "0.6rem 0.6rem 0.6rem 2.2rem",
                    borderRadius: "0.5rem",
                    border: "1px solid rgba(255,255,255,0.2)",
                    background: "rgba(32, 33, 35, 0.6)",
                    color: "white",
                    outline: "none",
                    fontSize: "0.875rem",
                    backdropFilter: "blur(10px)",
                    boxShadow: "inset 0 1px 3px rgba(0,0,0,0.2)"
                  }}
                />
                <span style={{
                  position: "absolute",
                  left: "0.75rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  opacity: 0.5
                }}>🔍</span>
              </div>
              
              <button 
                onClick={toggleSidebar}
                style={{
                  width: "100%",
                  padding: "0.6rem",
                  borderRadius: "0.5rem",
                  border: "1px solid rgba(255,255,255,0.2)",
                  background: "rgba(52, 53, 65, 0.6)",
                  color: "white",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  fontSize: "0.875rem",
                  transition: "all 0.2s",
                  backdropFilter: "blur(10px)",
                  boxShadow: "inset 0 1px 3px rgba(0,0,0,0.2)"
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(64, 65, 79, 0.8)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "rgba(52, 53, 65, 0.6)";
                }}
              >
                <span>Close Sidebar</span>
              </button>
            </div>
            
            <div style={{
              flex: 1,
              overflowY: "auto",
              padding: "0.75rem"
            }}>
              {filteredMessages.filter(m => !m.typing).map((m) => (
                <div 
                  key={m.id}
                  style={{
                    padding: "0.85rem",
                    borderRadius: "0.5rem",
                    marginBottom: "0.75rem",
                    background: "rgba(52, 53, 65, 0.5)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    animation: "fadeIn 0.3s ease-out",
                    backdropFilter: "blur(10px)",
                    boxShadow: "inset 极 1px 3px rgba(0,0,0,0.2)"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(52, 53, 65, 0.8)";
                    e.currentTarget.style.boxShadow = "0 0 0 1px rgba(255,255,255,0.1), inset 0 1px 3px rgba(0,0,0,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(52, 53, 65, 0.5)";
                    e.currentTarget.style.boxShadow = "inset 0 1px 3px rgba(0,0,0,0.2)";
                  }}
                >
                  <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "0.35rem"
                  }}>
                    <strong style={{ 
                      color: m.sender === "ai" ? "#3494e6" : "#ec6ead",
                      fontSize: "0.875rem"
                    }}>
                      {m.sender === "ai" ? "Astra Buddy" : "You"}
                    </strong>
                    <span style={{ 
                      fontSize: "0.7rem", 
                      opacity: 0.7 
                    }}>
                      {m.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div style={{ 
                    fontSize: "0.8rem", 
                    opacity: 0.9,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical"
                  }}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat area */}
          <div style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            position: "relative",
            overflow: "hidden",
            background: "rgba(32, 33, 35, 0.7)",
            borderRadius: "0.75rem",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
            height: "100%"
          }}>
            {/* ChatGPT-style title header */}
            <div style={{
              padding: "1rem 1.5rem",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(32, 33, 35, 0.9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backdropFilter: "blur(10px)"
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem"
              }}>
                <div style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #06457cff, #5bacf8ff)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  fontSize: "0.9rem"
                }}>AB</div>
                <div>
                  <h2 style={{ 
                    margin: 0, 
                    fontSize: "1.1rem",
                    fontWeight: "600"
                  }}>Astra Buddy</h2>
                  <p style={{ 
                    margin: 0, 
                    fontSize: "0.8rem",
                    opacity: 0.7
                  }}>Your cosmic assistant</p>
                </div>
              </div>
              <div style={{
                display: "flex",
                gap: "0.5rem"
              }}>
                <div style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background: "#22c55e"
                }}></div>
                <span style={{
                  fontSize: "0.8rem",
                  opacity: 0.7
                }}>Online</span>
              </div>
            </div>

            {/* Animated background for chat area */}
            <canvas 
              ref={chatCanvasRef} 
              style={{ 
                position: "absolute", 
                top: "60px", 
                left: 0, 
                width: "100%", 
                height: "calc(100% - 60px)", 
                zIndex: 0,
                opacity: 0.2
              }} 
            />
            
            {/* Chat messages */}
            <div style={{
              flex: 1,
              overflowY: "auto",
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
              position: "relative",
              zIndex: 2,
              marginTop: "60px"
            }}>
              {messages.map((m) => (
                <div 
                  key={m.id}
                  style={{
                    alignSelf: m.sender === "ai" ? "flex-start" : "flex-end",
                    maxWidth: "80%",
                    position: "relative",
                    animation: "fadeIn 0.3s ease-out"
                  }}
                >
                  <div style={{
                    padding: "1rem 1.25rem",
                    borderRadius: "1rem",
                    background: m.sender === "ai" 
                      ? "rgba(52, 53, 65, 0.8)" 
                      : "rgba(32, 33, 35, 0.8)",
                    border: m.sender === "ai" 
                      ? "1px solid rgba(255,255,255,0.1)" 
                      : "1px solid rgba(236,110,173,0.2)",
                    backdropFilter: "blur(10px)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1), inset 0 1px 3px rgba(255,255,255,0.1)",
                    animation: m.typing ? "pulse 1s infinite" : "none",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={(e) => {
                    if (!m.typing) {
                      e.currentTarget.style.boxShadow = m.sender === "ai" 
                        ? "0 4px 15px rgba(52,148,230,0.15), inset 0 1px 3px rgba(255,255,255,0.1)" 
                        : "0 4px 15px rgba(236,110,173,0.15), inset 极 1px 3px rgba(255,255,255,0.1)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1), inset 0 1px 3px rgba(255,255,255,0.1)";
                  }}
                  >
                    <p style={{ 
                      margin: "0 0 0.5rem 0", 
                      lineHeight: "1.5",
                      fontSize: "0.95rem"
                    }}>
                      {m.text}
                    </p>
                    {!m.typing && (
                      <span style={{ 
                        fontSize: "0.75rem", 
                        opacity: 0.7,
                        display: "block",
                        textAlign: m.sender === "ai" ? "left" : "right"
                      }}>
                        {m.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                    {m.typing && (
                      <span style={{ 
                        fontSize: "0.75rem", 
                        opacity: 0.7,
                        display: "block",
                        textAlign: "left"
                      }}>
                        Typing...
                      </span>
                    )}
                  </div>
                  
                  {/* Particle effect for AI */}
                  {m.sender === "ai" && !m.typing && (
                    <div style={{ 
                      position: "absolute", 
                      top: "-5px", 
                      right: "-5px", 
                      width: "10px", 
                      height: "10px", 
                      background: "#3494e6", 
                      borderRadius: "50%", 
                      animation: "particle 1s infinite alternate",
                      boxShadow: "0 0 5px rgba(52, 148, 230, 0.8)"
                    }}></div>
                  )}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Suggested Questions - Show after each response */}
            <div style={{ 
              display: "flex", 
              gap: "0.75rem", 
              flexWrap: "wrap", 
              padding: "0 1.5rem 1.5rem 1.5rem",
              justifyContent: "center",
              position: "relative",
              zIndex: 2
            }}>
              {suggestedQuestions.map((q, i) => (
                <button 
                  key={i} 
                  onClick={() => handleSuggestionClick(q)} 
                  style={{
                    background: "rgba(52, 53, 65, 0.7)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "0.75rem",
                    padding: "0.85rem 1.35rem",
                    cursor: "pointer",
                    color: "white",
                    fontSize: "0.9rem",
                    transition: "all 0.2s",
                    backdropFilter: "blur(10px)",
                    boxShadow: "inset 0 1px 3px rgba(0,0,0,0.2)"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(64, 65, 79, 0.8)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2), inset 0 1px 3px rgba(255,255,255,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(52, 53, 65, 极.7)";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "inset 0 1px 3px rgba(0,0,0,0.2)";
                  }}
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input area */}
            <div style={{ 
              padding: "1.25rem", 
              background: "rgba(32, 33, 35, 0.7)",
              borderTop: "1px solid rgba极(255,255,255,0.1)",
              backdropFilter: "blur(10px)",
              position: "relative",
              zIndex: 2
            }}>
              <div style={{ 
                display: "flex", 
                gap: "0.75rem", 
                alignItems: "flex-end",
                position: "relative",
                margin: "0 auto",
                maxWidth: "800px"
              }}>
                <div style={{
                  flex: 1,
                  position: "relative",
                  display: "flex",
                  alignItems: "center"
                }}>
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Ask me about space..."
                    rows="1"
                    style={{ 
                      width: "100%",
                      padding: "0.9rem 3.5rem 0.9rem 1rem",
                      borderRadius: "0.75rem",
                      border: "1px solid rgba(255,255,255,0.2)",
                      background: "rgba(32, 33, 35, 0.6)",
                      color: "white",
                      outline: "none",
                      resize: "none",
                      minHeight: "52px",
                      maxHeight: "150px",
                      fontFamily: "inherit",
                      fontSize: "0.95rem",
                      backdropFilter: "blur(10px)",
                      boxShadow: "inset 0 1px 3px rgba(0,0,0,0.2)"
                    }}
                  />
                  <button 
                    onClick={handleVoiceInput}
                    style={{ 
                      position: "absolute",
                      right: "0.75rem",
                      bottom: "0.65rem",
                      border: "none",
                      background: "linear-gradient(135deg, rgba(14, 89, 155, 0.8), rgba(148, 162, 243, 0.8))",
                      color: "white",
                      cursor: "pointer",
                      borderRadius: "50%",
                      width: "36px",
                      height: "36px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.2s",
                      backdropFilter: "blur(10px)",
                      boxShadow: "0 4px 8px rgba(0,0,0,0.2), inset 0 1px 3px rgba(255,255,255,0.1)"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "linear-gradient(135deg, rgba(52, 148, 230, 1), rgba(236, 110, 173, 1))";
                      e.currentTarget.style.boxShadow = "0 6px 12px rgba(52, 148, 230, 0.3), inset 0 1px 3px rgba(255,255,255,0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "linear-gradient(135deg, rgba(52, 148, 230, 0.8), rgba(236, 110, 173, 0.8))";
                      e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2), inset 0 1px 3px rgba(255,255,255,0.1)";
                    }}
                  >
                    🎤
                  </button>
                </div>
                <button 
                  onClick={handleSend} 
                  disabled={!input.trim()} 
                  style={{ 
                    padding: "0.9rem 1.5rem",
                    borderRadius: "0.75rem",
                    border: "none",
                    cursor: input.trim() ? "pointer" : "not-allowed",
                    background: input.trim() 
                      ? "linear-gradient(135deg, rgba(52, 148, 230, 0.8), rgba(236, 110, 173, 0.8))" 
                      : "rgba(255,255,255,0.1)",
                    color: "white",
                    fontWeight: "500",
                    transition: "all 0.2s",
                    height: "52px",
                    minWidth: "80px",
                    backdropFilter: "blur(10px)",
                    boxShadow: input.trim() 
                      ? "0 4px 8px rgba(0,0,0,0.2), inset 0 1px 3px rgba(255,255,255,0.1)" 
                      : "inset 0 1px 3px rgba(0,0,0,0.2)"
                  }}
                  onMouseEnter={(e) => {
                    if (input.trim()) {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 6px 12px rgba(52, 148, 230, 0.3), inset 0 1px 3px rgba(255,255,255,0.1)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (input.trim()) {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2), inset 0 1px 3px rgba(255,255,255,0.极)";
                    }
                  }}
                >
                  Send
                </button>
              </div>
              
              <div style={{
                textAlign: "center",
                fontSize: "0.75rem",
                opacity: 0.7,
                marginTop: "0.75rem"
              }}>
                Astra Buddy can make mistakes. Consider checking important information.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar toggle button when closed */}
      {!sidebarOpen && (
        <button 
          onClick极={toggleSidebar}
          style={{
            position: "fixed",
            left: "1rem",
            top: "90px",
            zIndex: 10,
            padding: "0.6rem",
            borderRadius: "0.5rem",
            border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(32, 33, 35, 0.8)",
            cursor: "pointer",
            color: "white",
            backdropFilter: "blur(10px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s",
            boxShadow: "inset 0 1px 3px rgba(0,0,0,0.2)"
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "rgba(52, 53, 65, 0.9)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "极 rgba(32, 33, 35, 0.8)";
          }}
        >
          <span style={{ fontSize: "1.2rem" }}>☰</span>
        </button>
      )}

      {/* Voice listening overlay */}
      {isListening && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.8)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "极 center",
          zIndex: 999,
          backdropFilter: "blur(10px)"
        }}>
          <div style={{
            background: "rgba(32, 33, 35, 0.9)",
            borderRadius: "1rem",
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1.5rem",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5), inset 0 1px 3px rgba(255,255,255,0.1)"
          }}>
            <p style={{ fontSize: "1.5rem", margin: 0 }}>Listening...</p>
            <div style={{ display: "flex", gap: "5px", alignItems: "flex-end", height: "50px" }}>
              {[...Array(5)].map((_, i) => (
                <div key={i} style={{
                  width: "10px",
                  height: `${10 + Math.random() * 40}px`,
                  background: "linear-gradient(to top, #3494e6, #ec6ead)",
                  borderRadius: "5px",
                  animation: `wave 1s ease-in-out ${i * 0.1}s infinite alternate`,
                  boxShadow: "0 0 5px rgba(52, 148, 230, 0.5)"
                }}></div>
              ))}
            </div>
            <button 
              onClick={() => setIsListening(false)}
              style={{
                padding: "0.75rem 1.5rem",
                borderRadius: "0.75rem",
                border: "none",
                background: "rgba(236, 110, 173, 0.8)",
                color: "white",
                cursor: "pointer",
                fontWeight: "500",
                transition: "all 0.2s",
                backdropFilter: "blur(10px)",
                boxShadow极: "0 4px 8px rgba(0,0,0,0.2), inset 0 1px 3px rgba(255,255,255,0.1)"
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(236, 110, 173, 1)";
                e.target.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "rgba(236, 110, 173, 0.8)";
                e.target.style.transform = "translateY(0)";
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes wave {
          0% { transform: scaleY(0.3); }
          50% { transform: scaleY(1); }
          100% { transform: scaleY(0.3); }
        }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); opacity: 0.6; }
        }
        @keyframes particle {
          0% { transform: translateY(0); opacity: 0.5; }
          50% { transform: translateY(-5px); opacity: 1; }
          100% { transform: translateY(0); opacity: 0.5; }
        }
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}