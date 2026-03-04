"use client";

import { Button, Checkbox, IconButton, Typography } from "@mui/material";
import { ArrowLeft, Download, Share2, Trash2 } from "lucide-react";
import { CldUploadWidget, CloudinaryUploadWidgetResults } from "next-cloudinary";
import 'next-cloudinary/dist/cld-video-player.css';
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { IFile } from "@/types/models/File";
import axios from "axios";
import { IFolder } from "@/types/models/folder";
import { IUser } from "@/types/models/user";
import DisplayFile from "./displayFile";
import { handleError } from "@/lib/error";
import { formatDate } from "@/lib/calendar";
import { useCalendar } from "@/context/CalendarContext";
import DeleteModal from "@/components/ui/deleteModal";

interface PhotoSectionProps {
    selectedClient?: IUser;
    selectedFolder?: IFolder;
    userId: string | undefined;
    setSnackbarMessage: React.Dispatch<React.SetStateAction<string>>;
    setSnackbarOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedFolderId?: React.Dispatch<React.SetStateAction<string | null>>;
}

const PhotoSection = ({
    selectedClient,
    userId,
    selectedFolder,
    setSnackbarMessage,
    setSnackbarOpen,
    setSelectedFolderId,
}: PhotoSectionProps) => {
    const [photos, setPhotos] = useState<IFile[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const { mode } = useCalendar();
    const selectedFolderId = selectedFolder?._id || null;

    const selectedClientId = selectedClient?._id || null;

    const [activeTab, setActiveTab] = useState("UnSelected");
    const [fileTypeActiveTab, setFileTypeActiveTab] = useState("Image");

    const folderStatus = selectedFolder?.status;

    const UnEditedTabs = [
        { label: "UnSelected Files", key: "UnSelected" },
        { label: "Selected Files", key: "Selected" },
    ];

    const FileTypeTab = [
        { label: "Videos", key: "Video" },
        { label: "Images", key: "Image" },
    ]

    const EditedTabs = useMemo(() => {
        if (!photos.length) return [];

        const grouped: Record<string, string> = {};

        photos.forEach((photo) => {
            const isoDate = new Date(photo.createdAt)
                .toISOString()
                .split("T")[0];

            if (!grouped[isoDate]) {
                grouped[isoDate] = formatDate(photo.createdAt, mode);
            }
        });

        return Object.entries(grouped)
            .sort((a, b) => (a[0] > b[0] ? -1 : 1))
            .map(([isoDate, label]) => ({
                key: isoDate,
                label: selectedFolder?.name.slice(0, 7) + " - " + label,
            }));
    }, [photos, mode, selectedFolder]);

    useEffect(() => {
        if (folderStatus !== "UnEdited" && EditedTabs.length > 0) {
            setActiveTab(EditedTabs[0].key);
        }
    }, [EditedTabs, folderStatus]);

    const fetchPhotos = useCallback(async () => {
        if (!selectedFolderId || !selectedClientId) return;

        try {
            setLoading(true);
            setError("");

            const response = await axios.get("/api/photo", {
                params: {
                    folderId: selectedFolderId,
                    clientId: selectedClientId,
                },
            });

            setPhotos(response.data);

        } catch (err: unknown) {
            setError(handleError(err));
        } finally {
            setLoading(false);
        }
    }, [selectedFolderId, selectedClientId]);

    useEffect(() => {
        fetchPhotos();
    }, [fetchPhotos]);

    const handleSelectAllToggle = () => {
        if (visiblePhotos.length === 0) return;

        const allSelected = visiblePhotos.every(photo =>
            selectedPhotos.includes(photo.publicId)
        );

        if (allSelected) {
            setSelectedPhotos(prev =>
                prev.filter(id => !visiblePhotos.some(p => p.publicId === id))
            );
        } else {
            const newSelections = visiblePhotos
                .map(p => p.publicId)
                .filter(id => !selectedPhotos.includes(id));

            setSelectedPhotos(prev => [...prev, ...newSelections]);
        }
    };

    const handleDownloadSelected = async () => {
        if (selectedPhotos.length === 0) return;

        try {
            const res = await fetch('/api/photo/download', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    publicIds: selectedPhotos,
                    zipName: `folder-${selectedFolder?.name || 'media'}`
                }),
            });

            const data = await res.json();

            if (data.url) {
                const link = document.createElement('a');
                link.href = data.url;
                link.download = '';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                alert('Failed to generate ZIP');
            }
        } catch (err) {
            console.error("Download error:", err);
            alert("Download failed");
        }
    };

    const handleDeleteSelected = async () => {
        if (selectedPhotos.length === 0) return;
        setIsDeleting(true);

        try {
            await axios.patch("/api/photo/actions", {
                action: "delete",
                photoIds: selectedPhotos,
            });

            setActiveTab(activeTab);
            setDeleteModalOpen(false);
            fetchPhotos();
            setSelectedPhotos([]);
            setSnackbarMessage("File deleted successfully");
            setSnackbarOpen(true);
        } catch (err) {
            console.error("Failed to delete selected photos", err);
        } finally {
            setIsDeleting(false);
        }
    };


    const selectStatus = folderStatus === "UnEdited" ? "UnSelected" : "Approved";

    const filteredPhotos = useMemo(() => {
        let result = photos;

        if (folderStatus === "UnEdited") {
            result = result.filter(photo => photo.selectionStatus === activeTab);
        } else {
            result = result.filter(photo => {
                const isoDate = new Date(photo.createdAt)
                    .toISOString()
                    .split("T")[0];

                return isoDate === activeTab;
            });
        }

        result = result.filter(photo => {
            if (fileTypeActiveTab === "Image") {
                return photo.resourceType === "image";
            }
            if (fileTypeActiveTab === "Video") {
                return photo.resourceType === "video";
            }
            return true;
        });

        return result;

    }, [photos, activeTab, folderStatus, fileTypeActiveTab]);

    const visiblePhotos = filteredPhotos;

    return (
        <div className="w-full flex flex-col items-center gap-3 overflow-hidden">
            {deleteModalOpen && (
                <div className="fixed inset-0 bg-black/40 z-40"></div>
            )}
            <div className="w-full flex items-center gap-2">
                <span
                    onClick={() => setSelectedFolderId && setSelectedFolderId(null)}
                    className="flex items-center justify-center p-2 rounded-full hover:border border-gray-300 transition-all duration-300 cursor-pointer"
                >
                    <ArrowLeft size={20} />
                </span>

                <div className="flex flex-col">
                    <span className="text-base font-light text-gray-600">
                        Selected Folder:{" "}
                        <i className="underline font-light">{selectedFolder?.name}</i>:{" "}
                        <i className="font-light">{selectedClient?.name}</i>
                    </span>
                    <em className="text-sm font-light">
                        List of photos and videos under this folder appears here
                    </em>
                </div>
            </div>

            <div className="w-full flex items-center justify-between gap-3">
                <div className="w-full flex-1 flex items-center gap-2 ">
                    {FileTypeTab.map((tab) => (
                        <Button
                            key={tab.key}
                            onClick={() => (
                                setFileTypeActiveTab(tab.key),
                                setSelectedPhotos([])
                            )}
                            variant={fileTypeActiveTab === tab.key ? "contained" : "outlined"}
                            size="small"
                        >
                            <span className="text-xs">{tab.label}</span>
                        </Button>
                    ))}
                </div>

                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center justify-start">
                        <Typography className="text-sm font-light capitalize">
                            <span className="mr-2">{selectedPhotos.length}</span>Selected
                        </Typography>

                        <IconButton title="Share" size="small">
                            <Share2 size={18} />
                        </IconButton>

                        <Checkbox
                            size="small"
                            checked={
                                visiblePhotos.length > 0 &&
                                visiblePhotos.every(p => selectedPhotos.includes(p.publicId))
                            }

                            indeterminate={
                                visiblePhotos.some(p => selectedPhotos.includes(p.publicId)) &&
                                !visiblePhotos.every(p => selectedPhotos.includes(p.publicId))
                            }
                            onChange={handleSelectAllToggle}
                        />
                        {selectedPhotos.length > 0 && (
                            <div>
                                <IconButton onClick={handleDownloadSelected} title="Download" size="small">
                                    <Download size={18} />
                                </IconButton>
                                <IconButton onClick={() => {
                                    setDeleteModalOpen(true);
                                }}
                                    title="Delete" size="small" color="error">
                                    <Trash2 size={18} />
                                </IconButton>
                            </div>
                        )}
                    </div>

                    <CldUploadWidget
                        uploadPreset="studio_Upload_preset"
                        signatureEndpoint="/api/sign-cloudinary-params"
                        options={{
                            folder: `clients/${selectedClientId}/${selectedFolderId}`,
                            resourceType: "auto",
                            clientAllowedFormats: ["png", "jpg", "jpeg", "webp", "mp4", "mov"],
                            multiple: true,
                        }}
                        onSuccess={async (result: CloudinaryUploadWidgetResults) => {

                            if (!result.info || typeof result.info === "string") return;

                            const infos = Array.isArray(result.info)
                                ? result.info
                                : [result.info];

                            await Promise.all(
                                infos.map((info) => {
                                    return axios.post("/api/photo", {
                                        fileName: info.original_filename,
                                        folderId: selectedFolderId,
                                        clientId: selectedClientId,
                                        publicId: info.public_id,
                                        secureUrl: info.secure_url,
                                        resourceType: info.resource_type,
                                        size: info.bytes,
                                        format: info.format,
                                        uploadedBy: userId,
                                        status: folderStatus,
                                        selectionStatus: selectStatus,
                                    });
                                })
                            );

                            setSnackbarMessage("File uploaded successfully");
                            setSnackbarOpen(true);
                            fetchPhotos();
                        }}
                    >
                        {({ open }) => (
                            <Button variant="outlined" onClick={() => open()} size="small">
                                Upload
                            </Button>
                        )}
                    </CldUploadWidget>
                </div>
            </div>

            {folderStatus === "UnEdited" && (
                <div className="w-full flex items-center gap-2 mb-5">
                    {UnEditedTabs.map((tab) => (
                        <Button
                            key={tab.key}
                            onClick={() => (
                                setActiveTab(tab.key),
                                setSelectedPhotos([])
                            )}
                            variant={activeTab === tab.key ? "contained" : "outlined"}
                            size="small"
                        >
                            {tab.label}
                        </Button>
                    ))}
                </div>
            )}

            {folderStatus == "Edited" && (
                <div className="w-full flex items-center gap-2 mb-5">
                    {EditedTabs.map((tab) => (
                        <Button
                            key={tab.key}
                            onClick={() => (
                                setActiveTab(tab.key),
                                setSelectedPhotos([])
                            )}
                            variant={activeTab === tab.key ? "contained" : "outlined"}
                            size="small"
                        >
                            {tab.label}
                        </Button>
                    ))}
                </div>
            )}

            <DisplayFile
                photos={visiblePhotos}
                loading={loading}
                error={error}
                selectedPhotos={selectedPhotos}
                setSelectedPhotos={setSelectedPhotos}
            />

            <DeleteModal
                isOpen={deleteModalOpen}
                title="Delete File"
                description="Are you sure you want to delete this file? This action cannot be undone."
                onClose={() => {
                    setDeleteModalOpen(false);
                }}
                onConfirm={() => {
                    handleDeleteSelected();
                }}
                confirmText={isDeleting ? "Deleting..." : "Yes, Delete"}
            />
        </div>
    );
};

export default PhotoSection;