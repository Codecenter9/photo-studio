import React from 'react'
import { useRef, useState } from "react";
import { Folder } from "lucide-react";
import {
    Button,
    Menu,
    Box,
    TextField,
    Divider,
    Typography,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
    CircularProgress,
    SelectChangeEvent
} from "@mui/material";
import axios from 'axios';
import { IUser } from '../../../types/models/user';
import { handleError } from '@/lib/error';

interface FolderPropes {
    activeTab: string,
    selectedClientId?: string | null;
    setSelectedClientId: React.Dispatch<React.SetStateAction<string | null>>;
    users: IUser[];
    fetchFolders: (clientId: string, status: string) => Promise<void>;
    setSnackbarMessage: React.Dispatch<React.SetStateAction<string>>;
    setSnackbarOpen: React.Dispatch<React.SetStateAction<boolean>>;
    anchorEl: null | HTMLElement;
    setAnchorEl: React.Dispatch<React.SetStateAction<null | HTMLElement>>;
    open: boolean;
}
const CreateFolder = ({ activeTab, selectedClientId, setSelectedClientId, users, fetchFolders, setSnackbarMessage, setSnackbarOpen, anchorEl, setAnchorEl, open }: FolderPropes) => {

    const [folderName, setFolderName] = useState("");
    const [clientId, setClientId] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [submitting, setSubmitting] = useState(false);
    const [fieldError, setFieldError] = useState<string>("");

    const handleClose = () => {
        setAnchorEl(null);
        setFieldError("");
    };

    const handleClientChange = (e: SelectChangeEvent<string>) => {
        const value = e.target.value;
        setClientId(value === "" ? null : value);
    };

    const handleCreateFolder = async () => {
        setFieldError("");
        setSubmitting(false);

        const finalClientId = selectedClientId || clientId;

        if (!folderName.trim()) {
            setFieldError("Folder name is required");
            return;
        }

        if (!finalClientId) {
            setFieldError("Please select a client");
            return;
        }

        try {
            setSubmitting(true);
            const response = await axios.post("/api/folders", {
                name: folderName,
                clientId: finalClientId,
                status: activeTab,
            });

            console.log("Folder Created:", response.data);

            setFolderName("");
            setClientId(null);
            handleClose();

            fetchFolders(finalClientId, activeTab);
            setSelectedClientId(finalClientId);
            setSnackbarMessage("Folder created successfully");
            setSnackbarOpen(true);

        } catch (error: unknown) {
            console.error(error);
            setFieldError(
                handleError(error)
            );
        }
        finally {
            setSubmitting(false);
        }
    };
    return (
        <div>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
            >
                <Box sx={{ p: 2, width: 280 }}>

                    <Typography variant="subtitle1" fontWeight={600} mb={1} display="flex" alignItems="center" gap={1}>
                        <Folder size={18} /> Create Folder
                    </Typography>

                    {fieldError && (
                        <span className="text-red-600 text-sm text-start m-3">{fieldError}</span>
                    )}

                    {selectedClientId ? (
                        <Typography variant="body2" color="text.secondary" mb={2}>
                            Creating folder for: <strong>{users.find(u => u._id === selectedClientId)?.name}</strong>
                        </Typography>
                    ) : (
                        <FormControl fullWidth size="small">
                            <InputLabel id="client-select-label">Select Client</InputLabel>
                            <Select
                                labelId="client-select-label"
                                id="client-select"
                                name="clientId"
                                value={clientId ?? ""}
                                label="Select Client"
                                onChange={handleClientChange}
                            >
                                <MenuItem value="">
                                    <em>Select Client</em>
                                </MenuItem>

                                {users.map((client) => (
                                    <MenuItem key={client._id} value={client._id}>
                                        {client.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}

                    <Divider sx={{ my: 2, color: "text.secondary", fontSize: 13 }} />


                    <div className="flex gap-1 items-center">

                        <TextField
                            fullWidth
                            size="small"
                            label="Folder Name"
                            value={folderName}
                            onChange={(e) => setFolderName(e.target.value)}
                            variant="outlined"
                            className="flex flex-3"
                        />

                        {submitting ? (
                            <Button
                                fullWidth
                                variant="outlined"
                                className="flex flex-1 items-center" >
                                <CircularProgress enableTrackSlot size={15} />
                            </Button>
                        ) : (
                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={handleCreateFolder}
                                className="flex flex-1"
                                sx={{
                                    textTransform: "none",
                                    background: "#764ba",
                                    "&:hover": {
                                        background: "#864ba",
                                    },
                                }}
                            >
                                Create
                            </Button>
                        )}
                    </div>

                    <Divider sx={{ my: 2, color: "text.secondary", fontSize: 13 }}>
                        or
                    </Divider>


                    <div className="flex gap-1 items-center">
                        <input
                            placeholder="file upload"
                            type="file"
                            multiple
                            ref={fileInputRef}
                            // onChange={handleFileChange}
                            className="hidden"
                        />

                        <Button
                            fullWidth
                            variant="outlined"
                            // onClick={handleUploadClick}
                            sx={{
                                textTransform: "none",
                                borderColor: "#764ba2",
                                color: "#764ba2",
                                "&:hover": {
                                    borderColor: "#5a67d8",
                                    backgroundColor: "rgba(118, 75, 162, 0.04)",
                                },
                            }}
                        >
                            Choose Files
                        </Button>
                    </div>
                </Box>
            </Menu>
        </div>
    )
}

export default CreateFolder
