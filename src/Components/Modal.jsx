// frontend/src/Components/Modal.js

import React from "react";
import ReactDOM from "react-dom";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 bg-gray-90 bg-opacity-50 dark:bg-opacity-75 flex items-center justify-center z-50 transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="relative bg-white dark:bg-gray-800 rounded-lg max-w-lg w-full m-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        {children}
      </div>
    </div>,
    document.getElementById("modal-root") // You need to add <div id="modal-root"></div> to your index.html
  );
};

export default Modal;