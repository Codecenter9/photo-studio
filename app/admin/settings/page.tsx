
"use client";

import React from "react";
import { useCalendar } from "@/context/CalendarContext";
import Switch from "@mui/material/Switch";

export default function SettingsPage() {
    const { mode, setMode } = useCalendar();

    return (
        <div className="p-6 max-w-md mx-auto">
            <h1 className="text-2xl font-semibold mb-4">Settings</h1>

            <div className="flex items-center justify-between bg-muted/40 border border-pink-500 rounded-lg px-4 py-1 mb-6">
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
    );
}