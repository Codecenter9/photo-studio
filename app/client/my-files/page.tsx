"use client";
import {
    Typography,
    Alert,
    Snackbar,
    Button,
    CircularProgress,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { IFolder } from "@/types/models/folder";
import axios from "axios";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import ClientFolders from "./clientFolders";
import ClientPhoto from "./files/clientPhoto";
import EmptyState from "@/components/ui/emptyState";

const MyFiles = () => {
    const [selected, setSelected] = useState<number[]>([]);
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
        open: false,
        message: "",
        severity: "success",
    });
    const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
    const [folders, setFolders] = useState<IFolder[]>([]);
    const [loadingFolder, setLoadingFolder] = useState<boolean>(false);

    const [activeTab, setActiveTab] = useState("Edited");

    const Tabs = [
        { label: "Edited Files", key: "Edited" },
        { label: "UnEdited Files", key: "UnEdited" },
    ];

    const currentUser = useCurrentUser();
    const selectedClientId = currentUser.loggedInUser?.id || null;

    const fetchFolders = async (clientId: string, status: string) => {
        try {
            setLoadingFolder(true);
            const response = await axios.get<IFolder[]>("/api/folders", {
                params: {
                    clientId,
                    status,
                },
            });

            setFolders(response.data);
        } catch (err: unknown) {
            console.error("Error fetching folders:", err);
        } finally {
            setLoadingFolder(false);
        }
    };

    useEffect(() => {
        if (!selectedClientId) {
            setFolders([]);
            return;
        }
        fetchFolders(selectedClientId, activeTab);
    }, [selectedClientId, activeTab]);

    const selectedFolder = folders.find((folder) => folder._id === selectedFolderId)

    return (
        <>
            {selectedFolderId ? (
                <ClientPhoto selectedFolder={selectedFolder} setSelectedFolderId={setSelectedFolderId} />
            ) : (
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col lg:flex-row justify-between gap-3">
                        <Typography variant="h5" component="h1" className="font-semibold">
                            My Files:
                            <p className="text-sm text-gray-500">
                                Manage and organize your files here.
                            </p>
                        </Typography >
                        <div className="flex flex-wrap gap-2">
                            {Tabs.map((tab) => (
                                <Button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    variant={activeTab === tab.key ? "contained" : "outlined"}
                                    size="small"
                                >
                                    {tab.label}
                                </Button>
                            ))}
                        </div>
                    </div >

                    {
                        activeTab && (
                            <div className="">
                                {loadingFolder ? (
                                    <span className="w-full h-48 flex gap-2 items-center justify-center text-gray-400">
                                        <CircularProgress enableTrackSlot size={15} />
                                        <p>Loading folders...</p>
                                    </span>
                                ) : folders.length > 0 ? (
                                    <ClientFolders
                                        folders={folders}
                                        loadingFolder={loadingFolder}
                                        selected={selected}
                                        setSelected={setSelected}
                                        selectedClientId={selectedClientId}
                                        setSelectedFolderId={setSelectedFolderId}
                                    />
                                ) : (
                                    <EmptyState title="No folders found for this client." />
                                )}
                            </div>
                        )
                    }
                </div >
            )}

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default MyFiles;