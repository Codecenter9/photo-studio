"use client";
import React, { useState, useEffect, useCallback } from 'react';
import {
    Button,
    IconButton,
    CircularProgress,
    Alert,
    Divider,
    Snackbar,
    Switch,
} from '@mui/material';
import { Trash, Plus, Settings } from 'lucide-react';
import { useCalendar } from '@/context/CalendarContext';
import { handleError } from '@/lib/error';
import axios from 'axios';
import { ISchedule } from '@/types/models/Schedule';
import { formatDate as formatCalendarDate } from '@/lib/calendar';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import MyDetails from './component/MyDetail';
import { ISettings } from '@/types/models/settings';
import DeleteModal from '@/components/ui/deleteModal';
import DialogBox from '@/components/ui/modal';

const MySchedules = () => {

    const { mode, setMode } = useCalendar();

    const [openModal, setOpenModal] = useState(false);

    const [schedules, setSchedules] = useState<ISchedule[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedScheduleId, setSelectedScheduleId] = useState("");
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [scheduleToDelete, setScheduleToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const [settings, setSettings] = useState<ISettings>();

    const currentUser = useCurrentUser();
    const user = currentUser?.loggedInUser;
    const clientId = user?.id || "";

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await axios.get('/api/settings');

                setSettings(response.data);
            } catch (error) {
                console.log("failed to fetch settings", error);
            }
        }
        fetchSettings();
    }, [])

    const fetchSchedules = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `/api/schedule/${clientId}`
            );
            setSchedules(response.data);
        } catch (err: unknown) {
            setError(handleError(err));
        } finally {
            setLoading(false);
        }
    }, [clientId]);

    useEffect(() => {
        fetchSchedules();
    }, [fetchSchedules]);

    const handleDeleteSchedule = async (id: string) => {
        const selectedSchedule = schedules.find((schedule) => schedule._id === id);
        if (!selectedSchedule) return;

        setIsDeleting(true);

        try {
            await axios.put(`/api/schedule/${id}`, {
                isVisibleForClient: false
            });

            setDeleteModalOpen(false);
            fetchSchedules();
            setScheduleToDelete(null);
            setSnackbarMessage("Schedule removed successfully");
            setSnackbarOpen(true);

        } catch (err) {
            console.error("Update failed", err);
            setSnackbarMessage("Failed to update schedule");
        } finally {
            setIsDeleting(false);
        }
    };

    const upcommingSchedules = schedules?.filter(
        (schedule) => schedule.status && !["completed", "delivered"].includes(schedule.status)
    );

    const completedSchedules = schedules?.filter(
        (schedule) => schedule.status && ["completed", "delivered"].includes(schedule.status)
    );

    const formatDate = (date?: Date | null) => formatCalendarDate(date ?? null, mode);

    const selectedSchedule = schedules?.find((schedule) => schedule._id === selectedScheduleId);

    return (
        <>
            {
                selectedSchedule ? (
                    <MyDetails schedules={schedules} selectedSchedule={selectedSchedule} setSelectedScheduleId={setSelectedScheduleId} />
                ) : (

                    <div className="relative flex flex-col gap-8">
                        <div className="flex items-center justify-between">
                            <div className='font-serif'>
                                <h1 className="text-2xl font-bold">Schedules</h1>
                                <p className="text-sm text-gray-500">
                                    Manage and organize your photo schedules.
                                </p>
                            </div >
                            <Button onClick={() => setOpenModal(true)} variant='outlined' size='small'>
                                <div className="flex items-center justify-center gap-2">
                                    <Settings size={18} />
                                    <span className='hidden lg:flex'>Settings</span>
                                </div>
                            </Button>
                        </div >

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="col-span-2 flex flex-col gap-3">
                                <div className="flex flex-col gap-3 p-4 rounded border border-gray-300">
                                    <h2 className="text-base text-gray-700 font-semibold">Upcomming Schedules</h2>
                                    {loading ? (
                                        <div className="flex items-center justify-center gap-2 py-6">
                                            <CircularProgress enableTrackSlot size={15} /> <span>Loading schedules...</span>
                                        </div>
                                    ) : error ? (
                                        <Alert severity="error">{error}</Alert>
                                    ) : upcommingSchedules?.length === 0 ? (
                                        <p className="py-4 text-gray-500 text-center">No schedules found.</p>
                                    ) : (
                                        <div className="overflow-auto scrollbar-thin rounded-md border border-gray-200">
                                            <table className="w-full text-sm">
                                                <thead className="bg-gray-200">
                                                    <tr>
                                                        <th className="p-2 text-left">#</th>
                                                        <th className="p-2 text-left">Type</th>
                                                        <th className="p-2 text-left">Date</th>
                                                        <th className="p-2 text-left">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {upcommingSchedules?.map((item, index) => (
                                                        <tr key={item._id} className="hover:bg-gray-200 group border-b border-gray-200 cursor-pointer">
                                                            <td className="p-2">{index + 1}</td>
                                                            <td onClick={() => setSelectedScheduleId(item._id)} className="p-2 group-hover:text-blue-500 capitalize">{item.scheduleType}</td>
                                                            <td onClick={() => setSelectedScheduleId(item._id)} className="p-2">{formatDate(item.eventDate)}</td>
                                                            <td onClick={() => setSelectedScheduleId(item._id)} className="p-2">
                                                                <span
                                                                    className={`px-3 py-1 rounded-sm text-xs font-semibold capitalize ${item.status === "completed"
                                                                        ? "bg-green-100 text-green-700"
                                                                        : item.status === "editing"
                                                                            ? "bg-yellow-100 text-yellow-700"
                                                                            : item.status === "cancelled"
                                                                                ? "bg-red-100 text-red-700"
                                                                                : "bg-cyan-100 text-cyan-700"
                                                                        }`}
                                                                >
                                                                    {item.status}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col gap-3 p-4 rounded border border-gray-300">
                                    <h2 className="text-base text-gray-700 font-semibold">Completed Schedules</h2>
                                    {loading ? (
                                        <div className="flex items-center justify-center gap-2 py-6">
                                            <CircularProgress enableTrackSlot size={15} /> <span>Loading schedules...</span>
                                        </div>
                                    ) : error ? (
                                        <Alert severity="error">{error}</Alert>
                                    ) : completedSchedules?.length === 0 ? (
                                        <p className="py-4 text-gray-500 text-center">No schedules found.</p>
                                    ) : (
                                        <div className="overflow-auto scrollbar-thin rounded-md border border-gray-200">

                                            <table className="w-full text-sm">
                                                <thead className="bg-gray-200">
                                                    <tr>
                                                        <th className="p-2 text-left">#</th>
                                                        <th className="p-2 text-left">Type</th>
                                                        <th className="p-2 text-left">Date</th>
                                                        <th className="p-2 text-left">Status</th>
                                                        <th className="p-2 text-center">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {completedSchedules?.map((item, index) => (
                                                        <tr key={item._id} className="hover:bg-gray-200 group border-b border-gray-200 cursor-pointer">
                                                            <td className="p-2">{index + 1}</td>
                                                            <td onClick={() => setSelectedScheduleId(item._id)} className="p-2 group-hover:text-blue-500 capitalize">{item.scheduleType}</td>
                                                            <td onClick={() => setSelectedScheduleId(item._id)} className="p-2">{formatDate(item.eventDate)}</td>
                                                            <td onClick={() => setSelectedScheduleId(item._id)} className="p-2">
                                                                <span
                                                                    className={`px-3 py-1 rounded-sm text-xs font-semibold capitalize ${item.status === "completed"
                                                                        ? "bg-green-100 text-green-700"
                                                                        : item.status === "editing"
                                                                            ? "bg-yellow-100 text-yellow-700"
                                                                            : item.status === "cancelled"
                                                                                ? "bg-red-100 text-red-700"
                                                                                : "bg-cyan-100 text-cyan-700"
                                                                        }`}
                                                                >
                                                                    {item.status}
                                                                </span>
                                                            </td>
                                                            <td className="p-2 text-center flex justify-center gap-2">
                                                                <IconButton
                                                                    onClick={() => {
                                                                        setScheduleToDelete(item._id);
                                                                        setDeleteModalOpen(true);
                                                                    }}
                                                                    size="small"
                                                                    color="error"
                                                                >
                                                                    <Trash size={14} />
                                                                </IconButton>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="w-full lg:w-80 flex flex-col items-center border border-gray-300 rounded-md p-6">
                                <div className="w-full flex flex-col items-center gap-2">
                                    <span className="text-center font-serif p-6 rounded-full bg-gray-300 border text-2xl font-bold uppercase">
                                        {settings?.studioName.substring(0, 2)}
                                    </span>
                                    <div className="w-full flex flex-col gap-1 items-center mt-2">
                                        <span className="w-full flex justify-between gap-2 text-sm bg-gray-900/5 border border-gray-300 px-3 py-1 rounded-md font-serif">
                                            <p>Name:</p>
                                            {settings?.studioName}
                                        </span>
                                        <span className="w-full flex justify-between gap-2 text-sm bg-gray-900/5 border border-gray-300 px-3 py-1 rounded-md font-serif">
                                            <p>Phone:</p>
                                            {settings?.studioPhone}
                                        </span>
                                        <span className="w-full flex justify-between gap-2 text-sm bg-gray-900/5 border border-gray-300 px-3 py-1 rounded-md font-serif">
                                            <p>Email:</p>
                                            {settings?.studioEmail}
                                        </span>
                                        <span className="w-full flex justify-between gap-2 text-sm bg-gray-900/5 border border-gray-300 px-3 py-1 rounded-md font-serif">
                                            <p>Address:</p>
                                            {settings?.studioAddress}
                                        </span>
                                    </div>
                                </div>
                                <Divider sx={{ width: '100%', my: 2 }} />
                                <div className="text-sm text-gray-600 w-full mb-4">
                                    <p className="flex justify-between">
                                        <span>Upcomming Schedules:</span>
                                        <span className="font-semibold">{upcommingSchedules?.length}</span>
                                    </p>
                                    <p className="flex justify-between mt-1">
                                        <span>Completed Schedules:</span>
                                        <span className="font-semibold">
                                            {completedSchedules?.length}
                                        </span>
                                    </p>
                                </div>
                                {settings?.allowClientBooking && (
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        startIcon={<Plus size={16} />}
                                        className="w-full"
                                    >
                                        Add Schedule
                                    </Button>
                                )}
                            </div>
                        </div>

                        <DialogBox
                            open={openModal}
                            title="Update Calender"
                            onClose={() => {
                                setOpenModal(false);

                            }}
                            maxWidth="md"
                        >
                            <div className="flex items-center justify-between border border-pink-500 rounded-md px-4 py-1">
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
                        </DialogBox>

                        <Snackbar
                            open={snackbarOpen}
                            autoHideDuration={4000}
                            onClose={() => setSnackbarOpen(false)}
                            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                        >
                            <Alert
                                onClose={() => setSnackbarOpen(false)}
                                severity="success"
                                sx={{ width: "100%" }}
                            >
                                {snackbarMessage}
                            </Alert>
                        </Snackbar>

                        <DeleteModal
                            isOpen={deleteModalOpen}
                            title="Delete Schedule"
                            description="Are you sure you want to delete this schedule? This action cannot be undone."
                            onClose={() => {
                                setDeleteModalOpen(false);
                                setScheduleToDelete(null);
                            }}
                            onConfirm={() => {
                                if (scheduleToDelete) {
                                    handleDeleteSchedule(scheduleToDelete);
                                }
                            }}
                            confirmText={isDeleting ? "Deleting..." : "Yes, Delete"}
                        />
                    </div>)}
        </>
    );
};

export default MySchedules;