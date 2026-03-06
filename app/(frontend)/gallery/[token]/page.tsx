"use client";

import EmptyState from "@/components/ui/emptyState";
import { handleError } from "@/lib/error";
import { IFile } from "@/types/models/File";
import { IconButton } from "@mui/material";
import axios from "axios";
import 'next-cloudinary/dist/cld-video-player.css';
import { Fullscreen, RefreshCcw } from "lucide-react";
import { CldImage, CldVideoPlayer } from "next-cloudinary";
import { use, useCallback, useEffect, useState } from "react";

export default function GalleryPage({
    params,
}: {
    params: Promise<{ token: string }>;
}) {
    const { token } = use(params);

    const [files, setFiles] = useState<IFile[]>([]);
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState(true);

    const fetchFiles = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const res = await axios.get(`/api/public/gallery/${token}`);

            setFiles(res.data.images);

        } catch (err: unknown) {
            setError(handleError(err));
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchFiles();
    }, [fetchFiles]);

    const openFullscreen = (photo: IFile) => {
        const container = document.getElementById(`media-${photo.publicId}`);
        if (!container) return;

        const mediaElement = container.querySelector('img, video');
        const element = mediaElement || container;

        if (element.requestFullscreen) {
            element.requestFullscreen();
        }
    };

    if (loading) return <p className="p-10">Loading images...</p>;

    return (
        <div className='w-full p-12'>
            {loading ? (
                <p className="flex items-center justify-start gap-1">
                    <RefreshCcw size={16} className="animate-spin" />
                    Loading photos...
                </p>
            ) : error ? (

                <p className="flex bg-yellow-100 text-red-600 px-3 py-1 rounded-md">
                    {error}
                </p>
            ) : files.length === 0 ? (
                <EmptyState title='No files found!' />

            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
                    {
                        files.map((photo) => (
                            <div
                                key={photo.publicId}
                                id={`media-${photo.publicId}`}
                                className={`relative group rounded-sm overflow-hidden bg-white hover:shadow-sm transition-shadow `}
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
                                    <IconButton size="small" title="Full Screen" onClick={() => openFullscreen(photo)}>
                                        <Fullscreen size={16} />
                                    </IconButton>
                                </div>
                            </div>
                        ))
                    }
                </div>
            )}
        </div>
    );
}