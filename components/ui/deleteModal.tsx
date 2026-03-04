// components/DeleteModal.tsx
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
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
            <Dialog maxWidth="xs" open={isOpen} onClose={onClose} >
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    {description}
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button onClick={onConfirm} color="error">
                        {confirmText}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default DeleteModal;