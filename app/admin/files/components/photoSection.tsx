"use client";

import { Button, Checkbox, Typography } from "@mui/material";
import { ArrowLeft, Download, Filter, Share2, Trash2 } from "lucide-react";
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
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

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
    const { mode } = useCalendar();

    const [photos, setPhotos] = useState<IFile[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const selectedFolderId = selectedFolder?._id || null;
    const selectedClientId = selectedClient?._id || null;

    const [activeTab, setActiveTab] = useState("UnSelected");
    const [fileTypeActiveTab, setFileTypeActiveTab] = useState("Image");

    const folderStatus = selectedFolder?.status;

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const UnEditedTabs = [
        { label: "UnSelected", key: "UnSelected" },
        { label: "Selected", key: "Selected" },
    ];

    const FileTypeTab = [
        { label: "Images", key: "Image" },
        { label: "Videos", key: "Video" },
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

    const handleShareSelected = async () => {
        alert("shared");
    }

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
            <div className="w-full flex items-center justify-between gap-2">
                <div className="flex gap-2 items-center">
                    <span
                        onClick={() => setSelectedFolderId && setSelectedFolderId(null)}
                        className="flex items-center justify-center p-2 rounded-full hover:border border-gray-300 transition-all duration-300 cursor-pointer"
                    >
                        <ArrowLeft size={20} />
                    </span>

                    <div className="flex flex-col gap-0">
                        <span className="flex gap-1 items-center font-serif">
                            <b>Folder:</b>
                            <i className="px-2 bg-gray-200 w-max text-xs rounded-md font-light">{selectedFolder?.name.slice(0, 7)}</i>
                        </span>
                        <span className="flex gap-1 items-center font-serif">
                            <b>client:</b>
                            <i className="px-2 bg-gray-200 w-max text-xs rounded-md font-light">{selectedClient?.name.slice(0, 7)}</i>
                        </span>
                    </div>
                </div>

                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1 justify-start">
                        <Typography className="text-sm font-light flex gap-2 capitalize">
                            <span className="px-2 py-0.5 rounded-full items-center bg-amber-100 hover:bg-amber-200">
                                {selectedPhotos.length}
                            </span>
                        </Typography>

                        <div
                            className="cursor-pointer">
                            {visiblePhotos.length > 0 &&
                                visiblePhotos.every(p => selectedPhotos.includes(p.publicId)) ? (
                                <span onClick={handleSelectAllToggle} className="hidden lg:flex bg-red-100 px-2 py-0.5 rounded-md hover:bg-red-200 hover:text-red-500  transition-all duration-300">
                                    Unselect All
                                </span>
                            ) : (
                                <span onClick={handleSelectAllToggle} className="hidden lg:flex bg-cyan-100 px-2 py-0.5 rounded-md hover:bg-cyan-200 hover:text-gray-950  transition-all duration-300">
                                    Select All
                                </span>
                            )}
                            <span className="flex lg:hidden">
                                <Checkbox
                                    size="medium"
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
                            </span>
                        </div>

                        <div
                            onClick={() => {
                                if (selectedPhotos.length === 0) {
                                    alert("Please select at least 1 file");
                                    return;
                                }
                                handleShareSelected();
                            }}
                            title="Share"
                            className="flex items-center gap-2 cursor-pointer bg-cyan-100 p-2 lg:px-2 lg:py-0.5 rounded-full lg:rounded-md hover:bg-cyan-200 hover:text-gray-950  transition-all duration-300"
                        >
                            <span className="hidden lg:flex">
                                Share
                            </span>
                            <span className="">
                                <Share2 size={18} />
                            </span>
                        </div>

                        <div
                            onClick={() => {
                                if (selectedPhotos.length === 0) {
                                    alert("Please select at least 1 file");
                                    return;
                                }
                                handleDownloadSelected();
                            }}
                            title="Download"
                            className="flex items-center gap-2 cursor-pointer bg-gray-100 p-2 lg:px-2 lg:py-0.5 rounded-full lg:rounded-md hover:bg-gray-200 hover:text-blue-500  transition-all duration-300"
                        >
                            <span className="hidden lg:flex ">
                                Download
                            </span>
                            <span className="">
                                <Download size={18} />
                            </span>
                        </div>
                        <div onClick={() => {
                            if (selectedPhotos.length === 0) {
                                alert("Please select at least 1 file");
                                return;
                            }
                            setDeleteModalOpen(true);
                        }}
                            title="Delete"
                            className="flex items-center gap-2 cursor-pointer bg-red-100 p-2 lg:px-2 lg:py-0.5 rounded-full lg:rounded-md hover:bg-red-200 hover:text-red-500  transition-all duration-300"
                        >

                            <span className="hidden lg:flex">
                                Delete
                            </span>
                            <span className="">
                                <Trash2 size={18} />
                            </span>
                        </div>
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

            <div className="w-full flex items-center justify-between gap-3 mb-5">
                <div className="w-full flex flex-2">
                    {folderStatus === "UnEdited" ? (
                        <div className="w-full flex items-center gap-2">
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
                    ) : (
                        <div className="flex items-center gap-2 bg-gray-100 py-1 px-3 rounded-md cursor-pointer hover:bg-gray-300 transition-all duration-300">
                            <Button
                                id="basic-button"
                                aria-controls={open ? 'basic-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                                onClick={handleClick}
                                size="small"
                            >
                                <Filter size={18} />
                                <span className="ml-2">Filter</span>
                            </Button>
                            <Menu
                                id="basic-menu"
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                                slotProps={{
                                    list: {
                                        'aria-labelledby': 'basic-button',
                                    },
                                }}
                            >
                                {EditedTabs.map((tab) => (
                                    <MenuItem
                                        key={tab.key}
                                        onClick={() => (
                                            handleClose(),
                                            setActiveTab(tab.key),
                                            setSelectedPhotos([]))
                                        } className={`flex flex-col gap-2`}
                                        selected={activeTab === tab.key}
                                    >

                                        {tab.label}
                                    </MenuItem>
                                ))}
                            </Menu>
                        </div>
                    )}
                </div>
                <div className="w-full flex lg:flex-1 justify-end items-center gap-2 ">
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
                            {tab.label}
                        </Button>
                    ))}
                </div>
            </div>

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
        </div >
    );
};

export default PhotoSection;