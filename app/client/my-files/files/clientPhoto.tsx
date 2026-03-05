import { useCurrentUser } from '@/hooks/useCurrentUser';
import { IFolder } from '@/types/models/folder';
import { Button, Checkbox, Typography } from '@mui/material';
import { ArrowLeft, Download, Filter, Share2 } from 'lucide-react';
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

            fetchPhotos();
            setSelectedPhotos([]);
        } catch (error) {
            console.error("Bulk update failed", error);
        } finally {
            setSubmitting(false);
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
        <div className="w-full flex flex-col items-center gap-5 overflow-hidden">
            <div className="w-full flex items-center justify-between gap-2">
                <div className="flex gap-2 items-center">
                    <span
                        onClick={() => setSelectedFolderId && setSelectedFolderId(null)}
                        className="flex items-center justify-center p-2 rounded-full hover:border border-gray-300 transition-all duration-300 cursor-pointer"
                    >
                        <ArrowLeft size={20} />
                    </span>

                    <span className="flex flex-col gap-0 font-serif">
                        <b>Folder:</b>
                        <i className="px-2 bg-gray-200 w-max text-xs rounded-md font-light">{selectedFolder?.name}</i>
                    </span>
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
                                <span onClick={handleSelectAllToggle} className="hidden lg:flex bg-gray-200 px-2 py-0.5 rounded-md hover:bg-gray-300 hover:text-gray-950  transition-all duration-300">
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
                        {folderStatus === "Edited" && (
                            <div className="flex gap-1 items-center">
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
                            </div>
                        )}

                        {folderStatus === "UnEdited" && (
                            <div className="flex gap-1 items-center">
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
                                    title="Delete"
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
        </div>
    )
}

export default ClientPhoto
