import React, { useState } from "react";
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
  const googleProvider = new GoogleAuthProvider();
  const navigate = useNavigate();

  const adduser = async () => {
    api.post('/api/user', {
      headers: {
        'Content-Type': 'application/json'
      }})
    .then(response => {
      const data = response.data;
      console.log(data)
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
        setSuccess("User registered successfully!");
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
        setSuccess("User logged in successfully!");
      }
      console.log("User:", userCredential.user);
      adduser()
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setSuccess("");
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      console.log("Google User:", userCredential.user);
      setSuccess("User logged in with Google!");
      adduser()
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-[#3a3a3a] to-[#1c1c1c] flex items-center justify-center px-4 py-8 overflow-hidden">
      {/* Developer-themed Background */}
      <div className="absolute inset-0">
        {/* Code Pattern Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 right-0 overflow-hidden whitespace-nowrap font-mono text-[#06c270] text-xs">
            &lt;DevMatch/&gt; {"{"}matchmaking_for_devs{"}"} &lt;code&gt;build_something_amazing&lt;/code&gt;
          </div>
          <div className="absolute bottom-0 left-0 right-0 overflow-hidden whitespace-nowrap font-mono text-[#06c270] text-xs transform rotate-180">
            while(coding) {"{"} find_your_match(); {"}"}
          </div>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#2b2b2b]/50 to-transparent"></div>
        
        {/* Brand Elements */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-center">
          <div className="text-4xl font-bold bg-gradient-to-r from-[#06c270] to-[#08b864] text-transparent bg-clip-text">DevMatch</div>
          <div className="text-[#7d7d7d] text-sm mt-1">Where Developers Connect</div>
        </div>
      </div>

      <div className="w-full max-w-md bg-[#2b2b2b] shadow-2xl rounded-2xl overflow-hidden relative z-10">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#06c270] to-[#08b864] p-6 text-center">
          <h2 className="text-3xl font-bold text-white">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </h2>
          <p className="text-white/80 mt-2">
            {isSignUp
              ? "Sign up to start your journey"
              : "Log in to continue"}
          </p>
        </div>

        {/* Form Container */}
        <div className="p-6 space-y-6 text-[#e1e1e1]">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#3a3a3a] border border-[#4a4a4a] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06c270] transition duration-300 ease-in-out placeholder-[#7d7d7d]"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 absolute right-4 top-1/2 transform -translate-y-1/2 text-[#7d7d7d]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>

            <div className="relative">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#3a3a3a] border border-[#4a4a4a] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06c270] transition duration-300 ease-in-out placeholder-[#7d7d7d]"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 absolute right-4 top-1/2 transform -translate-y-1/2 text-[#7d7d7d]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#06c270] to-[#08b864] text-white py-3 rounded-lg hover:opacity-90 transition duration-300 ease-in-out transform hover:scale-[1.02] shadow-lg"
            >
              {isSignUp ? "Sign Up" : "Log In"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center justify-center space-x-4">
            <div className="h-px bg-[#4a4a4a] flex-grow"></div>
            <span className="text-[#7d7d7d] text-sm">or</span>
            <div className="h-px bg-[#4a4a4a] flex-grow"></div>
          </div>

          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center space-x-3 py-3 border border-[#4a4a4a] rounded-lg hover:bg-[#3a3a3a] transition duration-300 ease-in-out"
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
            <span className="text-[#e1e1e1]">Continue with Google</span>
          </button>

          {/* Toggle Sign Up/Login */}
          <div className="text-center">
            <button
              onClick={() => setIsSignUp((prev) => !prev)}
              className="text-[#06c270] hover:text-[#08b864] text-sm transition duration-300 ease-in-out"
            >
              {isSignUp
                ? "Already have an account? Log in"
                : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>

        {/* Status Messages */}
        {success && (
          <div className="bg-[#292929] border-l-4 border-[#06c270] text-[#06c270] p-4 mx-6 mb-4 rounded-lg">
            <p>{success}</p>
          </div>
        )}
        {error && (
          <div className="bg-[#3a1a1a] border-l-4 border-[#e5554f] text-[#e5554f] p-4 mx-6 mb-4 rounded-lg">
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthForm;