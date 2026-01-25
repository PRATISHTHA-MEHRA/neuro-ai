import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const Modal = ({ isOpen, onClose }) => {
  const { logout } = useAuth();
  
  const handleLogout = () => {
    logout();
    onClose();
  };
  
  if (!isOpen) return null;
  return (
    <div
      className="absolute right-0 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Modal;
