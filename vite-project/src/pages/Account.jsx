/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Account = ({ token, setToken }) => {
  const navigate = useNavigate();//use navigate
  const [currentState, setCurrentState] = useState('login'); // condition login
  const [showPassword, setShowPassword] = useState(false); // Password visibility toggle
  const [passwordStrength, setPasswordStrength] = useState(''); // Password strength
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phno: '',
  });// formdata used in input feilds

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    phno: '',
  });//formdata useState for error handling

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;  //formadata onChange handler
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Update password strength when password field changes
    if (name === 'password') {
      evaluatePasswordStrength(value); //passing value to to check password strength
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
    };// validating the form matching the required fields

    if (!formData.name) {// checking name feild is empty or not
      newErrors.name = 'Name is required';
      valid = false;
    }
    else if (!/^[A-Za-z\s]+$/.test(formData.name)) { // Regex to allow only alphabets and spaces
      newErrors.name = 'Name must contain only letters and spaces';
      valid = false;
    }


    if (!formData.email) {
      newErrors.email = 'Email is required'; //checking email is empty or not
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {//Regrex to allow only alphabets and spaces
      newErrors.email = 'Email is invalid';
      valid = false;
    }

    if (!formData.phno) {
      newErrors.phno = 'Phone number is required';//checking phno is empty or not
      valid = false;
    } else if (!/^\d{10}$/.test(formData.phno)) { // Validate phone number
      newErrors.phno = 'Phone number must be exactly 10 digits';
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';//checking password is empty  or not
      valid = false;
    } else if (formData.password.length < 6) {//checking password length is <6
      newErrors.password = 'Password must be at least 6 characters long';
      valid = false;
    }

    setErrors(newErrors); //setting errors if not math wuth condition
    return valid;
  };

  // Evaluate password strength
  const evaluatePasswordStrength = (password) => {//passwors stength function
    const lengthCriteria = password.length >= 8;//checking length of password is >=8
    const numberCriteria = /\d/.test(password);//checking criteria of number
    const specialCharacterCriteria = /[!@#$%^&*(),.?":{}|<>]/.test(password);//checking condition not to allow  special characters

    let strength = '';
    if (lengthCriteria && numberCriteria && specialCharacterCriteria) {//using and operation then checking password matched required feilds
      strength = 'Strong';
    } else if (lengthCriteria && numberCriteria) {//using & checking checking feilds matched required criteria
      strength = 'Medium';
    } else {
      strength = 'Weak';
    }
    setPasswordStrength(strength);
  };

  // Handle form submission (Login/Signup)
  const handleSubmit = async (e) => {// submitting the form
    e.preventDefault();

    if (currentState === 'signUp') {//sign up fetching
      if (validateForm()) {
        try {
          const response = await fetch('http://localhost:4000/v1/ecommerce/api/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),//passing the form data in json stringify
            mode: 'cors',
          });

          const result = await response.json();//getting the response in json format

          if (result.success) { //checking result is success 
            setToken(result.token); //setting the token
            setCurrentState("login");//performing condition rendering
            localStorage.setItem("token", result.token);//storing token in local storage
            toast.success('Registered successfully');//toast notification
            navigate('/user')//navigating the profilke to login page
          } else {
            toast.error(  'Something went wrong');// if result fails error message
          }
        } catch (error) {
          toast.error('Error: ' + (error.message || 'An unknown error occurred'));// error catch handling
        }
      }

      // Reset the form
      setFormData({
        name: '',
        email: '',
        password: '',
        phno: '',
      });
    } else if (currentState === 'login') {// login api using post.We are senting (email,password) to backend
      try {
        const response = await fetch('http://localhost:4000/v1/ecommerce/api/login', {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify({
            email: formData.email,   //passing the formdata in json stringify
            password: formData.password,
          }),
          mode: 'cors',
        });

        const result = await response.json();

        if (result.success) {//getting the response in json format
          setToken(result.token);//setting the token
          localStorage.setItem('token', result.token);//setting the token
          toast.success('Login successful');//toast notification
          navigate('/');//navigating to the homepage
        } else {
          toast.error(result.message || 'Something went wrong');// if result fails errro message
        }
      } catch (error) {
        toast.error('Error: ' + (error.message || 'An unknown error occurred'));//catching the error
      }
    }
  };

  // Redirect to home page if token is already set
  useEffect(() => {// conditional token rendering & rendering the hook only once depending on dependencies
    if (token) {// it token ==true
      navigate('/');//navigate to homepage
    }
  }, [token, navigate]);//dependencies

  return (
    <div className="flex justify-center align-center mt-5 m-auto">
      <form onSubmit={handleSubmit} className="mx-auto">
        {/* conditional rendering stars here */}
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
              type={showPassword ? 'text' : 'password'} // according to user triggering we hiding or showing password
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
            className="w-full bg-red-200 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                  onClick={() => setCurrentState('signUp')}// triggering the sign up function
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
                onClick={() => setCurrentState('login')}// triggerig the login
                className="text-primary hover:underline"
              >
                Login
              </button>
            </>
          )}
        </div>
        {/* conditional rendering ends here */}
      </form>
    </div>
  );
};

export default Account;
