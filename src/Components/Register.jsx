import React,{useState} from 'react'
import axios from 'axios';
import {useForm} from "react-hook-form"
import { useNavigate } from 'react-router-dom'; 
import loginImage from '../images/freepik__upload__40779.jpeg';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();


  const onSubmit = async (formData) => {
    console.log(formData); 

    // Validation: Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

     try {
        const response = await axios.post(`${API_BASE_URL}register/`, {
          email:formData.email,
          phone_number:formData.phoneNumber,
          password:formData.password,
        });
        console.log("Registration success:", response.data);
        setSuccessMessage(response.data.message);
        reset();
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
      
      {/* {error && <div className="text-red-500 mb-4">{error}</div>}
      {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>} */}
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            {...register("email",{
              required:"Email is Required",
              pattern :{
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: "Invalid email address",
              },
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="phoneNumber" className="block text-gray-700">Phone Number</label>
          <input
            type="text"
            id="phoneNumber"
            {...register("phoneNumber",{
              required:"Phone Number is required",
              pattern:{
                value: /^[0-9]+$/,
                message: "Phone number must contain only numbers",
              },
              minLength:{
                value: 10,
                message: "Phone number must be at least 10 digits",
              },
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
            {errors.phoneNumber && <p className="text-red-500">{errors.phoneNumber.message}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            {...register("password",{
              required:"Password is required",
              minLength:{
                value:8,
                message:"Password must be atleast 8 characters",
              },
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
           {errors.password && <p className="text-red-500">{errors.password.message}</p>}
        </div>

        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block text-gray-700">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            {...register("confirmPassword", {
              required: "Please confirm your password",
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
           {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}
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