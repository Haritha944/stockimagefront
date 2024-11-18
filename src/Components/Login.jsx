import React, { useState ,useEffect} from 'react'
import axios from 'axios';
import loginImage from '../images/freepik__upload__23414.jpeg';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';




const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const Login = () => {
    const [email,setEmail] = useState('');
    const [password,setPassword]=useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
  
    useEffect (()=>{
      const token=localStorage.getItem("token");
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          console.log("Decoded token:", decodedToken);
          if (decodedToken.exp * 1000 < Date.now()) {
            console.log("Token is expired");
            localStorage.removeItem("token"); // Clear expired token
            navigate("/"); // Redirect to login
          }
        } catch (error) {
          console.error("Invalid token:", error);
          localStorage.removeItem("token"); 
          navigate("/"); 
        }
      }  else {
        console.log("No token found. Redirecting to login.");
        navigate("/"); 
      }
    },[navigate]);


    const handleSubmit =async (e) => {
        e.preventDefault();
        console.log('Email:', email);
        console.log('Password:', password);
        try {
            const response = await axios.post(`${API_BASE_URL}login/`, {
              email,
              password,
            });
      
            console.log('Login successful:', response.data);
            console.log('Login token:', response.data.tokens.access);
            localStorage.setItem('token', response.data.tokens.access);
             navigate('/dashboard');
      
          } catch (err) {
            setError('Login failed. Please check your credentials and try again.');
            console.error('Error logging in:', err);
          } 
      };
      const handleClick = () => {
        navigate('/password-reset'); // Replace with the actual route for the forgot password page
      };
  return (
    <div className="flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat"  style={{ backgroundImage: `url(${loginImage})` }}>
    {/* Left Side - Image */}
    <div className="hidden md:block w-1/2">
      
    </div>

    {/* Right Side - Login Form */}
    <div className="w-full md:w-1/2 flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-6 p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Login to your account
          </h2>

          {/* Email Input */}
          <div className="space-y-2">
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
            />
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your password"
            />
          </div>
          {error && (
              <div className="text-sm text-red-600 mt-2">
                {error}
              </div>
            )}
          {/* Remember me and Forgot password */}
          <div className="flex items-center justify-between">
            
            <button
              type="button"
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
              onClick={handleClick} >
              Forgot password?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm transition duration-150"
          >
            Sign in
          </button>
          <p>Not  have an account? <a href="/register" className="text-indigo-600 hover:text-indigo-700">Sign UP</a></p>
        </form>
      </div>
    </div>
  </div>
  );
};

export default Login