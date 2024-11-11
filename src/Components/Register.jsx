import React,{useState} from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import loginImage from '../images/freepik__upload__40779.jpeg';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation: Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    const formData = {
        email: email,
        phone_number: phoneNumber,
        password: password
     };

     try {
        const response = await axios.post(`${API_BASE_URL}register/`, formData);
        console.log("Registration success:", response.data);
        setSuccessMessage(response.data.message);
        setEmail('');
        setPhoneNumber('');
        setPassword('');
        setConfirmPassword('');
        setError('');
        navigate('/');
        // Proceed with next steps (like redirect or showing success message)
    } catch (error) {
        if (error.response && error.response.data) {
            setError('Registration failed. Please try again.');
            console.log("Registration failed:", error.response.data);
        }
    }
  };

  return (
    <div className="flex items-center justify-end min-h-screen  bg-cover bg-center bg-no-repeat"style={{ backgroundImage: `url(${loginImage})` }}>
    <div className="p-8 rounded-lg shadow-lg w-full md:w-1/2 max-w-sm ">
      <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
      
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="phoneNumber" className="block text-gray-700">Phone Number</label>
          <input
            type="text"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block text-gray-700">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Register
        </button>
      </form>

      <p className="mt-4 text-center text-gray-600">
        Already have an account? <a href="/" className="text-indigo-600 hover:text-indigo-700">Login here</a>
      </p>
    </div>
  </div>
  )
}

export default Register