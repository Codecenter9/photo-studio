"use client";

import { IconButton } from '@mui/material'
import { Fullscreen, RefreshCcw } from 'lucide-react'
import { CldImage, CldVideoPlayer } from 'next-cloudinary'
import React from 'react'
import { IFile } from '../../../../types/models/File';
import EmptyState from '@/components/ui/emptyState';

interface DisplayInterface {
    photos: IFile[];
    loading: boolean;
    error: string;
    selectedPhotos: string[];
    setSelectedPhotos: React.Dispatch<React.SetStateAction<string[]>>;
}
const DisplayFile = ({ photos, loading, error, selectedPhotos, setSelectedPhotos }: DisplayInterface) => {

    const toggleSelect = (id: string) => {
        setSelectedPhotos((prev) =>
            prev.includes(id)
                ? prev.filter((i) => i !== id)
                : [...prev, id]
        );
    };

    const openFullscreen = (photo: IFile) => {
        const container = document.getElementById(`media-${photo.publicId}`);
        if (!container) return;

        const mediaElement = container.querySelector('img, video');
        const element = mediaElement || container;

        if (element.requestFullscreen) {
            element.requestFullscreen();
        }
    };

    return (
        <div className='w-full'>
            {loading ? (
                <p className="flex items-center justify-start gap-1">
                    <RefreshCcw size={16} className="animate-spin" />
                    Loading photos...
                </p>
            ) : error ? (

                <p className="flex flex-2 bg-yellow-100 text-red-600 px-3 py-1 rounded-md">
                    {error}
                </p>
            ) : photos.length === 0 ? (
                <EmptyState />

            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">

                    {photos.map((photo) => (
                        <div
                            key={photo.publicId}
                            id={`media-${photo.publicId}`}
                            className={`relative group rounded-sm overflow-hidden bg-white hover:shadow-sm transition-shadow ${selectedPhotos.includes(photo.publicId) ? "ring-2 ring-gray-300" : ""
                                }`}
                        >
                            {photo?.resourceType?.startsWith("image") ? (
                                <CldImage
                                    src={photo.publicId}
                                    alt={photo.fileName}
                                    width={360}
                                    height={300}
                                    sizes="100vw"
                                    className="w-full h-40 object-cover"
                                    crop="fill"
                                    gravity="auto"
                                />
                            ) : (
                                <CldVideoPlayer
                                    src={photo.publicId}
                                    width={360}
                                    height={300}
                                    controls
                                    autoPlay={false}
                                    muted={false}
                                    className="w-full h-40 object-cover bg-gray-200 flex items-center justify-center"
                                    colors={{
                                        accent: "#ff0000",
                                        base: "#00ff00",
                                        text: "#0000ff",
                                    }}
                                    fontFace="Source Serif Pro"
                                />
                            )}

                            <div
                                className="absolute bottom-0 left-0 w-full bg-white/90 px-2 py-1 flex items-center justify-between transition-all duration-300
                    opacity-100 group-hover:opacity-100 group-hover:translate-y-0"
                            >
                                <label className="flex items-center gap-1 text-sm cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedPhotos.includes(photo.publicId)}
                                        onChange={() => toggleSelect(photo.publicId)}
                                        className="cursor-pointer"
                                    />
                                    Select
                                </label>

                                <IconButton size="small" title="Full Screen" onClick={() => openFullscreen(photo)}>
                                    <Fullscreen size={16} />
                                </IconButton>
                            </div>
                        </div>
                    ))}</div>
            )}
        </div>
    )
}

export default DisplayFile
