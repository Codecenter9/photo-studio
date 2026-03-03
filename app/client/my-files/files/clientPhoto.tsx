import { useCurrentUser } from '@/hooks/useCurrentUser';
import { IFolder } from '@/types/models/folder';
import { Button, Checkbox, IconButton, Typography } from '@mui/material';
import { ArrowLeft, Download, Share2 } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react'
import ClientPhotoDisplay from './clientPhotoDisplay';
import 'next-cloudinary/dist/cld-video-player.css';
import { IFile } from '@/types/models/File';
import axios from 'axios';
import { handleError } from '@/lib/error';

interface PhotoSectionProps {
    selectedFolder?: IFolder | null;
    setSelectedFolderId?: React.Dispatch<React.SetStateAction<string | null>>;
}
const ClientPhoto = ({ selectedFolder, setSelectedFolderId }: PhotoSectionProps) => {

    const currentUser = useCurrentUser();
    const selectedClient = currentUser?.loggedInUser;

    const [photos, setPhotos] = useState<IFile[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState("UnSelected");
    const [submitting, setSubmitting] = useState(false);

    const Tabs = [
        { label: "UnSelected Files", key: "UnSelected" },
        { label: "Selected Files", key: "Selected" },
    ];

    const selectedClientId = selectedClient?.id || null;

    const selectedFolderId = selectedFolder?._id || null;

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


    const folderStatus = selectedFolder?.status;

    const filteredPhotos = photos.filter(photo => photo.selectionStatus === activeTab);

    const visiblePhotos = folderStatus === "UnEdited" ? filteredPhotos : photos;


    return (
        <div className="w-full flex flex-col items-center gap-8 overflow-hidden">
            <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <span
                        onClick={() => setSelectedFolderId && setSelectedFolderId(null)}
                        className="flex items-center justify-center p-2 rounded-full hover:border border-gray-300 transition-all duration-300 cursor-pointer"
                    >
                        <ArrowLeft size={20} />
                    </span>

                    <div className="flex flex-col">
                        <span className="text-base font-light text-gray-600">
                            Selected Folder:{" "}
                            <i className="underline font-light">{selectedFolder?.name}</i>
                        </span>
                        <em className="text-sm font-light">
                            List of photos and videos under this folder appears here
                        </em>
                    </div>
                </div>

                <div className="flex items-center justify-end bg-gray-100 p-2 rounded-md">
                    <Typography variant="body2" className="mr-auto">
                        {selectedPhotos.length} selected
                    </Typography>
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
                            <IconButton title="Share" >
                                <Share2 size={18} />
                            </IconButton>
                            <IconButton onClick={handleDownloadSelected} title="Download" size="small">
                                <Download size={18} />
                            </IconButton>
                        </div>
                    )}
                    <div className="ml-2">
                        {folderStatus === "UnEdited" && (
                            <Button variant='outlined' color='info' size='small' onClick={handleSelectedSubmit}>{submitting ? "Submitting..." : "Submit"} </Button>
                        )}
                    </div>
                </div>
            </div>

            {folderStatus === "UnEdited" && (
                <div className="w-full flex flex-col items-center justify-start gap-5">
                    <div className="w-full flex items-center gap-2">
                        {Tabs.map((tab) => (
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
                </div>
            )}

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
