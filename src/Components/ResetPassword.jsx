import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useParams, useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const ResetPassword = () => {
    
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const uid = params.get('uid');
    const token = params.get('token');
    const navigate = useNavigate()
    console.log("UID:", uid, "Token:", token); 
    useEffect(() => {
        // Optionally, verify token and uid (for example, if you have a backend check)
        console.log(uid, token); // Use this for testing purposes or backend validation
    }, [uid, token]);
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const response = await axios.post(`${API_BASE_URL}password-reset-confirm/`, {
                new_password: newPassword,
                confirm_password: confirmPassword,
                uid: uid,
                token: token,
            });
            if (response.status === 200) {
                setSuccess("Password has been reset successfully.");
                setError(null);
                // Redirect user after successful password reset
                navigate('/'); // Redirect to login page
            } else {
                setError("Password reset failed. Please try again.");
                setSuccess(null);
            }
        } catch (err) {
            console.error(err.response || err); 
            setError('Failed to reset the password. Please try again.');
            setSuccess(null);
        }
    };
    console.log("Data being sent:", {
        new_password: newPassword,
        confirm_password: confirmPassword,
        uid: uid,
        token: token
    });

  return (
    <div className="flex items-center justify-center min-h-screen">
             <div className="w-full max-w-md bg-blue-100 p-6 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-center mb-4">Reset Password</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter your new password"
                    required
                    className="w-full p-2 border border-gray-300 rounded"
                />
                 <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
                >
                    Reset Password
                </button>
            </form>
            {success && <p className="text-green-600 text-center mt-4">{success}</p>}
            {error && <p className="text-red-600 text-center mt-4">{error}</p>}
        </div>
        </div>
  )
}

export default ResetPassword