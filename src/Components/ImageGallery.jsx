import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const ImageGallery = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    // Fetch images from the backend
    axios
      .get(`${API_BASE_URL}images/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
      })
      .then(response => setImages(response.data))
      .catch((error) => console.error('Error fetching images', error));
  }, []);

  // Handle the end of a drag
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = images.findIndex((img) => img.id === active.id);
      const newIndex = images.findIndex((img) => img.id === over.id);
      const reorderedImages = arrayMove(images, oldIndex, newIndex);

      setImages(reorderedImages);

      // Send the new order to the backend
      const reorderedIds = reorderedImages.map((image) => image.id);
      axios
        .patch(`${API_BASE_URL}images/reorder_images/`, { order: reorderedIds },
          {  headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`
              }}
        )
        .then(response => {
            console.log('Order updated');
            axios.get(`${API_BASE_URL}images/`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
            .then(freshResponse => setImages(freshResponse.data))
            .catch(fetchError => console.error('Error re-fetching images', fetchError));
        })
        .catch((error) => console.error('Error updating order', error));
    }
  };

  return (
    <div className="bg-white shadow-md p-4 rounded-md">
      <h3 className="text-xl font-semibold mb-4">Gallery</h3>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={images} strategy={verticalListSortingStrategy}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((image) => (
              <SortableImage key={image.id} image={image} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

// Sortable component for each image
const SortableImage = ({ image }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative bg-gray-200 rounded-md overflow-hidden shadow-md group"
    >
      <img
        src={image.image}
        alt={image.title}
        className="w-full h-48 object-cover transition-transform duration-200 transform group-hover:scale-105"
        loading="lazy"
      />
      <p className="p-2 text-center text-sm font-semibold text-gray-800 bg-white bg-opacity-75">
        {image.title}
      </p>
    </div>
  );
};

export default ImageGallery;
