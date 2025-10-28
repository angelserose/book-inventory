import React from 'react';

const DeleteConfirmationPopup = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="delete-confirmation-popup">
            <div className="popup-content">
                <h2>Confirm Deletion</h2>
                <p>Are you sure you want to delete this book?</p>
                <button onClick={onConfirm}>Yes, Delete</button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
};

export default DeleteConfirmationPopup;