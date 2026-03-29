import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {toast} from 'react-hot-toast'

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (username === "admin" && password === "Jitender71Chawla") {
     
      toast.success("Login successful")
      localStorage.setItem("isAuth", "true");
      navigate("/");
    } else {
      toast.error("Please enter a valid username and password");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-5">
      
      <div className="w-full max-w-md bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 space-y-5 shadow-2xl">
        
        {/* Heading */}
        <h2 className="text-2xl font-semibold text-center text-white tracking-wide">
          Welcome Jitender
        </h2>

        {/* Username */}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full bg-white/5 border border-white/10 p-2 rounded-lg 
                     text-white placeholder-gray-400 
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-white/5 border border-white/10 p-2 rounded-lg 
                     text-white placeholder-gray-400 
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Button */}
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 transition py-2 rounded-lg font-medium text-white"
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default Login;