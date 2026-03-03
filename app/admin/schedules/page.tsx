"use client";

import {
    Calendar,
    CheckCircle,
    Clock,
    Edit,
    Trash,
} from "lucide-react";
import EthiopianCalendar from "@/components/ui/EthiopianCalendar";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import ScheduleForm from "./scheduleForm";
import { Alert, CircularProgress, IconButton, Snackbar } from "@mui/material";
import axios from "axios";
import { IUser } from "@/types/models/user";
import { ISchedule } from "@/types/models/Schedule";
import { handleError } from "@/lib/error";
import ClientDetail from "./components/clientDetail";
import { useCalendar } from "@/context/CalendarContext";
import { formatDate as formatCalendarDate } from "@/lib/calendar";
import Input from "@/components/ui/input";
import DeleteModal from "@/components/ui/deleteModal";

const SchedulesPage = () => {
    const [open, setOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [scheduleToDelete, setScheduleToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const [users, setUsers] = useState<IUser[]>([]);
    const [schedules, setSchedules] = useState<ISchedule[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    const [selectedScheduleId, setSelectedScheduleId] = useState("");
    const [editingScheduleId, setEditingScheduleId] = useState("");

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const { mode } = useCalendar();
    const [scheduleDate, setScheduleDate] = useState<Date>(new Date());

    const [searchInputs, setSearchInputs] = useState("");
    const [selectedDateToFilter, setSelectedDateToFilter] = useState<Date | null>(null);

    const handleClearFilter = () => {
        setSearchInputs("");
        setSelectedDateToFilter(null);
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get("/api/auth/user");
            setUsers(response.data);
        } catch (err) {
            console.error("Fetch Users Error:", err);
        }
    };

    const fetchSchedules = async () => {
        try {
            setLoading(true);
            const response = await axios.get("/api/schedule");
            setSchedules(response.data.schedules);
        } catch (err: unknown) {
            setError(handleError(err));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchSchedules();
    }, []);

    const handleDeleteSchedule = async (id: string) => {
        setIsDeleting(true);
        try {
            await axios.delete(`/api/schedule/${id}`);

            setDeleteModalOpen(false);
            setScheduleToDelete(null);
            setSnackbarMessage("Schedule deleted successfully");
            setSnackbarOpen(true);
            fetchSchedules();
        } catch (err) {
            console.error("Delete failed", err);
            setSnackbarMessage("Failed to delete schedule");
        } finally {
            setIsDeleting(false);
        }
    }

    const filteredSchedules = schedules.filter((schedule) => {
        const clientName =
            (schedule.clientId as IUser)?.name?.toLowerCase() || "";
        const scheduleType =
            schedule?.scheduleType?.toLowerCase() || "";
        const scheduleStatus =
            schedule?.status?.toLowerCase() || "";

        const matchesName = searchInputs
            ? clientName.includes(searchInputs.toLowerCase()) ||
            scheduleType.includes(searchInputs.toLowerCase()) ||
            scheduleStatus.includes(searchInputs.toLowerCase())
            : true;

        const matchesDate =
            selectedDateToFilter && schedule.eventDate
                ? new Date(schedule.eventDate).toDateString() ===
                selectedDateToFilter.toDateString()
                : true;

        return matchesName && matchesDate;
    });

    const upcommingSchedules = schedules.filter(
        (schedule) => schedule.status && !["completed", "delivered"].includes(schedule.status)
    );

    const completedSchedules = filteredSchedules.filter(
        (schedule) => schedule.status && ["completed", "delivered"].includes(schedule.status)
    );

    const formatDate = (date?: Date | null) => formatCalendarDate(date ?? null, mode);

    const selectedSchedule = schedules.find((schedule) => schedule._id === selectedScheduleId);

    return (
        <>
            {
                selectedSchedule ? (
                    <ClientDetail fetchSchedules={fetchSchedules} schedules={schedules} selectedSchedule={selectedSchedule} setSelectedScheduleId={setSelectedScheduleId} />
                ) : (
                    <div className="relative flex flex-col gap-8">
                        {deleteModalOpen && (
                            <div className="fixed inset-0 bg-black/40 z-40"></div>
                        )}
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
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-base text-gray-700 font-semibold">UpComming Schedules</h2>
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            onClick={() => setOpen(true)}
                                        >
                                            New Schedule
                                        </Button>
                                    </div>

                                    {loading ? (
                                        <div className="flex items-center justify-center gap-2 py-6">
                                            <CircularProgress enableTrackSlot size={15}/> <span>Loading schedules...</span>
                                        </div>
                                    ) : error ? (
                                        <Alert severity="error">{error}</Alert>
                                    ) : upcommingSchedules.length === 0 ? (
                                        <p className="py-4 text-gray-500 text-center">No schedules found.</p>
                                    ) : (
                                        <div className="overflow-auto scrollbar-thin rounded-md border border-gray-200">
                                            <table className="w-full text-sm">
                                                <thead className="bg-gray-100">
                                                    <tr>
                                                        <th className="p-2 text-left">#</th>
                                                        <th className="p-2 text-left">Client</th>
                                                        <th className="p-2 text-left">Type</th>
                                                        <th className="p-2 text-left">Date</th>
                                                        <th className="p-2 text-left">Status</th>
                                                        <th className="p-2 text-center">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {upcommingSchedules.map((item, index) => (
                                                        <tr key={item._id} className="hover:bg-gray-100 border-b border-gray-200 cursor-pointer">
                                                            <td className="p-2">{index + 1}</td>
                                                            <td onClick={() => setSelectedScheduleId(item._id || "")} className="p-2">
                                                                <span className="text-blue-500 cursor-pointer">
                                                                    {(item.clientId as IUser)?.name || "Unknown"}
                                                                </span>
                                                            </td>
                                                            <td className="p-2">{item.scheduleType}</td>
                                                            <td className="p-2">{formatDate(item.eventDate)}</td>
                                                            <td className="p-2">
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
                                                                <IconButton onClick={() => (
                                                                    setOpen(true),
                                                                    setEditingScheduleId(item._id)
                                                                )} size="small" color="info">
                                                                    <Edit size={14} />
                                                                </IconButton>
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

                                <div className="flex flex-col gap-3 p-4 rounded border border-gray-300">
                                    <h2 className="text-base text-gray-700 font-semibold">Completed Schedules</h2>
                                    <div className="flex justify-between items-center gap-3">
                                        <Input
                                            name="search"
                                            placeholder="Search by names..."
                                            value={searchInputs}
                                            onChange={(e) => setSearchInputs(e.target.value)}
                                            className="w-full lg:w-2/3"
                                        />
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            color="error"
                                            onClick={handleClearFilter}
                                            className="w-max lg:w-1/3"
                                        >
                                            Clear <span className="hidden lg:flex ml-2">Filters</span>
                                        </Button>
                                    </div>

                                    {loading ? (
                                        <div className="flex items-center justify-center gap-2 py-6">
                                            <CircularProgress enableTrackSlot size={15} /> <span>Loading schedules...</span>
                                        </div>
                                    ) : error ? (
                                        <Alert severity="error">{error}</Alert>
                                    ) : completedSchedules.length === 0 ? (
                                        <p className="py-4 text-gray-500 text-center">No schedules found.</p>
                                    ) : (
                                        <div className="overflow-auto scrollbar-thin rounded-md border border-gray-200">

                                            <table className="w-full text-sm">
                                                <thead className="bg-gray-100">
                                                    <tr>
                                                        <th className="p-2 text-left">#</th>
                                                        <th className="p-2 text-left">Client</th>
                                                        <th className="p-2 text-left">Type</th>
                                                        <th className="p-2 text-left">Date</th>
                                                        <th className="p-2 text-left">Status</th>
                                                        <th className="p-2 text-center">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {completedSchedules.map((item, index) => (
                                                        <tr key={item._id} className="hover:bg-gray-100 border-b border-gray-200 cursor-pointer">
                                                            <td className="p-2">{index + 1}</td>
                                                            <td onClick={() => setSelectedScheduleId(item._id || "")} className="p-2">
                                                                <span className="text-blue-500 cursor-pointer">
                                                                    {(item.clientId as IUser)?.name || "Unknown"}
                                                                </span>
                                                            </td>
                                                            <td className="p-2">{item.scheduleType}</td>
                                                            <td className="p-2">{formatDate(item.eventDate)}</td>
                                                            <td className="p-2">
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
                                                                <IconButton onClick={() => (
                                                                    setOpen(true),
                                                                    setEditingScheduleId(item._id)
                                                                )} size="small" color="info">
                                                                    <Edit size={14} />
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

                            <div className="flex flex-col gap-6">

                                <div className="p-6 rounded border border-gray-300">
                                    <h3 className="font-semibold text-purple-600 mb-4">
                                        Calendar
                                    </h3>
                                    <EthiopianCalendar
                                        value={scheduleDate}
                                        onChange={(date) => {
                                            setScheduleDate(date);
                                            setSelectedDateToFilter(date);
                                        }}
                                    />
                                </div>

                                <div className="p-4 rounded border border-gray-300">
                                    <h3 className="font-semibold text-purple-600 mb-4">
                                        Recent Tasks
                                    </h3>
                                    <ul className="space-y-3 text-sm">
                                        {schedules.slice(0, 3).map((task) => (
                                            <li key={task._id} className="flex justify-between items-center">
                                                <div className="flex items-center gap-2">
                                                    {task.status === "completed" ? (
                                                        <CheckCircle size={16} className="text-green-500" />
                                                    ) : (
                                                        <Clock size={16} className="text-yellow-500" />
                                                    )}
                                                    {(task.clientId as IUser)?.name.slice(0, 7) || "Unknown"} - {task.scheduleType}
                                                </div>
                                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                                    <Calendar size={12} /> {formatDate(task.eventDate)}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                            </div>

                        </div>

                        <ScheduleForm
                            setOpen={setOpen}
                            open={open}
                            editingScheduleId={editingScheduleId}
                            setEditingScheduleId={setEditingScheduleId}
                            fetchSchedules={fetchSchedules}
                            users={users}
                            schedules={schedules}
                            setSnackbarOpen={setSnackbarOpen}
                            setSnackbarMessage={setSnackbarMessage}
                        />

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
                    </div>
                )}
        </>
    );
};

export default SchedulesPage;