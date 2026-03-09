"use client";

import EmptyState from "@/components/ui/emptyState";
import { handleError } from "@/lib/error";
import { IFile } from "@/types/models/File";
import { Button, IconButton } from "@mui/material";
import axios from "axios";
import 'next-cloudinary/dist/cld-video-player.css';
import { Fullscreen, RefreshCcw } from "lucide-react";
import { CldImage, CldVideoPlayer } from "next-cloudinary";
import { use, useCallback, useEffect, useState } from "react";
import { ISettings } from "@/types/models/settings";

export default function GalleryPage({
    params,
}: {
    params: Promise<{ token: string }>;
}) {
    const { token } = use(params);

    const [files, setFiles] = useState<IFile[]>([]);
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [fileTypeActiveTab, setFileTypeActiveTab] = useState("Image");

    const FileTypeTab = [
        { label: "Images", key: "Image" },
        { label: "Videos", key: "Video" },
    ]

    const [settings, setSettings] = useState<ISettings>();

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await axios.get('/api/settings');

                setSettings(response.data);
            } catch (error) {
                console.log("failed to fetch settings", error);
            }
        }
        fetchSettings();
    }, [])

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

    const filteredFiles = files.filter(photo => {
        if (fileTypeActiveTab === "Image") {
            return photo.resourceType === "image";
        }
        if (fileTypeActiveTab === "Video") {
            return photo.resourceType === "video";
        }
        return true;
    })

    return (
        <main className="pt-12 min-h-screen flex-1 bg-gray-100 p-6 md:px-12 lg:px-16">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col lg:flex-row justify-between gap-3">
                    <div className="font-serif">
                        <h1 className="text-2xl font-bold">Files</h1>
                    </div >
                    <div className="flex gap-2">
                        {FileTypeTab.map((tab) => (
                            <Button
                                key={tab.key}
                                onClick={() => setFileTypeActiveTab(tab.key)}
                                variant={fileTypeActiveTab === tab.key ? "contained" : "outlined"}
                                size="small"
                            >
                                {tab.label}
                            </Button>
                        ))}
                    </div>
                </div >
                {loading ? (
                    <p className="flex items-center justify-start gap-1">
                        <RefreshCcw size={16} className="animate-spin" />
                        Loading photos...
                    </p>
                ) : error ? (

                    <p className="flex bg-yellow-100 text-red-600 px-3 py-1 rounded-md">
                        {error}
                    </p>
                ) : filteredFiles.length === 0 ? (
                    <EmptyState title='No files found!' />

                ) : (

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
                        <div className="col-span-3">
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
                                {
                                    filteredFiles.map((photo) => (
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
                                                className="absolute top-0 right-0 w-max bg-gray-900/30 text-white rounded-sm flex items-center transition-all duration-300
                    opacity-100 group-hover:opacity-100 group-hover:translate-y-0"
                                            >
                                                <IconButton size="small" title="Full Screen" onClick={() => openFullscreen(photo)}>
                                                    <Fullscreen size={16} className="text-white" />
                                                </IconButton>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                        <div className="h-max flex flex-col items-center border border-gray-300 rounded-md p-6">       <div className="flex items-center flex-col gap-2">
                            <span className="text-center font-serif p-6 rounded-full bg-gray-300 border text-2xl font-bold uppercase">
                                {settings?.studioName.substring(0, 2)}
                            </span>
                            <div className="w-full flex flex-col gap-1 items-center mt-2">
                                <span className="w-full flex justify-between gap-2 text-sm bg-gray-900/5 border border-gray-300 px-3 py-1 rounded-md font-serif">
                                    <p>Name:</p>
                                    {settings?.studioName}
                                </span>
                                <span className="w-full flex justify-between gap-2 text-sm bg-gray-900/5 border border-gray-300 px-3 py-1 rounded-md font-serif">
                                    <p>Phone:</p>
                                    {settings?.studioPhone}
                                </span>
                                <span className="w-full flex justify-between gap-2 text-sm bg-gray-900/5 border border-gray-300 px-3 py-1 rounded-md font-serif">
                                    <p>Email:</p>
                                    {settings?.studioEmail}
                                </span>
                                <span className="w-full flex justify-between gap-2 text-sm bg-gray-900/5 border border-gray-300 px-3 py-1 rounded-md font-serif">
                                    <p>Address:</p>
                                    {settings?.studioAddress}
                                </span>
                            </div>
                        </div>
                        </div>
                    </div>
                )}
            </div>

        </main>
    );
}