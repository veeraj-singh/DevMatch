import React, { useState, useEffect } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios_instance";
import { auth } from "../utils/firebase";

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [codeIndex, setCodeIndex] = useState(0);
  const googleProvider = new GoogleAuthProvider();
  const navigate = useNavigate();

  const codeSnippets = [
    'const connect = async () => { await DevMatch.init(); }',
    'function DevMatch() { return <PerfectMatch />; }',
    'while(true) { code.write(); coffee.drink(); }',
    'git commit -m "Found perfect dev match! 🚀"',
    'npm install perfect-dev-partner@latest'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCodeIndex((prev) => (prev + 1) % codeSnippets.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const adduser = async () => {
    api.post('/api/user', {
      headers: {
        'Content-Type': 'application/json'
      }})
    .then(response => {
      const data = response.data;
      if (data.firstTime) {
        navigate('/onboarding');
      } else {
        navigate('/dashboard');
      }
    })
    .catch(error => {
      console.error('Error getting ID token:', error);
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      let userCredential;
      if (isSignUp) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        setSuccess("Successfully initialized dev environment! 🚀");
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
        setSuccess("Authentication successful! Welcome back, developer! 💻");
      }
      adduser();
    } catch (err) {
      setError(`Error ${err.code}: ${err.message}`);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setSuccess("");
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      setSuccess("OAuth authentication successful! 🔐");
      adduser();
    } catch (err) {
      setError(`Authentication failed: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-[#3a3a3a] to-[#1c1c1c] flex items-center justify-center px-4 py-8 overflow-hidden">
      {/* Developer-themed Background */}
      <div className="absolute inset-0">
        {/* Code Pattern Background */}
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="font-mono text-[#06c270] text-xs whitespace-nowrap animate-slide"
              style={{ animationDelay: `${i * 0.3}s` }}
            >
              {codeSnippets[codeIndex]}
            </div>
          ))}
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#2b2b2b]/50 to-transparent"></div>
      </div>

      <div className="w-full max-w-md bg-[#2b2b2b] shadow-2xl rounded-2xl overflow-hidden relative z-10">
        {/* Terminal-like header */}
        <div className="bg-gradient-to-r from-[#06c270] to-[#08b864] p-6">
          <div className="flex items-center space-x-2 mb-4">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-white-500"></div>
              <div className="w-3 h-3 rounded-full bg-white-500"></div>
              <div className="w-3 h-3 rounded-full bg-white-500"></div>
            </div>
            <div className="flex-1 text-center font-mono text-white/80">
              {isSignUp ? "~/create-new-account" : "~/login"}
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white text-center">
            {isSignUp ? "$ npm init dev-account" : "$ ssh user@devmatch"}
          </h2>
          <p className="text-white/80 mt-2 text-center font-mono">
            {isSignUp ? "Installing dependencies..." : "Establishing secure connection..."}
          </p>
        </div>

        <div className="p-6 space-y-6 text-[#e1e1e1]">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative group">
              <input
                type="email"
                placeholder="email.address@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[#3a3a3a] border border-[#4a4a4a] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06c270] transition duration-300 ease-in-out placeholder-[#7d7d7d] font-mono"
                required
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-[#7d7d7d] group-hover:text-[#06c270] transition-colors duration-300">@</span>
              </div>
            </div>

            <div className="relative group">
              <input
                type="password"
                placeholder="****************"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#3a3a3a] border border-[#4a4a4a] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06c270] transition duration-300 ease-in-out placeholder-[#7d7d7d] font-mono"
                required
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-[#7d7d7d] group-hover:text-[#06c270] transition-colors duration-300">#</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#06c270] to-[#08b864] text-white py-3 rounded-lg hover:opacity-90 transition duration-300 ease-in-out transform hover:scale-[1.02] font-mono"
            >
              {isSignUp ? "$ create-account --init" : "$ login --auth"}
            </button>
          </form>

          <div className="flex items-center justify-center space-x-4">
            <div className="h-px bg-[#4a4a4a] flex-grow"></div>
            <span className="text-[#7d7d7d] font-mono">||</span>
            <div className="h-px bg-[#4a4a4a] flex-grow"></div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center space-x-3 py-3 border border-[#4a4a4a] rounded-lg hover:bg-[#3a3a3a] transition duration-300 ease-in-out group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 48 48"
            >
              <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
              <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
              <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
              <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
            </svg>
            <span className="text-[#e1e1e1] font-mono group-hover:text-[#06c270] transition-colors duration-300">
              auth --provider=google
            </span>
          </button>

          <div className="text-center">
            <button
              onClick={() => setIsSignUp((prev) => !prev)}
              className="text-[#06c270] hover:text-[#08b864] transition duration-300 ease-in-out font-mono text-sm"
            >
              {isSignUp ? "$ cd ../login" : "$ cd ../signup"}
            </button>
          </div>
        </div>

        {(success || error) && (
          <div className={`p-4 font-mono text-sm ${
            success ? "bg-[#292929] border-l-4 border-[#06c270] text-[#06c270]" : 
                     "bg-[#3a1a1a] border-l-4 border-[#e5554f] text-[#e5554f]"
          }`}>
            <pre className="whitespace-pre-wrap">
              {success ? `> ${success}` : `Error: ${error}`}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthForm;