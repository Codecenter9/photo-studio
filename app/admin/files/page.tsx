"use client";

import ClientsSection from "../files/clientsSection";
import FolderSection from "../files/folderSection";
import { useEffect, useMemo, useState } from "react";
import {
    Button,
    Snackbar,
    Alert,
    CircularProgress,
} from "@mui/material";

import {
} from "@mui/material";
import axios from "axios";
import CreateFolder from "./createFolder";
import PhotoSection from "./components/photoSection";
import { IUser } from "@/types/models/user";
import { IFolder } from "@/types/models/folder";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { handleError } from "@/lib/error";

const Photos = () => {
    const [selected, setSelected] = useState<number[]>([]);
    const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const [users, setUsers] = useState<IUser[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
    const [folders, setFolders] = useState<IFolder[]>([]);
    const [loadingFolder, setLoadingFolder] = useState<boolean>(false);

    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState("")

    const [activeTab, setActiveTab] = useState("Edited");

    const open = Boolean(anchorEl);

    const Tabs = [
        { label: "Edited", key: "Edited" },
        { label: "UnEdited", key: "UnEdited" },
    ];

    const { loggedInUser } = useCurrentUser();
    const loggedInUserId = loggedInUser?.id;

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await axios.get("/api/auth/user");

            const fetchedUsers = response.data.filter(
                (user: IUser) => user.role === "client"
            );

            setUsers(fetchedUsers);
        } catch (err: unknown) {
            setError(handleError(err));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchFolders = async (clientId: string, status: string) => {
        setLoadingFolder(true);
        try {
            const response = await axios.get<IFolder[]>("/api/folders", {
                params: {
                    clientId,
                    status,
                },
            });

            setFolders(response.data);
        } catch (err: unknown) {
            setError(handleError(err));
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

    const selectedClient = users.find((user) => user._id === selectedClientId);

    const selectedFolder = folders.find((folder) => folder._id === selectedFolderId)

    const filteredFolders = useMemo(() => {
        return folders.filter(folder => folder.status === activeTab);
    }, [folders, activeTab]);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    return (
        <>

            {selectedFolderId ? (
                <PhotoSection selectedClient={selectedClient} userId={loggedInUserId} selectedFolder={selectedFolder} setSelectedFolderId={setSelectedFolderId} />
            ) : (
                <div className="h-screen w-full flex flex-col lg:flex-row gap-4 border rounded-lg border-gray-300 overflow-hidden ">
                    <div className={`${selectedFolderId ? "hidden" : "flex"} w-full lg:w-1/4 border-b lg:border-b-0 lg:border-r border-gray-300 flex-col`}>
                        <ClientsSection selectedClientId={selectedClientId} setSelectedClientId={setSelectedClientId} users={users} loading={loading} error={error} />
                    </div>

                    <div className="w-full lg:w-3/4 flex flex-col overflow-hidden">
                        <div className="flex justify-between gap-3 p-6 pb-2 border-b border-gray-300">
                            <div className="flex items-center gap-3">
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
                            <div className="flex">
                                <Button onClick={handleClick} variant="outlined" size="small">
                                    Create Folder
                                </Button>
                            </div>
                        </div>

                        {activeTab && (
                            <div className="flex-1 p-4 pt-2 overflow-y-auto scrollbar-thin">
                                <div className="flex-1 pt-2 overflow-y-auto scrollbar-thin">
                                    {loadingFolder ? (
                                        <span className="h-max overflow-hidden flex items-center gap-2">
                                            <CircularProgress enableTrackSlot size={15} />
                                            <p>Loading folders...</p>
                                        </span>
                                    ) : filteredFolders.length > 0 ? (
                                        <FolderSection
                                            folders={filteredFolders}
                                            loadingFolder={loadingFolder}
                                            selected={selected}
                                            setSelected={setSelected}
                                            selectedClientId={selectedClientId}
                                            setSelectedFolderId={setSelectedFolderId}
                                        />
                                    ) : (
                                        !selectedClientId ? (
                                            <div className="w-full h-48 flex items-center justify-center text-gray-400">
                                                <p>Please select a client to view folders.</p>
                                            </div>
                                        ) : (
                                            <div className="w-full h-48 flex items-center justify-center text-gray-400">
                                                <p>No folders found for this client.</p>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <CreateFolder
                        activeTab={activeTab}
                        fetchFolders={fetchFolders}
                        selectedClientId={selectedClientId}
                        setSelectedClientId={setSelectedClientId}
                        setAnchorEl={setAnchorEl}
                        users={users} open={open}
                        anchorEl={anchorEl}
                        setSnackbarOpen={setSnackbarOpen}
                        setSnackbarMessage={setSnackbarMessage}
                    />
                </div>
            )}

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <Alert
                    onClose={() => setSnackbarOpen(false)}
                    severity="success"
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default Photos;
