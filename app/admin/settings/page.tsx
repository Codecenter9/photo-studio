
"use client";

import React from "react";
import { useCalendar } from "@/context/CalendarContext";
import Switch from "@mui/material/Switch";

export default function SettingsPage() {
    const { mode, setMode } = useCalendar();

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Settings</h1>
                    <p className="text-sm text-gray-500">
                        Manage your system settings here.
                    </p>
                </div >
            </div >

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-3">
                <div className="flex items-center justify-between bg-muted/40 border border-pink-500 rounded-lg px-4 py-1">
                    <div className="flex flex-col">
                        <span className="text-sm font-medium">
                            {mode === "ethiopian"
                                ? "የኢትዮጵያ የቀን አቆጣጠር ይጠቀሙ"
                                : "Using Gregorian Calendar"}
                        </span>
                    </div>
                    <Switch
                        checked={mode === "ethiopian"}
                        onChange={(e) => setMode(e.target.checked ? "ethiopian" : "gregorian")}
                    />
                </div>
                <div className="flex items-center justify-between bg-muted/40 border border-pink-500 rounded-lg px-4 py-1">
                    <div className="flex flex-col">
                        <span className="text-sm font-medium">
                            {mode === "ethiopian"
                                ? "የኢትዮጵያ የቀን አቆጣጠር ይጠቀሙ"
                                : "Using Gregorian Calendar"}
                        </span>
                    </div>
                    <Switch
                        checked={mode === "ethiopian"}
                        onChange={(e) => setMode(e.target.checked ? "ethiopian" : "gregorian")}
                    />
                </div>
                <div className="flex items-center justify-between bg-muted/40 border border-pink-500 rounded-lg px-4 py-1">
                    <div className="flex flex-col">
                        <span className="text-sm font-medium">
                            {mode === "ethiopian"
                                ? "የኢትዮጵያ የቀን አቆጣጠር ይጠቀሙ"
                                : "Using Gregorian Calendar"}
                        </span>
                    </div>
                    <Switch
                        checked={mode === "ethiopian"}
                        onChange={(e) => setMode(e.target.checked ? "ethiopian" : "gregorian")}
                    />
                </div>
                <div className="flex items-center justify-between bg-muted/40 border border-pink-500 rounded-lg px-4 py-1">
                    <div className="flex flex-col">
                        <span className="text-sm font-medium">
                            {mode === "ethiopian"
                                ? "የኢትዮጵያ የቀን አቆጣጠር ይጠቀሙ"
                                : "Using Gregorian Calendar"}
                        </span>
                    </div>
                    <Switch
                        checked={mode === "ethiopian"}
                        onChange={(e) => setMode(e.target.checked ? "ethiopian" : "gregorian")}
                    />
                </div>
            </div>
        </div>
    );
}