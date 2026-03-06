"use client";

import { ISchedule } from "@/types/models/Schedule";
import { Alert, Button, CircularProgress } from "@mui/material";
import React, { useCallback, useMemo, useState } from "react";
import { formatDate as formatCalendarDate } from "@/lib/calendar";
import { useCalendar } from "@/context/CalendarContext";
import { Check } from "lucide-react";
import { IUser } from "@/types/models/user";

interface TodaySchedulePropes {
    schedules: ISchedule[];
    loading: boolean;
    error: string;
    setSelectedScheduleId: React.Dispatch<React.SetStateAction<string>>;
}
const TodaySchedule = ({ schedules, loading, error, setSelectedScheduleId }: TodaySchedulePropes) => {
    const [openDetailView, setOpenDetailView] = useState("");

    const { mode } = useCalendar();

    const [activeTab, setActiveTab] = useState<
        "photoshot" | "editing" | "delivery"
    >("photoshot");

    const isToday = useCallback((date?: Date | string | null) => {
        if (!date) return false;

        const now = new Date();

        const startOfToday = new Date(now);
        startOfToday.setHours(0, 0, 0, 0);

        const startOfTomorrow = new Date(startOfToday);
        startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

        const scheduleTime = new Date(date).getTime();

        return (
            scheduleTime >= startOfToday.getTime() &&
            scheduleTime < startOfTomorrow.getTime()
        );
    }, []);

    const todayPhotoShotSchedules = useMemo(
        () =>
            schedules.filter((schedule) =>
                isToday(schedule.eventDate)
            ),
        [schedules, isToday]
    );

    const todayEditingSchedules = useMemo(
        () =>
            schedules.filter((schedule) =>
                isToday(schedule.editingDate)
            ),
        [schedules, isToday]
    );

    const todayDeliverySchedules = useMemo(
        () =>
            schedules.filter((schedule) =>
                isToday(schedule.deliveryDate)
            ),
        [schedules, isToday]
    );

    const Tabs = [
        { label: "Photo Shot", key: "photoshot" },
        { label: "Editing", key: "editing" },
        { label: "Delivery", key: "delivery" },
    ] as const;

    const getActiveSchedules = () => {
        switch (activeTab) {
            case "photoshot":
                return todayPhotoShotSchedules;
            case "editing":
                return todayEditingSchedules;
            case "delivery":
                return todayDeliverySchedules;
            default:
                return [];
        }
    };

    const activeSchedules = getActiveSchedules();

    const formatDate = (date?: Date | null) => formatCalendarDate(date ?? null, mode);
    const handleDetailView = (scheduleId: string) => {
        if (openDetailView === scheduleId) {
            setOpenDetailView("");
        } else {
            setOpenDetailView(scheduleId);
        }
    };

    return (
        <div id="todayschedule" className='flex flex-col lg:flex-row gap-6 mt-6'>
            <div className="flex-1 p-3 border border-gray-300 rounded-md flex flex-col gap-6">
                <div className="grid grid-cols-3 gap-3">
                    {Tabs.map((tab) => (
                        <Button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            variant={
                                activeTab === tab.key
                                    ? "contained"
                                    : "outlined"
                            }
                            size="small"
                        >
                            {tab.label}
                            <div className="hidden lg:flex">
                                ({tab.key === "photoshot"
                                    ? todayPhotoShotSchedules.length
                                    : tab.key === "editing"
                                        ? todayEditingSchedules.length
                                        : todayDeliverySchedules.length}
                                )
                            </div>
                        </Button>
                    ))}
                </div>

                <div className="overflow-y-auto min-h-50">
                    {loading ? (
                        <div className="flex items-center justify-center py-6 gap-2">
                            <CircularProgress enableTrackSlot size={18} />
                            <span>Loading schedules...</span>
                        </div>
                    ) : error ? (
                        <Alert severity="error">{error}</Alert>
                    ) : activeSchedules.length === 0 ? (
                        <p className="text-gray-500 text-center py-6">
                            No schedules for today.
                        </p>
                    ) : (
                        <ul className="space-y-3">
                            {activeSchedules.map((schedule) => (
                                <li
                                    key={schedule._id}
                                    onClick={() => handleDetailView(schedule._id)}
                                    className="p-3 border border-gray-300 rounded-md flex flex-col gap-3 items-center cursor-pointer group"
                                >
                                    <div className="w-full flex justify-between items-center">
                                        <div onClick={() => setSelectedScheduleId(schedule._id)} className="">
                                            <p className="text-gray-700 group-hover:text-gray-950 hover:text-blue-500 font-serif font-medium">
                                                {schedule.scheduleType}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {
                                                    formatDate(schedule?.eventDate)
                                                }
                                            </p>
                                        </div>
                                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                                            {schedule.status}
                                        </span>
                                    </div>
                                    {openDetailView === schedule._id && (
                                        <div className="w-full grid grid-cols-2 gap-3">
                                            <div className="w-full border border-gray-200 p-2 rounded-md bg-gray-100 flex items-center justify-between">
                                                <div className="flex items-center gap-1">
                                                    <Check size={15} className='text-green-500' />
                                                    <span className="text-xs font-serif font-light">Name</span>
                                                </div>
                                                <span
                                                    className="text-xs font-serif font-extra-light"
                                                >
                                                    {
                                                        (schedule.clientId as IUser).name
                                                    }
                                                </span>
                                            </div>
                                            <div className="w-full border border-gray-200 p-2 rounded-md bg-gray-100 flex items-center justify-between">
                                                <div className="flex items-center gap-1">
                                                    <Check size={15} className='text-green-500' />
                                                    <span className="text-xs font-serif font-light">Phone</span>
                                                </div>
                                                <span
                                                    className="text-xs font-serif font-extra-light"
                                                >
                                                    {
                                                        (schedule.clientId as IUser).phone
                                                    }
                                                </span>
                                            </div>
                                            <div className="w-full border border-gray-200 p-2 rounded-md bg-gray-100 flex items-center justify-between">
                                                <div className="flex items-center gap-1">
                                                    <Check size={15} className='text-green-500' />
                                                    <span className="text-xs font-serif font-light">Editing Date</span>
                                                </div>
                                                <span
                                                    className="text-xs font-serif font-extra-light"
                                                >
                                                    {
                                                        formatDate(schedule?.editingDate)
                                                    }
                                                </span>
                                            </div>
                                            <div className="w-full border border-gray-200 p-2 rounded-md bg-gray-100 flex items-center justify-between">
                                                <div className="flex items-center gap-1">
                                                    <Check size={15} className='text-green-500' />
                                                    <span className="text-xs font-serif font-light">Delivery Date</span>
                                                </div>
                                                <span
                                                    className="text-xs font-serif font-extra-light"
                                                >
                                                    {
                                                        formatDate(schedule?.deliveryDate)
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
            <div className="flex flex-1 w-full lg:w-1/2 flex-col gap-4 p-4 rounded border border-gray-300">
                <h3 className="text-lg font-semibold mb-2 text-purple-600">Analytics</h3>

                <div className="flex flex-col gap-3">
                    <div className="flex flex-col">
                        <span className="text-sm font-medium mb-1">Photo Shot ({todayPhotoShotSchedules.length})</span>
                        <div className="w-full h-4 bg-gray-200 rounded">
                            <div
                                className="h-4 rounded bg-purple-500"
                                style={{ width: `${Math.min(todayPhotoShotSchedules.length * 10, 100)}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <span className="text-sm font-medium mb-1">Editing ({todayEditingSchedules.length})</span>
                        <div className="w-full h-4 bg-gray-200 rounded">
                            <div
                                className="h-4 rounded bg-yellow-500"
                                style={{ width: `${Math.min(todayEditingSchedules.length * 10, 100)}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <span className="text-sm font-medium mb-1">Delivery ({todayDeliverySchedules.length})</span>
                        <div className="w-full h-4 bg-gray-200 rounded">
                            <div
                                className="h-4 rounded bg-green-500"
                                style={{ width: `${Math.min(todayDeliverySchedules.length * 10, 100)}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TodaySchedule;