import { useCurrentUser } from '@/hooks/useCurrentUser';
import { IFolder } from '@/types/models/folder';
import { Alert, Button, Checkbox, Snackbar, Typography } from '@mui/material';
import { ArrowLeft, Download, Filter, Share2, Trash2 } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import ClientPhotoDisplay from './clientPhotoDisplay';
import 'next-cloudinary/dist/cld-video-player.css';
import { IFile } from '@/types/models/File';
import axios from 'axios';
import { handleError } from '@/lib/error';
import { useCalendar } from '@/context/CalendarContext';
import { formatDate } from "@/lib/calendar";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import DeleteModal from '@/components/ui/deleteModal';
interface PhotoSectionProps {
    selectedFolder?: IFolder | null;
    setSelectedFolderId?: React.Dispatch<React.SetStateAction<string | null>>;
}
const ClientPhoto = ({ selectedFolder, setSelectedFolderId }: PhotoSectionProps) => {
    const { mode } = useCalendar();

    const currentUser = useCurrentUser();
    const selectedClient = currentUser?.loggedInUser;

    const selectedClientId = selectedClient?.id || null;

    const selectedFolderId = selectedFolder?._id || null;

    const [photos, setPhotos] = useState<IFile[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);

    const [activeTab, setActiveTab] = useState("UnSelected");
    const [fileTypeActiveTab, setFileTypeActiveTab] = useState("Image");
    const [submitting, setSubmitting] = useState(false);

    const folderStatus = selectedFolder?.status;

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [fileToDelete, setFileToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

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

    const handleMakePublic = async () => {
        if (selectedPhotos.length === 0) return;
        setSubmitting(true);
        try {
            const updatedData = selectedPhotos.map(photoId => {
                const photo = photos.find(p => p.publicId === photoId);
                if (!photo) return null;
                return {
                    publicId: photoId,
                    isPublic: photo.isPublic === false ? true : true,
                };
            }).filter(Boolean);

            const photoIds = updatedData.map(u => u!.publicId);

            await axios.patch("/api/photo/actions", {
                action: "update",
                photoIds,
                data: { isPublic: updatedData[0]?.isPublic },
            });

            fetchPhotos();
            setSnackbarMessage("Files became public successfully");
            setSnackbarOpen(true);
            setSelectedPhotos([]);
        } catch (error) {
            console.error("Bulk update failed", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleSelectedSubmit = async () => {
        if (selectedPhotos.length === 0) return;
        setSubmitting(true);
        try {
            const updatedData = selectedPhotos.map(photoId => {
                const photo = photos.find(p => p.publicId === photoId);
                if (!photo) return null;
                return {
                    publicId: photoId,
                    selectionStatus: photo.selectionStatus === "Selected" ? "UnSelected" : "Selected",
                };
            }).filter(Boolean);

            const photoIds = updatedData.map(u => u!.publicId);

            await axios.patch("/api/photo/actions", {
                action: "update",
                photoIds,
                data: { selectionStatus: updatedData[0]?.selectionStatus },
            });

            setSnackbarMessage("Selected files submitted successfully");
            setSnackbarOpen(true);
            fetchPhotos();
            setSelectedPhotos([]);
        } catch (error) {
            console.error("Bulk update failed", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteFile = async () => {
        if (selectedPhotos.length === 0) return;
        setIsDeleting(true)
        try {
            const updatedData = selectedPhotos.map(photoId => {
                const photo = photos.find(p => p.publicId === photoId);
                if (!photo) return null;
                return {
                    publicId: photoId,
                    isVisibleForClient: false,
                };
            }).filter(Boolean);

            const photoIds = updatedData.map(u => u!.publicId);

            await axios.patch("/api/photo/actions", {
                action: "update",
                photoIds,
                data: { isVisibleForClient: updatedData[0]?.isVisibleForClient },
            });

            setSnackbarMessage("Selected files removed successfully");
            setSnackbarOpen(true);
            fetchPhotos();
            setSelectedPhotos([]);
        } catch (error) {
            console.error("Bulk update failed", error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDownloadSelected = async () => {
        if (selectedPhotos.length === 0) return;

        const selectedPhotoObjects = photos.filter(photo =>
            selectedPhotos.includes(photo.publicId)
        );

        const allSameType = selectedPhotoObjects.every(
            photo => photo.resourceType === selectedPhotoObjects[0].resourceType
        );

        const resource_type = allSameType ? selectedPhotoObjects[0].resourceType : undefined;

        try {
            const res = await fetch('/api/photo/download', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    publicIds: selectedPhotos,
                    zipName: `folder-${selectedFolder?.name || 'media'}`,
                    type: resource_type,
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

    const handleShareSelected = async () => {
        alert("shared");
    }

    const filteredPhotos = useMemo(() => {
        return photos.filter(photo => {

            if (!photo.isVisibleForClient) return false;

            if (folderStatus === "UnEdited") {
                if (photo.selectionStatus !== activeTab) return false;
            } else {
                const isoDate = new Date(photo.createdAt)
                    .toISOString()
                    .split("T")[0];

                if (isoDate !== activeTab) return false;
            }

            if (fileTypeActiveTab === "Image" && photo.resourceType !== "image") return false;
            if (fileTypeActiveTab === "Video" && photo.resourceType !== "video") return false;

            return true;

        });
    }, [photos, activeTab, folderStatus, fileTypeActiveTab]);

    const visiblePhotos = filteredPhotos;

    return (
        <div className="w-full flex flex-col items-center gap-5 overflow-hidden">
            <div className="w-full flex items-center justify-between gap-2">
                <div className="flex gap-2 items-center">
                    <span
                        onClick={() => setSelectedFolderId && setSelectedFolderId(null)}
                        className="flex items-center justify-center p-1 rounded-full border bg-gray-200 hover:bg-gray-300 border-gray-300 transition-all duration-300 cursor-pointer"
                    >
                        <ArrowLeft size={20} />
                    </span>

                    <span className="hidden lg:flex flex-col gap-0 font-serif">
                        <b>Folder:</b>
                        <i className="px-2 bg-gray-200 w-max text-xs rounded-md font-light">{selectedFolder?.name}</i>
                    </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 justify-start">
                        <div className="flex gap-2 lg:gap-2 items-center">
                            <Typography className="flex items-center text-sm font-light gap-2 capitalize">
                                <p className="hidden lg:flex nr-1">Selected</p>
                                <span className="px-2 py-0.5 rounded-full items-center bg-amber-100 hover:bg-amber-200">
                                    {selectedPhotos.length}
                                </span>
                            </Typography>

                            <div
                                className="cursor-pointer">
                                {visiblePhotos.length > 0 &&
                                    visiblePhotos.every(p => selectedPhotos.includes(p.publicId)) ? (
                                    <span onClick={handleSelectAllToggle} className="hidden min-w-max lg:flex items-center gap-1 bg-red-100 px-2 py-0.5  rounded-md hover:bg-red-200 hover:text-red-500  transition-all duration-300">
                                        <p>Unselect All</p>
                                    </span>
                                ) : (
                                    <span onClick={handleSelectAllToggle} className="hidden lg:flex items-center bg-gray-200 px-2 py-0.5 rounded-md hover:bg-red-200 hover:text-gray-950  transition-all duration-300">
                                        <p>Select All</p>
                                    </span>
                                )}
                                <span className="flex lg:hidden rounded-full bg-gray-200">
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
                                </span>
                            </div>

                        </div>

                        {folderStatus === "Edited" && (
                            <div className="flex gap-2 items-center">
                                <div
                                    onClick={() => {
                                        if (selectedPhotos.length === 0) {
                                            alert("Please select at least 1 file");
                                            return;
                                        }
                                        handleShareSelected();
                                    }}
                                    title="Share"
                                    className="flex items-center gap-2 cursor-pointer bg-gray-200 p-2 lg:px-2 lg:py-0.5 rounded-full lg:rounded-md hover:bg-gray-300 hover:text-blue-500  transition-all duration-300"
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
                                    className="flex items-center gap-2 cursor-pointer bg-gray-200 p-2 lg:px-2 lg:py-0.5 rounded-full lg:rounded-md hover:bg-gray-300 hover:text-blue-500  transition-all duration-300"
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
                                    className="flex items-center gap-2 cursor-pointer bg-gray-200 p-2 lg:px-2 lg:py-0.5 rounded-full lg:rounded-md hover:bg-red-100 hover:text-blue-500  transition-all duration-300"
                                >

                                    <span className="hidden lg:flex">
                                        Delete
                                    </span>
                                    <span className="">
                                        <Trash2 size={18} />
                                    </span>
                                </div>
                                <div onClick={() => {
                                    if (selectedPhotos.length === 0) {
                                        alert("Please select at least 1 file");
                                        return;
                                    }
                                    handleMakePublic();
                                }}
                                    title="Make Visibiity Public"
                                    className="flex items-center gap-2 cursor-pointer bg-cyan-100 px-2 py-0.5 rounded-md hover:bg-cyan-200 hover:text-gray-950  transition-all duration-300"
                                >

                                    <span className="">
                                        {submitting ? "Submiting..." : "Make Public"}
                                    </span>
                                </div>
                            </div>
                        )}

                        {folderStatus === "UnEdited" && (
                            <div className="flex gap-2 items-center">
                                {selectedClient?.permissions?.canShare && (
                                    <div
                                        onClick={() => {
                                            if (selectedPhotos.length === 0) {
                                                alert("Please select at least 1 file");
                                                return;
                                            }
                                            handleShareSelected();
                                        }}
                                        title="Share"
                                        className="flex items-center gap-2 cursor-pointer bg-gray-200 p-2 lg:px-2 lg:py-0.5 rounded-full lg:rounded-md hover:bg-gray-300 hover:text-blue-500  transition-all duration-300"
                                    >
                                        <span className="hidden lg:flex">
                                            Share
                                        </span>
                                        <span className="">
                                            <Share2 size={18} />
                                        </span>
                                    </div>
                                )}

                                {(selectedClient?.permissions?.canDownload) && (
                                    <div
                                        onClick={() => {
                                            if (selectedPhotos.length === 0) {
                                                alert("Please select at least 1 file");
                                                return;
                                            }
                                            handleDownloadSelected();
                                        }}
                                        title="Download"
                                        className="flex items-center gap-2 cursor-pointer bg-gray-200 p-2 lg:px-2 lg:py-0.5 rounded-full lg:rounded-md hover:bg-gray-300 hover:text-blue-500  transition-all duration-300"
                                    >
                                        <span className="hidden lg:flex ">
                                            Download
                                        </span>
                                        <span className="">
                                            <Download size={18} />
                                        </span>
                                    </div>
                                )}
                                <div onClick={() => {
                                    if (selectedPhotos.length === 0) {
                                        alert("Please select at least 1 file");
                                        return;
                                    }
                                    handleSelectedSubmit();
                                }}
                                    title="Change Status"
                                    className="flex items-center gap-2 cursor-pointer bg-cyan-100 px-2 py-0.5 rounded-md hover:bg-cyan-200 hover:text-gray-950  transition-all duration-300"
                                >

                                    <span className="">
                                        {submitting ? "Submiting..." : "Submit"}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

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
                        <div className="flex items-center gap-2 bg-gray-200 py-1 px-3 rounded-md cursor-pointer hover:bg-gray-300 transition-all duration-300">
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

            <ClientPhotoDisplay
                photos={visiblePhotos}
                loading={loading}
                error={error}
                selectedPhotos={selectedPhotos}
                setSelectedPhotos={setSelectedPhotos}
            />

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <Alert
                    onClose={() => setSnackbarOpen(false)}
                    severity="success"
                    sx={{ width: "100%" }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            <DeleteModal
                isOpen={deleteModalOpen}
                title="Delete Schedule"
                description="Are you sure you want to delete this schedule? This action cannot be undone."
                onClose={() => {
                    setDeleteModalOpen(false);
                    setFileToDelete(null);
                }}
                onConfirm={() => {
                    if (fileToDelete) {
                        handleDeleteFile();
                    }
                }}
                confirmText={isDeleting ? "Deleting..." : "Yes, Delete"}
            />

        </div>
    )
}

export default ClientPhoto
