import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import GetStarted from "./pages/GetStarted";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AIBuddy from "./pages/ai-buddy";
import Games from "./pages/Games";
import SolarSystem from "./pages/SolarSystem";
import Impact from "./pages/Impact/Impact";
import Asteroid from "./pages/Asteroid";
import Statistics from "./pages/Statistics";
function App() {
  const location = useLocation();
  const isGetStartedPage = location.pathname === "/";

  return (
    <div className="flex flex-col min-h-screen">
      {!isGetStartedPage && <Navbar />}

      <main className={`flex-1 ${!isGetStartedPage ? "mt-[80px]" : ""}`}>
        <Routes>
          <Route path="/" element={<GetStarted />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/ai-buddy" element={<AIBuddy />} />
          <Route path="/games" element={<Games />} />
          <Route path="/solar-system" element={<SolarSystem />} />
          <Route path="/impact" element={<Impact />} />
          <Route path="/asteroid" element={<Asteroid />} />
          <Route path="/statistics" element={<Statistics />} />
        </Routes>
      </main>

      {!isGetStartedPage && <Footer />}
    </div>
  );
}

export default App;