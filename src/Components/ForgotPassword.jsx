import React,{useState}from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const  ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState('');
    const navigate=useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${API_BASE_URL}password-reset/`, { email });
            setSuccess('Password reset link sent to your email.');
            setError(null);
        } catch (err) {
            setError('Failed to send password reset link. Please try again.');
            setSuccess(null);
        }
    };


  return (
    <div className="flex items-center mt-10 justify-center min-h-screen ">
            <div className="w-full max-w-md bg-blue-100 p-6 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-blue-700 mb-4">Request Password Reset</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full p-2 border border-gray-300 rounded"
                />
                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
                >
                    Send Reset Link
                </button>
            </form>
            {success && <p className="text-green-600 text-center mt-4">{success}</p>}
            {error && <p className="text-red-600 text-center mt-4">{error}</p>}
        </div>
        </div>
  )
}

export default ForgotPassword