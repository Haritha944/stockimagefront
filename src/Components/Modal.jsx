import React from "react";

const Modal = ({ isOpen, message, onConfirm, onCancel, editMode, 
    title, 
    onTitleChange, 
    onFileChange,  }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded-lg w-96">
        <h3 className="text-lg font-semibold">{message}</h3>
        {editMode && (
          <>
            <input
              type="text"
              value={title || ''} // Provide a default empty string if title is undefined
              onChange={onTitleChange}
              className="border border-gray-300 rounded-md p-2 w-full mt-2"
              placeholder="Edit Title"
            />
            <input
              type="file"
              onChange={onFileChange}
              className="border border-gray-300 rounded-md p-2 w-full mt-2"
            />
          </>
        )}
        <div className="flex justify-end mt-4">
          <button onClick={onCancel} className="bg-gray-300 text-gray-700 py-2 px-4 rounded mr-2">
            Cancel
          </button>
          <button onClick={onConfirm} className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
