import React,{useEffect,useState} from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import loginImage from '../images/1.png';
import {bulkUploadImages,fetchImages,getLastUploadDate } from '../utils/api'; // Import your API methods
import Modal from './Modal'
import ImageGallery from './ImageGallery';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Dashboard = () => {
    const navigate = useNavigate();
    const [images, setImages] = useState([]);
    const [lastUploadDate, setLastUploadDate] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [imageToDelete, setImageToDelete] = useState(null);
    const [titles, setTitles] = useState([]);
    const [isUploading, setIsUploading] = useState(false); 
    const [uploadStatus, setUploadStatus] = useState(''); 
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editImageFile, setEditImageFile] = useState(null);
    const [editImage, setEditImage] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [isRearrangeMode, setIsRearrangeMode] = useState(false);
   
  
    useEffect(() => {
      const initializeData = async () => {
        const fetchedImages = await fetchImages();
        const uploadDate = await getLastUploadDate();
  
        setImages(fetchedImages);
        setLastUploadDate(uploadDate);
      };
  
      initializeData();
    }, []);
    const handleLogout = () => {
      navigate('/');
    };
  
    const handleBulkUpload = async (event) => {
        event.preventDefault();
        const files =selectedFiles;  
        if (!files || files.length === 0) {
            setUploadStatus('Please select some images to upload.');
            return;
          }
        const titles = document.querySelectorAll(".image-title");
        
        // Ensure every file has a corresponding title before proceeding
        const allTitlesProvided = Array.from(titles).every((titleInput) => titleInput.value.trim() !== "");
        if (!allTitlesProvided) {
          setUploadStatus('Please provide a title for every image.');
          return;
        }
    
        const formData = new FormData();
        
        // Append each image and its title to the FormData
        for (let i = 0; i < files.length; i++) {
          formData.append('images', files[i]); // Append image
          formData.append('titles', titles[i].value); // Append title
        }
    
        setIsUploading(true);
        setUploadStatus('Uploading...');  // Set uploading state to true
    
        try {
          // Call bulk upload API
          const result = await bulkUploadImages(formData);
    
          if (result.success) {
            setUploadStatus(`${files.length} Images uploaded successfully!`);
            const fetchedImages = await fetchImages();
            setImages(fetchedImages);
        
        
             const uploadDate = await getLastUploadDate();
             setLastUploadDate(uploadDate);
             setSelectedFiles([]); 
             setTitles([]); 
             document.querySelectorAll(".image-title").forEach(input => input.value = '');
             setTimeout(()=>{
              setUploadStatus(null);
             },3000)
          } else {
            setUploadStatus('Error uploading images.');
          }
        } catch (error) {
            console.error('Error uploading images:', error);
            // Log detailed error message if available
            if (error.message) {
                setUploadStatus(`Error uploading images: ${error.message}`);
            } else {
                setUploadStatus('Error uploading images.');
            }
        }
    
        setIsUploading(false); // Reset uploading state
      };
    
      const handleFileChange = (event) => {
        const files = event.target.files;
        setSelectedFiles(files);
        setTitles(Array(files.length).fill(''));
      };
      const handleTitleChange = (e, index) => {
        const updatedTitles = [...titles];
        updatedTitles[index] = e.target.value;  // Update the title at the index
        setTitles(updatedTitles);
      };
      const openEditModal = (image) => {
        setEditImage(image);
        setEditTitle(image.title);
        setIsEditModalOpen(true);
      };
     
