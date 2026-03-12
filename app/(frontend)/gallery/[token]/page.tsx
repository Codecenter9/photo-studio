"use client";

import EmptyState from "@/components/ui/emptyState";
import { handleError } from "@/lib/error";
import { IFile } from "@/types/models/File";
import { Button, IconButton } from "@mui/material";
import axios from "axios";
import "next-cloudinary/dist/cld-video-player.css";

import { RefreshCcw, Maximize } from "lucide-react";
import { CldImage, CldVideoPlayer } from "next-cloudinary";

import { use, useCallback, useEffect, useMemo, useState } from "react";
import { ISettings } from "@/types/models/settings";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

import Zoom from "yet-another-react-lightbox/plugins/zoom";
import FullscreenPlugin from "yet-another-react-lightbox/plugins/fullscreen";
import Video from "yet-another-react-lightbox/plugins/video";

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
    const [lightboxIndex, setLightboxIndex] = useState(-1);

    const [settings, setSettings] = useState<ISettings>();

    const FileTypeTab = [
        { label: "Images", key: "Image" },
        { label: "Videos", key: "Video" },
    ];

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await axios.get("/api/settings");
                setSettings(response.data);
            } catch (error) {
                console.log("failed to fetch settings", error);
            }
        };

        fetchSettings();
    }, []);

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

    const filteredFiles = useMemo(() => {
        return files.filter((photo) => {
            if (fileTypeActiveTab === "Image") return photo.resourceType === "image";
            if (fileTypeActiveTab === "Video") return photo.resourceType === "video";
            return true;
        });
    }, [files, fileTypeActiveTab]);

    const slides = filteredFiles.map((file) => {
        if (file.resourceType === "video") {
            return {
                type: "video" as const,
                sources: [
                    {
                        src: `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload/${file.publicId}.mp4`,
                        type: "video/mp4",
                    },
                ],
            };
        }

        return {
            src: `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${file.publicId}`,
        };
    });

    return (
        <main className="pt-24 min-h-screen flex-1 bg-gray-100 p-6 md:px-12 lg:px-16">
            <div className="flex flex-col gap-6">

                {/* Header */}
                <div className="flex flex-col lg:flex-row justify-between gap-3">
                    <div className="font-serif">
                        <h1 className="text-2xl font-bold">Files</h1>
                    </div>

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
                </div>

                {loading ? (
                    <p className="flex items-center gap-2">
                        <RefreshCcw size={16} className="animate-spin" />
                        Loading files...
                    </p>

                ) : error ? (

                    <p className="flex bg-yellow-100 text-red-600 px-3 py-1 rounded-md">
                        {error}
                    </p>

                ) : filteredFiles.length === 0 ? (

                    <EmptyState title="No files found!" />

                ) : (

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">

                        <div className="col-span-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                                {filteredFiles.map((photo, index) => (

                                    <div
                                        key={photo.publicId}
                                        className="relative group rounded-sm overflow-hidden bg-white hover:shadow-sm transition-shadow"
                                    >

                                        {photo.resourceType === "image" ? (

                                            <CldImage
                                                src={photo.publicId}
                                                alt={photo.fileName}
                                                width={360}
                                                height={300}
                                                sizes="100vw"
                                                crop="fill"
                                                gravity="auto"
                                                className="w-full h-80  object-cover cursor-pointer"
                                                onClick={() => setLightboxIndex(index)}
                                            />

                                        ) : (

                                            // <div onClick={() => setLightboxIndex(index)}>
                                            <CldVideoPlayer
                                                src={photo.publicId}
                                                width={360}
                                                height={300}
                                                controls
                                                className="w-full h-40 object-cover cursor-pointer"
                                            />
                                            // </div>

                                        )}

                                        <div className="absolute top-1 right-1 bg-black/40 rounded-sm opacity-0 group-hover:opacity-100 transition">

                                            <IconButton
                                                size="small"
                                                onClick={() => setLightboxIndex(index)}
                                            >
                                                <Maximize size={16} className="text-white" />
                                            </IconButton>

                                        </div>

                                    </div>

                                ))}

                            </div>
                        </div>

                        <div className="h-max flex flex-col items-center border border-gray-300 rounded-md p-6">

                            <span className="text-center font-serif p-6 rounded-full bg-gray-300 border text-2xl font-bold uppercase">
                                {settings?.studioName?.substring(0, 2)}
                            </span>

                            <div className="w-full flex flex-col gap-1 items-center mt-2">

                                <span className="w-full flex justify-between text-sm bg-gray-900/5 border border-gray-300 px-3 py-1 rounded-md font-serif">
                                    <p>Name:</p>
                                    {settings?.studioName}
                                </span>

                                <span className="w-full flex justify-between text-sm bg-gray-900/5 border border-gray-300 px-3 py-1 rounded-md font-serif">
                                    <p>Phone:</p>
                                    {settings?.studioPhone}
                                </span>

                                <span className="w-full flex justify-between text-sm bg-gray-900/5 border border-gray-300 px-3 py-1 rounded-md font-serif">
                                    <p>Email:</p>
                                    {settings?.studioEmail}
                                </span>

                                <span className="w-full flex justify-between text-sm bg-gray-900/5 border border-gray-300 px-3 py-1 rounded-md font-serif">
                                    <p>Address:</p>
                                    {settings?.studioAddress}
                                </span>

                            </div>
                        </div>

                    </div>
                )}

            </div>

            {/* Lightbox */}
            <Lightbox
                open={lightboxIndex >= 0}
                close={() => setLightboxIndex(-1)}
                index={lightboxIndex}
                slides={slides}
                plugins={[Zoom, FullscreenPlugin, Video]}
            />

        </main>
    );
}