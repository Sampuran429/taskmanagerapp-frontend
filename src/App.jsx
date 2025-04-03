import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import LoginForm from "./Pages/Auth/LoginForm";
import SignupForm from "./Pages/Auth/SignupForm";
import DashBoard from "./Pages/Home/DashBoard";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAuth = () => {
    setIsAuthenticated(true);
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            isAuthenticated ? 
              <Navigate to="/dashboard" /> :
              <div className="relative min-h-screen">
                <div className="filter blur-md pointer-events-none">
                  <DashBoard />
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-10">
                  <LoginForm onLogin={handleAuth} />
                </div>
              </div>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated ? 
              <DashBoard /> :
              <div className="relative min-h-screen">
                <div className="filter blur-md pointer-events-none">
                  <DashBoard />
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-10">
                  <LoginForm onLogin={handleAuth} />
                </div>
              </div>
          } 
        />
        <Route 
          path="/login" 
          element={
            isAuthenticated ? 
              <Navigate to="/dashboard" /> :
              <div className="relative min-h-screen">
                <div className="filter blur-md pointer-events-none">
                  <DashBoard />
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-10">
                  <LoginForm onLogin={handleAuth} />
                </div>
              </div>
          } 
        />
        <Route 
          path="/signup" 
          element={
            isAuthenticated ? 
              <Navigate to="/dashboard" /> :
              <div className="relative min-h-screen">
                <div className="filter blur-md pointer-events-none">
                  <DashBoard />
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-10">
                  <SignupForm onSignup={handleAuth} />
                </div>
              </div>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;