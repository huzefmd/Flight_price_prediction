import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import Login from './Login';
import FlightPrice from './Flight_price';
import SignIn from './Signin';
import welcomeImage from './assets/bg-img.jpg'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const Home = () => (
    <div className="text-center mt-5">
      <h2 className="text-2xl font-semibold mb-2 ">Welcome to the Flight Price Predictor</h2>
      <img
        src={welcomeImage}
        alt="Welcome"
        className="mx-auto w-screen rounded shadow-lg "
      />
    </div>
  );

  return (
    <Router>
      {/* ✅ Navbar */}
      <nav className="bg-blue-600 p-4 text-right">
        <Link to="/" className="text-white text-lg mx-4">Home</Link>
        {isLoggedIn ? (
          <>
            <Link to="/predict" className="text-white text-lg mx-4">Flight Price Predictor</Link>
            <button
              onClick={handleLogout}
              className="text-white text-lg mx-4 hover:underline"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-white text-lg mx-4">Login</Link>
            <Link to="/signin" className="text-white text-lg mx-4">Sign In</Link>
          </>
        )}
      </nav>

      {/* ✅ Routes */}
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signin" element={<SignIn />} />
        <Route
          path="/predict"
          element={isLoggedIn ? <FlightPrice /> : <Login onLogin={handleLogin} />}
        />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
