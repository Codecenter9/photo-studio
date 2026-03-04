"use client";
import React, { useState, useEffect } from 'react';
import {
    Button,
    IconButton,
    Typography,
    Chip,
    CircularProgress,
    Alert,
    Divider,
} from '@mui/material';
import { Trash, Plus } from 'lucide-react';
import { useCalendar } from '@/context/CalendarContext';
import { handleError } from '@/lib/error';
import axios from 'axios';
import { ISchedule } from '@/types/models/Schedule';
import { formatDate as formatCalendarDate } from '@/lib/calendar';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import MyDetails from './component/MyDetail';

const MySchedules = () => {

    const [schedules, setSchedules] = useState<ISchedule[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedScheduleId, setSelectedScheduleId] = useState("");
    // const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    // const [scheduleToDelete, setScheduleToDelete] = useState<string | null>(null);
    // const [isDeleting, setIsDeleting] = useState(false);

    // const [snackbarOpen, setSnackbarOpen] = useState(false);
    // const [snackbarMessage, setSnackbarMessage] = useState("");

    const { mode } = useCalendar();
    const currentUser = useCurrentUser();
    const user = currentUser?.loggedInUser;
    const clientId = user?.id || "";

    const fetchSchedules = async () => {
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
    };

    useEffect(() => {
        fetchSchedules();
    }, []);

    // const handleDeleteSchedule = async (id: string) => {
    //     setIsDeleting(true);
    //     try {
    //         await axios.delete(`/api/schedule/${id}`);

    //         setDeleteModalOpen(false);
    //         setScheduleToDelete(null);
    //         setSnackbarMessage("Schedule deleted successfully");
    //         setSnackbarOpen(true);
    //     } catch (err) {
    //         console.error("Delete failed", err);
    //         setSnackbarMessage("Failed to delete schedule");
    //     } finally {
    //         setIsDeleting(false);
    //     }
    // }

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
                            <div>
                                <h1 className="text-2xl font-bold">Schedules</h1>
                                <p className="text-sm text-gray-500">
                                    Manage and organize your photo schedules.
                                </p>
                            </div >
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
                                                        <th className="p-2 text-center">Actions</th>
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
                                                            <td className="p-2 text-center flex justify-center gap-2">
                                                                <IconButton
                                                                    // onClick={() => {
                                                                    //     setScheduleToDelete(item._id);
                                                                    //     setDeleteModalOpen(true);
                                                                    // }}
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
                                                                <IconButton size="small" color="error">
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

                            <div className="w-full lg:w-80 flex flex-col items-center border border-gray-300 bg-white rounded-md p-6">
                                <div className="flex flex-col items-center gap-2">
                                    <span className="text-center p-6 rounded-full bg-gray-300 border text-2xl font-bold uppercase">
                                        JD
                                    </span>
                                    <Typography variant="h6" className="mt-2">
                                        John Doe
                                    </Typography>
                                    <Chip label="CameraMan" size="small" className="mt-1" />
                                </div>
                                <Divider sx={{ width: '100%', my: 2 }} />
                                <div className="text-sm text-gray-600 w-full mb-4">
                                    <p className="flex justify-between">
                                        <span>Total Schedules:</span>
                                        <span className="font-semibold">{schedules?.length}</span>
                                    </p>
                                    <p className="flex justify-between mt-1">
                                        <span>Upcoming:</span>
                                        <span className="font-semibold">
                                            {schedules?.length}
                                        </span>
                                    </p>
                                </div>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={<Plus size={16} />}
                                    className="w-full"
                                >
                                    Add Schedule
                                </Button>
                            </div>
                        </div>

                    </div>)}
        </>
    );
};

export default MySchedules;