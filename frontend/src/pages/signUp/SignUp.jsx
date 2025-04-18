/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bgImg from "./Register-Background.png";
import authService from "../../services/authService";
import { Typography } from "@mui/material";

const regEmail =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const SignUp = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const [error, setError] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true);

  useEffect(() => {
    const isAuthenticated = authService.isAuthenticated();
    if (isAuthenticated) {
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Validate email
    if (!regEmail.test(inputs.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Validate password match
    if (inputs.password !== inputs.confirmPassword) {
      setPasswordMatch(false);
      setError("Passwords do not match.");
      return;
    }
    setPasswordMatch(true);

    try {
      const userData = {
        name: inputs.name,
        email: inputs.email,
        password: inputs.password
      };
      
      await authService.register(userData);
      navigate("/");
    } catch (error) {
      setError(error.error || 'Registration failed. Please try again.');
    }
  };

  return (
    <div
      className="min-h-screen py-40"
      style={{ backgroundImage: "linear-gradient(115deg, #9F7AEA, #FEE2FE)" }}
    >
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row w-10/12 lg:w-8/12 bg-white rounded-xl mx-auto shadow-lg overflow-hidden">
          <div
            className="w-full lg:w-1/2 flex flex-col items-center justify-center p-12 bg-no-repeat bg-cover bg-center"
            style={{ backgroundImage: `url(${bgImg})` }}
          >
            <h1 className="text-white text-3xl mb-3">Welcome</h1>
            <div>
              <p className="text-white">
                to our E-commerce website{" "}
                <a href="#" className="text-purple-500 font-semibold">
                  Learn more
                </a>
              </p>
            </div>
          </div>
          <div className="w-full lg:w-1/2 py-16 px-12">
            <h2 className="text-3xl mb-4">Register</h2>
            <p className="mb-4">
              Create your account. It's free and only takes a minute
            </p>
            <form action="" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-5">
                <input
                  type="text"
                  placeholder="Firstname"
                  name="name"
                  onChange={handleChange}
                  className="border border-gray-400 py-1 px-2"
                  required
                />
                <input
                  type="text"
                  placeholder="Surname"
                  className="border border-gray-400 py-1 px-2"
                />
              </div>
              <div className="mt-5">
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  onChange={handleChange}
                  className="border border-gray-400 py-1 px-2 w-full"
                  required
                />
              </div>
              <div className="mt-5">
                <input
                  type="password"
                  name="password"
                  onChange={handleChange}
                  placeholder="Password"
                  className="border border-gray-400 py-1 px-2 w-full"
                  required
                  minLength={6}
                />
              </div>
              <div className="mt-5">
                <input
                  type="password"
                  name="confirmPassword"
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  className={`border ${!passwordMatch ? 'border-red-500' : 'border-gray-400'} py-1 px-2 w-full`}
                  required
                />
              </div>
              {error && (
                <Typography color="error" sx={{ mt: 1, fontSize: '0.8rem' }}>
                  {error}
                </Typography>
              )}
              <div className="mt-5">
                <input type="checkbox" className="border border-gray-400" required />
                <span>
                  I accept the{" "}
                  <a href="#" className="text-purple-500 font-semibold">
                    Terms of Use
                  </a>{" "}
                  &amp;{" "}
                  <a href="#" className="text-purple-500 font-semibold">
                    Privacy Policy
                  </a>
                </span>
              </div>
              <div className="mt-5">
                <button 
                  type="submit"
                  className="w-full bg-purple-500 py-3 text-center text-white hover:bg-purple-600 transition-colors"
                >
                  Register Now
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
