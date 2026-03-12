"use client";

import React, { useEffect, useState } from "react";
import { useCalendar } from "@/context/CalendarContext";
import Switch from "@mui/material/Switch";
import { TextField, Button, Snackbar, Alert } from "@mui/material";
import axios from "axios";
import { ISettings } from "@/types/models/settings";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function SettingsPage() {
    const { mode, setMode } = useCalendar();

    const [settings, setSettings] = useState<ISettings>({
        allowUserRegistration: false,
        allowClientBooking: false,
        studioName: "",
        studioEmail: "",
        studioPhone: "",
        studioAddress: "",
    });

    const [userDetail, setUserDetail] = useState({
        name: "",
        email: "",
        phone: "",
    });

    const [loading, setLoading] = useState(false);
    const [updating, setUpdating] = useState(false);

    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState("")

    const currentUser = useCurrentUser();
    const user = currentUser.loggedInUser;

    useEffect(() => {
        if (user) {
            setUserDetail({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
            });
        }
    }, [user]);

    const fetchSettings = async () => {
        try {
            const res = await axios.get("/api/settings");
            setSettings(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleChange = (field: keyof ISettings, value: any) => {
        setSettings((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSaveUser = async () => {
        try {
            setUpdating(true);
            await axios.put(`/api/auth/user/${user?.id}`, userDetail);

            setSnackbarMessage("Profile updated successfully");
            setSnackbarOpen(true);
        } catch (err) {
            console.log(err);
        } finally {
            setUpdating(false);
        }
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            await axios.put("/api/settings", settings);

            setSnackbarMessage("Settings saved successfully");
            setSnackbarOpen(true);
            fetchSettings();
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full flex flex-col gap-8 pb-12">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Settings</h1>
                    <p className="text-sm text-gray-500">
                        Manage your system settings here.
                    </p>
                </div>
            </div>
            <div className="w-full lg:w-[50%] flex items-center justify-between border border-pink-500 rounded-md px-4 py-1">
                <span className="text-sm font-medium">
                    {mode === "ethiopian"
                        ? "የኢትዮጵያ የቀን አቆጣጠር ይጠቀሙ"
                        : "Using Gregorian Calendar"}
                </span>

                <Switch
                    checked={mode === "ethiopian"}
                    onChange={(e) =>
                        setMode(e.target.checked ? "ethiopian" : "gregorian")
                    }
                />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                <div className="flex flex-col gap-5 p-5 border border-gray-300 rounded-md">
                    <h1 className="text-xl md:text-2xl font-serif">Personal Profile</h1>
                    <hr className="h-1 text-gray-300" />

                    <TextField
                        label="Name"
                        value={userDetail.name}
                        onChange={(e) =>
                            setUserDetail((prev) => ({
                                ...prev,
                                name: e.target.value,
                            }))
                        }
                        fullWidth
                        size="small"
                    />

                    <TextField
                        label="Email / Username"
                        value={userDetail.email}
                        onChange={(e) =>
                            setUserDetail((prev) => ({
                                ...prev,
                                email: e.target.value,
                            }))
                        }
                        fullWidth
                        size="small"
                    />

                    <TextField
                        label="Phone"
                        value={userDetail.phone}
                        onChange={(e) =>
                            setUserDetail((prev) => ({
                                ...prev,
                                phone: e.target.value,
                            }))
                        }
                        fullWidth
                        size="small"
                    />

                    <TextField
                        value={user?.role}
                        disabled
                        fullWidth
                        size="small"
                    />

                    <Button
                        variant="contained"
                        onClick={handleSaveUser}
                        disabled={updating}
                        color="success"
                    >
                        {updating ? "Updating..." : "Update Profile"}
                    </Button>
                </div>
                <div className="flex flex-col gap-5 p-5 border border-gray-300 rounded-md">
                    <h1 className="text-xl md:text-2xl font-serif">System Setting</h1>
                    <hr className="h-1 text-gray-300" />
                    <div className="flex items-center justify-between border border-purple-500 rounded-md px-4 py-1">
                        <span className="text-sm font-medium">
                            Allow User Registration
                        </span>

                        <Switch
                            checked={settings.allowUserRegistration}
                            onChange={(e) =>
                                handleChange("allowUserRegistration", e.target.checked)
                            }
                        />
                    </div>

                    <div className="flex items-center justify-between border border-purple-500 rounded-md px-4 py-1">
                        <span className="text-sm font-medium">
                            Allow Client Booking
                        </span>

                        <Switch
                            checked={settings.allowClientBooking}
                            onChange={(e) =>
                                handleChange("allowClientBooking", e.target.checked)
                            }
                        />
                    </div>

                    <TextField
                        label="Studio Name"
                        value={settings.studioName}
                        onChange={(e) => handleChange("studioName", e.target.value)}
                        fullWidth
                        size="small"
                    />

                    <TextField
                        label="Studio Email"
                        value={settings.studioEmail}
                        onChange={(e) => handleChange("studioEmail", e.target.value)}
                        fullWidth
                        size="small"
                    />

                    <TextField
                        label="Studio Phone"
                        value={settings.studioPhone}
                        onChange={(e) => handleChange("studioPhone", e.target.value)}
                        fullWidth
                        size="small"
                    />

                    <TextField
                        label="Studio Address"
                        value={settings.studioAddress}
                        onChange={(e) => handleChange("studioAddress", e.target.value)}
                        fullWidth
                        size="small"
                    />

                    <Button
                        variant="contained"
                        onClick={handleSave}
                        disabled={loading}
                    >
                        {loading ? "Updating..." : "Update Profile"}
                    </Button>
                </div>
            </div>
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
        </div>
    );
}