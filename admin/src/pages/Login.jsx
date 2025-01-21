/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import React from 'react';

const Login = ({ token, setToken }) => {
  const navigate = useNavigate();
  const [currentState, setCurrentState] = useState('login');
  const [showPassword, setShowPassword] = useState(false); // Password visibility toggle
  const [passwordStrength, setPasswordStrength] = useState(''); // Password strength
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phno: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    phno: '',
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Update password strength when password field changes
    if (name === 'password') {
      evaluatePasswordStrength(value);
    }
  };

  // Validate the form inputs
  const validateForm = () => {
    let valid = true;
    const newErrors = {
      name: '',
      email: '',
      password: '',
      phno: '',
    };

    if (!formData.name ) {
      newErrors.name = 'Name is required';
      valid = false;
    }
    else if (!/^[A-Za-z\s]+$/.test(formData.name)) { // Regex to allow only alphabets and spaces
      newErrors.name = 'Name must contain only letters and spaces';
      valid = false;
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      valid = false;
    }

    if (!formData.phno) {
      newErrors.phno = 'Phone number is required';
      valid = false;
    } else if (!/^\d{10}$/.test(formData.phno)) { // Validate phone number
      newErrors.phno = 'Phone number must be digits';
      valid = false;
    }else if(formData.phno<10)
    {
      newErrors.phno="Phone number is must be 10 digits"
      valid=false
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // Evaluate password strength
  const evaluatePasswordStrength = (password) => {
    const lengthCriteria = password.length >= 8;
    const numberCriteria = /\d/.test(password);
    const specialCharacterCriteria = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    let strength = '';
    if (lengthCriteria && numberCriteria && specialCharacterCriteria) {
      strength = 'Strong';
    } else if (lengthCriteria && numberCriteria) {
      strength = 'Medium';
    } else {
      strength = 'Weak';
    }
    setPasswordStrength(strength);
  };

  // Handle form submission (Login/Signup)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (currentState === 'signUp') {
      if (validateForm()) {
        try {
          //sending formdata to back end server
          const response = await fetch('http://localhost:4000/api/v1/admin-register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
            mode: 'cors',
          });

          const result = await response.json();

          if (result.success) {
            setToken(result.token);
            setCurrentState("login");
            localStorage.setItem("token", result.token);
            toast.success('Registered successfully');
            navigate('/user')
          } else {
            toast.error(result.message || 'Something went wrong');
          }
        } catch (error) {
          toast.error('Error: ' + (error.message || 'An unknown error occurred'));
        }
      }

      // Reset the form
      setFormData({
        name: '',
        email: '',
        password: '',
        phno: '',
      });
    } else if (currentState === 'login') {
      try {
        //sendating email,password to backend
        const response = await fetch('http://localhost:4000/api/v1/admin-login', {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
          mode: 'cors',
        });

        const result = await response.json();

        if (result.success) {
          setToken(result.token);
          localStorage.setItem('token', result.token);
          toast.success('Login successful');
          navigate('/');
        } else {
          toast.error(result.message || 'Something went wrong');
        }
      } catch (error) {
        toast.error('Error: ' + (error.message || 'An unknown error occurred'));
      }
    }
  };

  // Redirect to home page if token is already set
  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token, navigate]);

  return (
    <div className="flex justify-center align-center mt-5 m-auto">
      <form onSubmit={handleSubmit} className="mx-auto">
        {currentState !== 'login' && (
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
              Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              autoComplete="name"
            />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            autoComplete="email"
          />
          {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
        </div>

        {currentState !== 'login' && (
          <div className="mb-4">
            <label htmlFor="phno" className="block text-sm font-semibold text-gray-700">
              Phone no:
            </label>
            <input
              type="tel"
              id="phno"
              name="phno"
              value={formData.phno}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              pattern="\d{10}"
              autoComplete="tel"
            />
            {errors.phno && <p className="text-sm text-red-500 mt-1">{errors.phno}</p>}
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
            Password:
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              autoComplete={currentState === 'login' ? 'current-password' : 'new-password'}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prevState) => !prevState)}
              className="absolute top-1/2 right-4 transform -translate-y-1/2"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
          <p className="text-sm mt-2 text-gray-500">Password strength: {passwordStrength}</p>
        </div>

        <div>
          <button
            type="submit"
            className="w-full bg-red-200 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {currentState === 'login' ? 'Login' : 'Sign Up'}
          </button>
        </div>

        <div className="mt-4 text-center">
          {currentState === 'login' ? (
            <>
              <div className="flex gap-20">
                <p className="text-sm">If you are not a user?</p>
                <button
                  type="button"
                  onClick={() => setCurrentState('signUp')}
                  className="text-primary hover:underline"
                >
                  Sign up
                </button>
                <Link to="/forgot-password">Forgot Password</Link>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm">Already have an account?</p>
              <button
                type="button"
                onClick={() => setCurrentState('login')}
                className="text-primary hover:underline"
              >
                Login
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default Login;
