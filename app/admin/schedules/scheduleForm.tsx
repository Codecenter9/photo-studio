"use client";

import DialogBox from "@/components/ui/modal";
import {
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Switch,
    TextField,
    Typography,
    FormControlLabel,
    SelectChangeEvent,
} from "@mui/material";
import React, { useRef, useState } from "react";
import { IUser } from "../../../types/models/user";
import axios from "axios";

interface UserFormProps {
    open: boolean;
    users: IUser[];
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setSnackbarMessage: React.Dispatch<React.SetStateAction<string>>;
    setSnackbarOpen: React.Dispatch<React.SetStateAction<boolean>>;
    fetchUsers: () => void;
}

interface FieldErrors {
    clientId?: string;
    name?: string;
    phone?: string;
    scheduleType?: string;
    customScheduleType?: string;
}

const ScheduleForm = ({
    open,
    setOpen,
    users,
    fetchUsers,
    setSnackbarOpen,
    setSnackbarMessage,
}: UserFormProps) => {
    const hiddenSubmitRef = useRef<HTMLButtonElement>(null);

    const [loading, setLoading] = useState(false);
    const [isExistingClient, setIsExistingClient] = useState(false);
    const [isOtherType, setIsOtherType] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

    const clients = users.filter((user) => user.role === "client");

    const [formData, setFormData] = useState({
        clientId: "",
        name: "",
        phone: "",
        scheduleType: "",
        customScheduleType: "",
        notes: "",
    });

    const ScheduleTypes = [
        { label: "Wedding", key: "wedding" },
        { label: "Birthday", key: "birthday" },
        { label: "Baby Shower", key: "babyshower" },
        { label: "Shimglna", key: "shimglna" },
        { label: "Pre Wedding", key: "prewedding" },
        { label: "Other", key: "other" },
    ];

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (e: SelectChangeEvent<string>) => {
        const { name, value } = e.target;

        if (name === "scheduleType") {
            setIsOtherType(value === "other");
        }

        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validate = (): boolean => {
        const errors: FieldErrors = {};

        if (isExistingClient) {
            if (!formData.clientId) {
                errors.clientId = "Please select a client.";
            }
        } else {
            if (!formData.name.trim()) {
                errors.name = "Client name is required.";
            }
            if (!formData.phone.trim()) {
                errors.phone = "Phone number is required.";
            }
        }

        if (!formData.scheduleType) {
            errors.scheduleType = "Schedule type is required.";
        }

        if (formData.scheduleType === "other") {
            if (!formData.customScheduleType.trim()) {
                errors.customScheduleType =
                    "Please enter custom schedule type.";
            }
        }

        setFieldErrors(errors);

        return Object.keys(errors).length === 0;
    };

    const resetForm = () => {
        setFormData({
            clientId: "",
            name: "",
            phone: "",
            scheduleType: "",
            customScheduleType: "",
            notes: "",
        });
        setIsExistingClient(false);
        setIsOtherType(false);
        setFieldErrors({});
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        setLoading(true);

        const finalScheduleType =
            formData.scheduleType === "other"
                ? formData.customScheduleType
                : formData.scheduleType;

        const payload = {
            clientId: isExistingClient ? formData.clientId : null,
            name: isExistingClient ? null : formData.name,
            phone: isExistingClient ? null : formData.phone,
            scheduleType: finalScheduleType,
            notes: formData.notes,
        };

        try {
            const response = await axios.post("/api/schedule", payload);

            if (response.status === 200 || response.status === 201) {
                setSnackbarMessage("Schedule created successfully!");
                setSnackbarOpen(true);
                setOpen(false);
                resetForm();
                fetchUsers();
            }
        } catch (error: any) {
            console.log("error:", error)
            setSnackbarMessage("Something went wrong!");
            setSnackbarOpen(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DialogBox
            open={open}
            title="Create Schedule"
            onClose={() => setOpen(false)}
            onSave={() => hiddenSubmitRef.current?.click()}
            maxWidth="md"
            saveLabel={
                loading ? (
                    <span className="flex items-center gap-2">
                        <CircularProgress size={15} /> Saving...
                    </span>
                ) : (
                    "Save"
                )
            }
        >
            <form
                onSubmit={handleSubmit}
                className="w-sm lg:w-md flex flex-col gap-6 mt-3"
            >

                <div className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-all duration-300 rounded-md px-3 py-0">
                    <Typography fontSize={14} fontWeight={500}>
                        Use Existing Client
                    </Typography>

                    <FormControlLabel
                        control={
                            <Switch
                                checked={isExistingClient}
                                onChange={(e) =>
                                    setIsExistingClient(e.target.checked)
                                }
                            />
                        }
                        label=""
                    />
                </div>

                {isExistingClient ? (
                    <FormControl
                        fullWidth
                        size="small"
                        error={!!fieldErrors.clientId}
                    >
                        <InputLabel>Select Client</InputLabel>
                        <Select
                            name="clientId"
                            value={formData.clientId}
                            label="Select Client"
                            onChange={handleSelectChange}
                        >
                            {clients.map((user) => (
                                <MenuItem key={user._id} value={user._id}>
                                    {user.name}
                                </MenuItem>
                            ))}
                        </Select>
                        {fieldErrors.clientId && (
                            <Typography color="error" fontSize={12}>
                                {fieldErrors.clientId}
                            </Typography>
                        )}
                    </FormControl>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <TextField
                            label="Client Name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            error={!!fieldErrors.name}
                            helperText={fieldErrors.name}
                            fullWidth
                            size="small"
                        />
                        <TextField
                            label="Phone Number"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            error={!!fieldErrors.phone}
                            helperText={fieldErrors.phone}
                            fullWidth
                            size="small"
                        />
                    </div>
                )}

                <FormControl
                    fullWidth
                    size="small"
                    error={!!fieldErrors.scheduleType}
                >
                    <InputLabel>Schedule Type</InputLabel>
                    <Select
                        name="scheduleType"
                        value={formData.scheduleType}
                        label="Schedule Type"
                        onChange={handleSelectChange}
                    >
                        {ScheduleTypes.map((type) => (
                            <MenuItem key={type.key} value={type.key}>
                                {type.label}
                            </MenuItem>
                        ))}
                    </Select>
                    {fieldErrors.scheduleType && (
                        <Typography color="error" fontSize={12}>
                            {fieldErrors.scheduleType}
                        </Typography>
                    )}
                </FormControl>

                {isOtherType && (
                    <TextField
                        label="Custom Schedule Type"
                        name="customScheduleType"
                        value={formData.customScheduleType}
                        onChange={handleInputChange}
                        error={!!fieldErrors.customScheduleType}
                        helperText={fieldErrors.customScheduleType}
                        fullWidth
                        size="small"
                    />
                )}

                <TextField
                    fullWidth
                    label="Notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    multiline
                    rows={3}
                    size="small"
                />

                <button
                    title="submit"
                    type="submit"
                    ref={hiddenSubmitRef}
                    className="hidden"
                />
            </form>
        </DialogBox>
    );
};

export default ScheduleForm;