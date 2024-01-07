import React from "react";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 pt-0 max-w-md mx-auto rounded-lg shadow-md">
        <div>
          <button className="text-gray-500 hover:text-gray-700 float-right text-2xl h-32px my-1 font-semibold" onClick={onClose}>
            &times;
          </button>
        </div>
        {children}
        <button className="bg-blue-600 text-white py-2 px-3 mt-3 rounded-lg w-full" onClick={()=>openModal(item)}>
          Download Image
        </button>
      </div>
    </div>
  );
};

export default Modal;