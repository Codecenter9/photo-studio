"use client";

import { IconButton, TextField, Button } from "@mui/material";
import { EllipsisVertical, Folder } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { handleError } from "@/lib/error";
import DeleteModal from "@/components/ui/deleteModal";

interface FolderSectionPropes {
    folders: {
        _id: string;
        name: string;
        clientId: string;
    }[];
    activeTab: string,
    fetchFolders: (clientId: string, status: string) => Promise<void>;
    setSnackbarMessage: React.Dispatch<React.SetStateAction<string>>;
    setSnackbarOpen: React.Dispatch<React.SetStateAction<boolean>>;
    selectedClientId: string;
    setSelectedFolderId?: React.Dispatch<React.SetStateAction<string | null>>;

}

const FolderSection = ({
    setSelectedFolderId,
    folders,
    selectedClientId,
    setSnackbarMessage,
    setSnackbarOpen,
    fetchFolders,
    activeTab,
}: FolderSectionPropes) => {

    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
    const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
    const [newName, setNewName] = useState("");

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [folderToDelete, setFolderToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string>("");

    const handleFolderClick = (folderId: string) => {
        if (setSelectedFolderId) {
            setSelectedFolderId(folderId);
        }
    };

    const handleDelete = async (id: string) => {
        setIsDeleting(true);
        try {
            await axios.delete(`/api/folders/${id}`);

            setOpenDropdownId(null);
            fetchFolders(selectedClientId, activeTab);
            setSnackbarMessage("Folder deleted successfully");
            setSnackbarOpen(true);
        } catch (err) {
            console.error("Delete failed", err);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleRename = async (id: string) => {
        setError("");
        setSubmitting(true);

        if (!newName.trim()) {
            setError("Folder name is required");
            setSubmitting(false);
            return;
        }

        try {
            await axios.put(`/api/folders/${id}`, {
                name: newName,
            });

            setEditingFolderId(null);
            setOpenDropdownId(null);
            setSnackbarMessage("Folder updated successfully");
            setSnackbarOpen(true);
            fetchFolders(selectedClientId, activeTab);
        } catch (error) {
            console.error(error);
            setError(handleError(error));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex items-center justify-start w-full">
            {selectedClientId ? (
                <div className="w-full">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {folders.map((folder) => (
                            <div
                                key={folder._id}
                                onClick={() => handleFolderClick(folder._id)}
                                className="relative flex flex-col items-center gap-3 
                                hover:bg-gray-100 border border-gray-300 
                                cursor-pointer p-2 rounded-md transition-all duration-200"
                            >
                                <div className="flex items-center justify-center w-14 h-14 bg-yellow-400 rounded-lg">
                                    <Folder size={30} className="text-white" />
                                </div>

                                {editingFolderId === folder._id ? (
                                    <div
                                        onClick={(e) => e.stopPropagation()}
                                        className="flex flex-col gap-2 w-full"
                                    >
                                        <TextField
                                            size="small"
                                            value={newName}
                                            onChange={(e) => setNewName(e.target.value)}
                                        />
                                        {error && (
                                            <span className="text-red-600 text-xs text-start m-1">{error}</span>
                                        )}

                                        <div className="flex gap-2 items-center justify-center">
                                            {!submitting && (
                                                <Button
                                                    size="small"
                                                    onClick={() => {
                                                        setError("")
                                                        setEditingFolderId(null)
                                                    }}
                                                    className="text-xs"
                                                >
                                                    Cancel
                                                </Button>
                                            )}
                                            <Button
                                                size="small"
                                                onClick={() => handleRename(folder._id)}
                                                className="text-xs"
                                            >
                                                {submitting ? "Saving..." : "Save"}
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="font-medium text-gray-800 truncate">
                                        {folder.name}
                                    </p>
                                )}
                                
                                <div
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenDropdownId(
                                            openDropdownId === folder._id ? null : folder._id
                                        );
                                    }}
                                    className="absolute top-1 right-1"
                                >
                                    <IconButton size="small">
                                        <EllipsisVertical size={16} />
                                    </IconButton>
                                </div>

                                {openDropdownId === folder._id && (
                                    <div
                                        onClick={(e) => e.stopPropagation()}
                                        className="absolute top-10 right-2 bg-white shadow-md border rounded-md py-2 px-3 flex flex-col gap-2 z-10"
                                    >
                                        <span
                                            onClick={() => {
                                                setEditingFolderId(folder._id);
                                                setNewName(folder.name);
                                                setOpenDropdownId(null);
                                            }}
                                            className="text-sm text-gray-600 hover:text-black cursor-pointer"
                                        >
                                            Edit
                                        </span>

                                        <span
                                            onClick={() => {
                                                setFolderToDelete(folder._id);
                                                setDeleteModalOpen(true);
                                            }}
                                            className="text-sm text-red-500 hover:text-red-700 cursor-pointer"
                                        >
                                            Delete
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="w-full h-48 flex items-center justify-center text-gray-400">
                    Please select a client to view folders.
                </div>
            )
            }

            <DeleteModal
                isOpen={deleteModalOpen}
                title="Delete Folder"
                description="Are you sure you want to delete this folder? This action cannot be undone."
                onClose={() => {
                    setDeleteModalOpen(false);
                    setFolderToDelete(null);
                }}
                onConfirm={() => {
                    if (folderToDelete) {
                        handleDelete(folderToDelete);
                    }
                }}
                confirmText={isDeleting ? "Deleting..." : "Yes, Delete"}
            />
        </div >
    );
};

export default FolderSection;