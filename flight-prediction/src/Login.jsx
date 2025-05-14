import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login({onLogin}) {
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/login', loginData);
      if (response.status === 200 && response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        if(onLogin)onLogin()
        navigate('/predict');
      } else {
        // Display error message if credentials are invalid
        setError(response.data.error || 'Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      if (error.response) {
        // Display server-side error message if available
        setError(error.response.data.error || 'Login failed.');
      } else {
        // Display a generic error if there's a network issue
        setError('Network error. Please check your connection or server.');
      }
    }
  };

  return (
    <div className="bg-gray-100 
    bg-gradient-to-r from-[#B2FEFA] to-[#0ED2F7]
    min-h-screen flex items-center justify-center py-10">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md space-y-6">
        <h1 className="text-2xl font-semibold text-center">Login</h1>
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold">Username</label>
            <input
              type="text"
              name="username"
              value={loginData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold">Password</label>
            <input
              type="password"
              name="password"
              value={loginData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
          >
            Login
          </button>
        </form>

        <div className="text-center text-sm">
          Don't have an account?{' '}
          <a href="/signin" className="text-blue-600 hover:underline">
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login;
