"use client";

import EmptyState from "@/components/ui/emptyState";
import { handleError } from "@/lib/error";
import { IFile } from "@/types/models/File";
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";
import axios from "axios";
import 'next-cloudinary/dist/cld-video-player.css';
import { CheckCheck, Copy, Fullscreen, RefreshCcw, Settings } from "lucide-react";
import { CldImage, CldVideoPlayer } from "next-cloudinary";
import { useCallback, useEffect, useState } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import QRCode from "react-qr-code";
export default function GalleryPage() {

    const [files, setFiles] = useState<IFile[]>([]);
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState(true);

    const currentUser = useCurrentUser();
    const userId = currentUser?.loggedInUser?.id;

    const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
    const [fileTypeActiveTab, setFileTypeActiveTab] = useState("Image");
    const [submitting, setSubmitting] = useState(false);

    const [openModal, setOpenModal] = useState(false);
    const [generatingQrCode, setGeneratingQrCode] = useState(false);
    const [qrGenerateError, setQrGenerateError] = useState<string>("");

    const [url, setUrl] = useState("");

    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(url);
        setCopied(true);

        setTimeout(() => setCopied(false), 2000);
    };


    const toggleSelect = (id: string) => {
        setSelectedPhotos((prev) =>
            prev.includes(id)
                ? prev.filter((i) => i !== id)
                : [...prev, id]
        );
    };

    const FileTypeTab = [
        { label: "Images", key: "Image" },
        { label: "Videos", key: "Video" },
    ]

    const generateQRCode = async () => {
        setQrGenerateError("");
        setGeneratingQrCode(false);
        try {
            const response = await axios.post("/api/generate-qr");

            setUrl(response.data.url);
        } catch (error) {
            setQrGenerateError(handleError(error));
        } finally {
            setGeneratingQrCode(false);
        }
    };

    const shareQR = async () => {
        if (!navigator.share) {
            alert("Sharing not supported on this device");
            return;
        }

        await navigator.share({
            title: "Client Gallery",
            text: "Scan this QR to view photos",
            url: url,
        });
    };

    const fetchFiles = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const res = await axios.get(`/api/photo/${userId}`);

            setFiles(res.data.photos);

        } catch (err: unknown) {
            setError(handleError(err));
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchFiles();
    }, [fetchFiles]);

    const handleSelectAllToggle = () => {
        if (filteredFiles.length === 0) return;

        const allSelected = filteredFiles.every(photo =>
            selectedPhotos.includes(photo.publicId)
        );

        if (allSelected) {
            setSelectedPhotos(prev =>
                prev.filter(id => !filteredFiles.some(p => p.publicId === id))
            );
        } else {
            const newSelections = filteredFiles
                .map(p => p.publicId)
                .filter(id => !selectedPhotos.includes(id));

            setSelectedPhotos(prev => [...prev, ...newSelections]);
        }
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

    const handleMakePublic = async () => {
        if (selectedPhotos.length === 0) return;
        setSubmitting(true);
        try {
            const updatedData = selectedPhotos.map(photoId => {
                const photo = files.find(p => p.publicId === photoId);
                if (!photo) return null;
                return {
                    publicId: photoId,
                    isPublic: photo.isPublic === true ? false : false,
                };
            }).filter(Boolean);

            const photoIds = updatedData.map(u => u!.publicId);

            await axios.patch("/api/photo/actions", {
                action: "update",
                photoIds,
                data: { isPublic: updatedData[0]?.isPublic },
            });

            fetchFiles();
            setSelectedPhotos([]);
        } catch (error) {
            console.error("Bulk update failed", error);
        } finally {
            setSubmitting(false);
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
    });

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between gap-3">
                    <div className="font-serif">
                        <h1 className="text-2xl font-bold">Dashboard</h1>
                        <p className="hidden lg:flex text-sm text-gray-500">
                            Manage and organize your files here.
                        </p>
                    </div >
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 justify-start">
                            <Typography className="flex items-center text-sm font-light gap-2 capitalize">
                                <span className="hidden lg:flex nr-1">Selected</span>
                                <span className="px-2 py-0.5 rounded-full items-center bg-amber-100 hover:bg-amber-200">
                                    {selectedPhotos.length}
                                </span>
                            </Typography>
                            <div
                                className="cursor-pointer">
                                {filteredFiles.length > 0 &&
                                    filteredFiles.every(p => selectedPhotos.includes(p.publicId)) ? (
                                    <span onClick={handleSelectAllToggle} className="hidden lg:flex items-center max-w-max bg-red-100 px-2 py-0 rounded-md hover:bg-red-200 hover:text-red-500  transition-all duration-300">
                                        Unselect All
                                        <span className="">
                                            <Checkbox
                                                size="small"
                                                checked={
                                                    filteredFiles.length > 0 &&
                                                    filteredFiles.every(p => selectedPhotos.includes(p.publicId))
                                                }

                                                indeterminate={
                                                    filteredFiles.some(p => selectedPhotos.includes(p.publicId)) &&
                                                    !filteredFiles.every(p => selectedPhotos.includes(p.publicId))
                                                }
                                                onChange={handleSelectAllToggle}
                                            />
                                        </span>
                                    </span>
                                ) : (
                                    <span onClick={handleSelectAllToggle} className="hidden lg:flex items-center bg-gray-200 px-2 py-0 rounded-md hover:bg-gray-300 hover:text-gray-950  transition-all duration-300">
                                        Select All
                                        <span className="">
                                            <Checkbox
                                                size="small"
                                                checked={
                                                    filteredFiles.length > 0 &&
                                                    filteredFiles.every(p => selectedPhotos.includes(p.publicId))
                                                }

                                                indeterminate={
                                                    filteredFiles.some(p => selectedPhotos.includes(p.publicId)) &&
                                                    !filteredFiles.every(p => selectedPhotos.includes(p.publicId))
                                                }
                                                onChange={handleSelectAllToggle}
                                            />
                                        </span>
                                    </span>
                                )}
                                <span className="flex lg:hidden">
                                    <Checkbox
                                        size="medium"
                                        checked={
                                            filteredFiles.length > 0 &&
                                            filteredFiles.every(p => selectedPhotos.includes(p.publicId))
                                        }

                                        indeterminate={
                                            filteredFiles.some(p => selectedPhotos.includes(p.publicId)) &&
                                            !filteredFiles.every(p => selectedPhotos.includes(p.publicId))
                                        }
                                        onChange={handleSelectAllToggle}
                                    />
                                </span>
                            </div>
                        </div>
                        <div onClick={() => {
                            if (selectedPhotos.length === 0) {
                                alert("Please select at least 1 file");
                                return;
                            }
                            handleMakePublic();
                        }}
                            title="Public"
                            className="flex items-center gap-2 cursor-pointer bg-cyan-100 px-2 py-1.5 rounded-md hover:bg-cyan-200 hover:text-gray-950  transition-all duration-300"
                        >

                            <span className="">
                                {submitting ? "Submiting..." : "Make Private"}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="w-full flex items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                        <Button variant="contained" size="small">
                            Public Files
                        </Button>
                        <div onClick={() => setOpenModal(true)} className="flex gap-1 items-center p-2 lg:py-1 cursor-pointer bg-gray-200 hover:bg-gray-300 rounded-full lg:rounded-md transition-all duration-300">
                            <Settings />
                            <span className="hidden lg:flex">Generate QR Code</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
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
            </div>

            {loading ? (
                <p className="flex items-center justify-start gap-1">
                    <RefreshCcw size={16} className="animate-spin" />
                    Loading photos...
                </p>
            ) : error ? (

                <p className="flex bg-yellow-100 text-red-600 px-3 py-1 rounded-md">
                    {error}
                </p>
            ) : filteredFiles?.length === 0 ? (
                <EmptyState title='No files found!' />

            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
                    {
                        filteredFiles?.map((photo) => (
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
                        ))
                    }
                </div>
            )}

            <div className="flex items-center justify-center">
                <Dialog maxWidth="sm" open={openModal} onClose={() => setOpenModal(false)} >
                    <DialogTitle>
                        <div className="flex items-center justify-between gap-3">
                            <span className="text-normal font-serif">Generate QR Code for public viewers</span>
                            <button
                                onClick={shareQR}
                                className="hidden lg:flex bg-purple-600 text-sm cursor-pointer text-white px-3 py-1 rounded"
                            >
                                Share QR
                            </button>
                        </div>
                    </DialogTitle>
                    <hr className='h-1 text-gray-300' />
                    <DialogContent>
                        {qrGenerateError && (
                            <p className="flex bg-yellow-100 text-red-600 px-3 py-1 rounded-md">
                                {error}
                            </p>
                        )}
                        {url && (
                            <div className="flex flex-col gap-3 items-center w-full justify-between p-6">
                                <div className="flex items-center w-full justify-center">
                                    <QRCode value={url} size={200} />
                                </div>
                                <div className="hidden lg:flex items-center gap-2 mt-2">
                                    <p className="text-sm break-all">{url}</p>

                                    <button
                                        onClick={handleCopy}
                                        className="p-1 hover:bg-gray-200 rounded cursor-pointer"
                                        title="Copy URL"
                                    >
                                        {copied ? <CheckCheck size={16} /> : <Copy size={16} />}
                                    </button>

                                </div>
                            </div>
                        )}
                    </DialogContent>
                    <hr className='h-1 text-gray-300' />
                    <DialogActions>
                        <Button onClick={() => setOpenModal(false)}>Cancel</Button>
                        <Button onClick={generateQRCode} color="info">
                            {generatingQrCode ? "Generating..." : "Generate QR Code"}
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    );
}