const handleSaveEdit = async () => {
  if (!editImage || !editImage.id) {
    console.error("Error: Image ID is missing");
    return; // Exit early if the ID is missing
  }
  const formData = new FormData();
  formData.append('title', editTitle);
  if (editImageFile) {
    formData.append('image', editImageFile); // Use the new image file selected
  }

  try {
    const response = await axios.put(`${API_BASE_URL}images/${editImage.id}/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    if (response.status === 200) {
      console.log("Image updated", response.data);
      //const updatedImage = editImageFile ? { ...response.data, image: URL.createObjectURL(editImageFile) } : response.data;
      const updatedImage = editImageFile 
        ? { ...response.data, image: URL.createObjectURL(editImageFile) } 
        : { ...response.data, image: editImage.image};
      setImages(images.map((img) => 
        img.id === editImage.id ? { ...img, title: editTitle, image: updatedImage.image } : img
      ));
      setIsEditModalOpen(false);
    }
  } catch (error) {
    console.error("Error updating image", error);
  }
};

      const handleDelete = async () => {
        if (imageToDelete) {
          try {
            
            const response = await axios.delete(`${API_BASE_URL}images/${imageToDelete}/`);
            if (response.status === 204) {
              // Update UI by removing the deleted image from the list
              setImages((prevImages) => prevImages.filter((img) => img.id !== imageToDelete));
            }
          } catch (error) {
            console.error("Error deleting image", error);
          }
        }
        setIsModalOpen(false); // Close modal after the operation
      };
      const handleCancelDelete = () => {
        setIsModalOpen(false); // Close modal without deleting
      }; 
      const handleDeleteClick = (image) => {
        setImageToDelete(image);
        setIsModalOpen(true); // Open modal to confirm deletion
      }; 
      const handleRearrangeClick = () => {
        setIsRearrangeMode(!isRearrangeMode);
      }; 
      
  return (
    <div className="min-h-screen flex flex-col bg-blue-100">
    {/* Navbar */}
    <nav className="bg-gradient-to-r from-indigo-700 to-fuchsia-500 text-white p-4 flex justify-between items-center">
    <img src={loginImage} alt="Logo" className="h-20 w-30 rounded-full" />
      <h2 className="text-2xl text- font-semibold ">Stock Image</h2>
      <div className="flex items-center space-x-4">
        <span className="text-2xl cursor-pointer">🖼️</span> {/* Gallery icon */}
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-4 rounded"
        >
          Logout
        </button>
      </div>
    </nav>

    <div className="flex flex-1">
      {/* Main Content */}
      <div className="flex-1 p-6 space-y-6">
        {/* Upload Section */}
        <div className="bg-white shadow-md p-4 rounded-md">
          <h3 className="text-xl font-semibold mb-2">Upload Image</h3>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="border border-gray-300 rounded-md p-2 w-full"
          />
          {selectedFiles.length > 0 && Array.from(selectedFiles).map((file, index) => (
              <div key={index} className="mt-2">
                <input
                  type="text"
                  value={titles[index] || ''} 
                  placeholder="Enter title"
                  onChange={(e) => handleTitleChange(e, index)}
                  className="border border-gray-300 rounded-md p-2 w-full image-title"
                />
              </div>
            ))}
              <button
              onClick={handleBulkUpload}
              disabled={isUploading}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-4 rounded mt-4"
            >
              {isUploading ? 'Uploading...' : 'Upload Images'}
            </button>
            {uploadStatus && (
              <p className="mt-2 text-red-500">{uploadStatus}</p>
            )}
        </div>

        {/* Gallery Section */}
        <div className="bg-white shadow-md p-4 rounded-md">
            <h3 className="text-xl font-semibold mb-4">Gallery</h3>
            <button
              onClick={handleRearrangeClick}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mb-4"
            >
               {isRearrangeMode ? 'Save Order' : 'Rearrange Images'}
            </button>
            <div className="content-section p-4">
              {isRearrangeMode ? (
                <div className="image-gallery-section">
                  {/* Image Gallery with Drag-and-Drop (Rearrange Mode) */}
                  <ImageGallery />
                </div>
              ) : (
        <div className="bg-white shadow-md p-4 rounded-md">
          <h3 className="text-xl font-semibold mb-4">Gallery</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((image,index) => (
              <div key={image.id || index} className="bg-gray-200 rounded-md overflow-hidden shadow-md group relative">
              
                <img  src={`${image.image}`} alt={image.title} className="w-full h-48 object-cover group-hover:opacity-80 transition-opacity duration-300" loading="lazy"
                />
                <p className="p-1 text-center text-sm font-semibold">{image.title}</p>
                <div className="absolute inset-0 bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-2 left-2 right-2 flex justify-between">
          <button
            onClick={() =>openEditModal(image)}
            className="bg-green-600 hover:bg-yellow-600 text-white py-1 px-3 rounded"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteClick(image.id)}
            className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
          >
            Delete
          </button>
        </div>
        </div>
              </div>
            ))}
          </div>
          </div>
          )}
        </div>
        

        <Modal
        isOpen={isModalOpen}
        message="Are you sure you want to delete this image?"
        onConfirm={handleDelete}
        onCancel={handleCancelDelete}
      />
        <Modal
            isOpen={isEditModalOpen}
            message="Edit Image"
            editMode={true}
            title={editTitle}
            onTitleChange={(e) => setEditTitle(e.target.value)}
            onFileChange={(e) => setEditImageFile(e.target.files[0])}
            onConfirm={handleSaveEdit}
            onCancel={() => setIsEditModalOpen(false)}
          />
      </div>
      </div>

      {/* Sidebar */}
      <aside className="w-64 bg-blue-200 p-4">
        <h3 className="text-xl font-semibold mb-2">Last Uploaded</h3>
        <p className="text-gray-700">
          {lastUploadDate ? new Date(lastUploadDate).toLocaleString() : 'No uploads yet'}
        </p>
      </aside>
    </div>
  </div>

 
  )
}

export default Dashboard

