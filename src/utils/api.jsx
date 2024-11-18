import axios from 'axios';


const token = localStorage.getItem('token');
console.log("token",token)

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const fetchImages = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}images/`, {
      headers: {
          'Authorization': `Bearer ${token}`,
      },
  });
  return response.data;
  } catch (error) {
    console.error('Error fetching images:', error);
    
  }
};

export const getLastUploadDate = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}images/last-upload-date/`, {
      headers: {
          'Authorization': `Bearer ${token}`,
      },
  });
    return response.data.last_upload_date; // Assuming API returns { "last_upload_date": "..." }
  } catch (error) {
    console.error('Error fetching last upload date:', error);
    return null;
  }
};
export const bulkUploadImages = async (formData) => {
    try {
      const response = await fetch(`${API_BASE_URL}images/upload/`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Token if needed
        },
      });
  
      if (response.ok) {
        const result = await response.json();
        return { success: true, message:'Images uploaded successfully' };  // Return success message
      } else {
        const errorResponse = await response.json(); // Parse error details if available
        const errorMessage = errorResponse.message || 'Failed to upload images';
        throw new Error(errorMessage);  
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      return { success: false, message: 'Error uploading images' };  // Return error message
    }
  };