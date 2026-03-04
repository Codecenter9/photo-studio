// components/DeleteModal.tsx
import { Button } from "@mui/material";
import React from "react";

interface DeleteModalProps {
    isOpen: boolean;
    title?: string;
    description?: string;
    onClose: () => void;
    onConfirm: () => void;
    confirmText?: string;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
    isOpen,
    title = "Are you sure?",
    description = "This action cannot be undone.",
    onClose,
    onConfirm,
    confirmText = "Delete",
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="bg-gray-800 rounded-md shadow-lg max-w-sm w-full p-6">
                <h2 className="text-md font-semibold text-gray-200">
                    {title}
                </h2>
                <p className="mt-2 text-sm text-gray-300">
                    {description}
                </p>
                <div className="mt-4 flex justify-end gap-3">
                    <Button
                        size="small"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        size="small"
                        color="error"
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;