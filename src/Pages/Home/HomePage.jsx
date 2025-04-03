import React, { useState } from "react";
import LoginForm from "../Auth/LoginForm";
import Dashboard from "./Dashboard";
import SignupForm from "../Auth/SignupForm";

const HomePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };
  const handleSignup = () => {
    setIsSignupOpen(true);
  };

  return (
    <div className="relative min-h-screen">
      {/* Dashboard is always rendered but blurred when not logged in */}
      <div className={isLoggedIn ? "" : "filter blur-md pointer-events-none"}>
        <Dashboard />
      </div>
      
      {/* Login form overlay when not logged in */}
      {!isLoggedIn && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-10">
          <LoginForm onLogin={handleLogin} />
          
        </div>
      )}
    </div>
  );
};

export default HomePage;