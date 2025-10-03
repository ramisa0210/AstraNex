import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../utils/api";

export default function AuthForm({ type, closeModal }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const { name, email, password } = formData;

  // ✅ If already logged in, redirect to dashboard
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/home");
    }
  }, [navigate]);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (type === "register") {
        res = await registerUser(name, email, password);
        navigate("/login"); // after register → go to login
      } else {
        res = await loginUser(email, password);
        localStorage.setItem("token", res.data.token);
        navigate("/dashboard"); // after login → dashboard
      }
    } catch (err) {
      setError(err.response?.data?.msg || "Server error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 w-full max-w-md relative">
        <button
          className="absolute top-3 right-3 text-white text-2xl font-bold"
          onClick={closeModal}
        >
          ×
        </button>
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          {type === "register" ? "Create Account" : "Login"}
        </h2>

        {error && (
          <p className="bg-red-500 text-white text-center p-2 rounded mb-4">
            {error}
          </p>
        )}

        <form onSubmit={onSubmit}>
          {type === "register" && (
            <div className="mb-4">
              <label className="block text-white text-sm font-bold mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={onChange}
                placeholder="Name"
                className="w-full p-2 rounded-lg border border-white/30 bg-white/10 text-white"
                required
              />
            </div>
          )}
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              placeholder="Email"
              className="w-full p-2 rounded-lg border border-white/30 bg-white/10 text-white"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-white text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              placeholder="Password"
              minLength="6"
              className="w-full p-2 rounded-lg border border-white/30 bg-white/10 text-white"
              required
            />
          </div>

          <button className="w-full py-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold hover:from-indigo-500 hover:to-purple-500 mb-4">
            {type === "register" ? "Register" : "Login"}
          </button>

          <div className="text-center">
            <a
              href={type === "register" ? "/login" : "/register"}
              className="inline-block text-sm font-bold text-blue-400 hover:text-blue-600"
            >
              {type === "register"
                ? "Already have an account? Login"
                : "Don't have an account? Register"}
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
