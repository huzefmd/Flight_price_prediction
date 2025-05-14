import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SignIn() {
  const [signInData, setSignInData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setSignInData({
      ...signInData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (signInData.password !== signInData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/signup', signInData);

      if (response.status === 201) {
        navigate('/login');
      } else {
        setError(response.data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error during sign-up:', error);
      if (error.response) {
        setError(error.response.data.error || 'Signup failed.');
      } else {
        setError('Network error. Please check your connection or server.');
      }
    }
  };

  return (
    <div className="bg-gray-100
    bg-gradient-to-r from-[#B2FEFA] to-[#0ED2F7]
     min-h-screen flex items-center justify-center py-10">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md space-y-6">
        <h1 className="text-2xl font-semibold text-center">Sign Up</h1>
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold">Username</label>
            <input
              type="text"
              name="username"
              value={signInData.username}
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
              value={signInData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={signInData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
          >
            Sign Up
          </button>
        </form>

        <div className="text-center text-sm">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
