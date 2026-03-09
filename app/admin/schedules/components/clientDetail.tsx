import { ISchedule } from '@/types/models/Schedule';
import { IUser, IUserPermissions } from '@/types/models/user';
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, Switch } from '@mui/material';
import { ArrowLeft, Check, Settings } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { formatDate as formatCalendarDate } from "@/lib/calendar";
import { useCalendar } from '@/context/CalendarContext';
import ScheduleDialog from './editSchedule';
import axios from 'axios';

interface ClientDetailSectionProps {
    schedules: ISchedule[];
    fetchSchedules: () => void;
    selectedSchedule?: ISchedule;
    setSelectedScheduleId?: React.Dispatch<React.SetStateAction<string>>;
}
const ClientDetail = ({ schedules, fetchSchedules, selectedSchedule, setSelectedScheduleId }: ClientDetailSectionProps) => {

    const { mode } = useCalendar();

    const [openModal, setOpenModal] = useState(false);

    const [permissions, setPermissions] = useState<IUserPermissions>({
        canDownload: false,
        canShare: false,
    });

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedDates, setSelectedDates] = useState<{
        eventDate?: Date;
        editingDate?: Date;
        deliveryDate?: Date;
    }>({});

    const [currentEditingField, setCurrentEditingField] = useState<"eventDate" | "editingDate" | "deliveryDate" | null>(null);

    const handleSaveDate = async (date: Date) => {
        if (!selectedSchedule || !currentEditingField) return;

        setIsSubmitting(true);

        try {
            await axios.put(`/api/schedule/${selectedSchedule._id}`, {
                [currentEditingField]: date
            });

            setSelectedDates(prev => ({ ...prev, [currentEditingField]: date }));
            setSnackbarMessage("Date set successfully");
            setSnackbarOpen(true);
            fetchSchedules();
        } catch {
            console.error("Update schedule error:");
            alert("Failed to update schedule: ");
        } finally {
            setCurrentEditingField(null);
            setIsSubmitting(false);
        }
    };

    const handleChange = (
        field: keyof IUserPermissions,
        value: boolean
    ) => {
        setPermissions((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    useEffect(() => {
        if (selectedSchedule?.clientId) {
            const client = selectedSchedule.clientId as IUser;

            setPermissions({
                canDownload: client.permissions?.canDownload ?? false,
                canShare: client.permissions?.canShare ?? false,
            });
        }
    }, [selectedSchedule]);

    const hanldeSaveSetting = async () => {
        if (!selectedSchedule?.clientId) return;
        setIsSubmitting(true);

        const clientId = (selectedSchedule.clientId as IUser)._id;

        try {
            await axios.put(`/api/auth/user/${clientId}`, {
                permissions,
            });

            setSnackbarMessage("Setting saved successfully");
            setSnackbarOpen(true);
            setOpenModal(false);
        } catch (error) {
            console.error("Update schedule error:", error);
            alert("Failed to update setting: ");
        } finally {
            setIsSubmitting(false);
        }
    };

    const getClientId = (client: any) =>
        typeof client === "object" && "_id" in client
            ? client._id.toString()
            : client?.toString();

    const populatedSchedules = schedules.filter(
        (schedule) =>
            getClientId(schedule.clientId) ===
            getClientId(selectedSchedule?.clientId)
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingSchedule = populatedSchedules.filter(
        (s) =>
            s.eventDate &&
            new Date(s.eventDate) >= today &&
            s.status !== "completed"
    );

    const recentSchedule = upcomingSchedule.length > 0
        ? upcomingSchedule.sort(
            (a, b) => new Date(a.eventDate!).getTime() - new Date(b.eventDate!).getTime()
        )[0]
        : undefined;

    let remainingDays: number | null = null;
    if (recentSchedule?.eventDate) {
        const diffMs = new Date(recentSchedule.eventDate).getTime() - Date.now();
        remainingDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    }

    const formatDate = (date?: Date | null) => formatCalendarDate(date ?? null, mode);

    return (
        <div className="w-full flex flex-col items-center gap-8 min-h-screen overflow-hidden">
            <div className="w-full flex items-center gap-2">
                <span
                    onClick={() => setSelectedScheduleId && setSelectedScheduleId("")}
                    className="flex items-center justify-center p-2 rounded-full hover:border border-gray-300 transition-all duration-300 cursor-pointer"
                >
                    <ArrowLeft size={20} />
                </span>

                <div className="w-full flex items-center justify-between">
                    <div className="flex flex-col font-serif">
                        <span className="text-base font-light text-gray-600">
                            Details:{" "}
                            <i className="underline font-light">{(selectedSchedule?.clientId as IUser)?.name}</i>:{" "}
                        </span>
                        <em className="text-sm font-light">
                            Details about this client is provided here.
                        </em>
                    </div>
                    <Button onClick={() => setOpenModal(true)} variant='outlined' size='small'>
                        <div className="flex items-center justify-center gap-2">
                            <Settings size={18} />
                            <span className='hidden lg:flex'>Settings</span>
                        </div>
                    </Button>
                </div>
            </div>
            <div className="w-full flex flex-col lg:flex-row gap-6">
                <div className="flex flex-col flex-1 items-center gap-6 border border-gray-300 rounded-md p-6">

                    <div className="w-full flex items-center gap-1">
                        <hr className='flex-1 h-1 w-full text-gray-300' />
                        <Box
                            className="flex items-center justify-center w-20 h-20 rounded-full bg-purple-100 border-2 border-purple-400 shadow-sm"
                        >
                            <span className="text-2xl font-bold text-purple-700">
                                {(selectedSchedule?.clientId as IUser)?.name?.charAt(0).toUpperCase() || ""}
                            </span>
                        </Box>
                        <hr className='flex-1 h-1 w-full text-gray-300' />
                    </div>
                    <div className="w-full flex flex-col gap-2">
                        <div className="w-full flex items-center justify-between border border-gray-300 rounded-md bg-gray-100 px-3 py-1">
                            <span>Name:</span>
                            <em>{(selectedSchedule?.clientId as IUser)?.name}</em>
                        </div>
                        <div className="w-full flex items-center justify-between border border-gray-300 rounded-md bg-gray-100 px-3 py-1">
                            <span>Phone:</span>
                            <em>{(selectedSchedule?.clientId as IUser)?.phone}</em>
                        </div>
                        <div className="w-full flex items-center justify-between border border-gray-300 rounded-md bg-gray-100 px-3 py-1">
                            <span>Email:</span>
                            <em>{(selectedSchedule?.clientId as IUser)?.email}</em>
                        </div>
                    </div>
                    {recentSchedule && (
                        <div className="w-full flex flex-col gap-3 border border-gray-300 p-3 rounded-md">
                            <div className="flex items-center justify-between">
                                <p className="text-normal text-center flex gap-1 font-medium font-serif group">UpComming <span className='flex group-hover:hidden'>...</span> <span className='hidden group-hover:flex'>Schedule</span> </p>
                                <span className='text-sm bg-cyan-100 text-cyan-700 px-3 rounded-md font-bold'>{remainingDays === 0 ? (
                                    <span className="text-red-500">Today</span>
                                ) : (
                                    <div className="">
                                        {remainingDays}  days left
                                    </div>
                                )}</span>
                            </div>
                            <ul className='w-full flex flex-col gap-2 items-center'>
                                <li className='w-full flex items-center justify-between'>
                                    <div className="flex items-center gap-1">
                                        <Check size={15} className='text-green-500' />
                                        <span className="text-sm font-light">Type</span>
                                    </div>
                                    <span className="text-xs font-extralight bg-gray-100 rounded-md border border-gray-500 px-3 ">{recentSchedule?.scheduleType?.toUpperCase()}</span>
                                </li>
                                <li className='w-full flex items-center justify-between'>
                                    <div className="flex items-center gap-1">
                                        <Check size={15} className='text-green-500' />
                                        <span className="text-sm font-light">Event Date</span>
                                    </div>
                                    <span
                                        className="text-xs font-extra-light cursor-pointer underline hover:text-blue-600"
                                        onClick={() => setCurrentEditingField("eventDate")}
                                    >
                                        {selectedDates.eventDate
                                            ? formatDate(selectedDates.eventDate)
                                            : recentSchedule?.eventDate
                                                ? formatDate(recentSchedule.eventDate)
                                                : "Set Date"}
                                    </span>
                                </li>
                                <li className='w-full flex items-center justify-between'>
                                    <div className="flex items-center gap-1">
                                        <Check size={15} className='text-green-500' />
                                        <span className="text-sm font-light">Editing Date</span>
                                    </div>
                                    <span
                                        className="text-xs font-extra-light cursor-pointer underline hover:text-blue-600"
                                        onClick={() => setCurrentEditingField("editingDate")}
                                    >
                                        {selectedDates.editingDate
                                            ? formatDate(selectedDates.editingDate)
                                            : recentSchedule?.editingDate
                                                ? formatDate(recentSchedule.editingDate)
                                                : "Set Date"}
                                    </span>
                                </li>
                                <li className='w-full flex items-center justify-between'>
                                    <div className="flex items-center gap-1">
                                        <Check size={15} className='text-green-500' />
                                        <span className="text-sm font-light">Delivery Date</span>
                                    </div>
                                    <span
                                        className="text-xs font-extra-light cursor-pointer underline hover:text-blue-600"
                                        onClick={() => setCurrentEditingField("deliveryDate")}
                                    >
                                        {selectedDates.deliveryDate
                                            ? formatDate(selectedDates.deliveryDate)
                                            : recentSchedule?.deliveryDate
                                                ? formatDate(recentSchedule.deliveryDate)
                                                : "Set Date"}
                                    </span>
                                </li>
                                {recentSchedule?.notes && (
                                    <li className='w-full flex flex-col items-center bg-gray-100 border border-gray-200 rounded-md p-3 mt-3 justify-between'>
                                        <span className="text-base font-light font-serif underline mb-3">Additional Notes</span>
                                        <span className="text-sm text-amber-500 font-extralight font-serif">{recentSchedule?.notes}</span>
                                    </li>
                                )}
                                <li className="w-full flex flex-col mt-3 gap-2">
                                    <hr className='w-full text-gray-300 h-1' />
                                    <span className='w-full flex items-center justify-between'>
                                        <div className="flex items-center gap-1">
                                            <span className="text-sm font-light">Status</span>
                                        </div>
                                        <span
                                            className={`px-3 py-1 rounded-sm text-xs font-extralight capitalize ${recentSchedule?.status === "completed"
                                                ? "bg-green-100 text-green-700"
                                                : recentSchedule?.status === "editing"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : recentSchedule?.status === "cancelled"
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-cyan-100 text-cyan-700"
                                                }`}
                                        >
                                            {recentSchedule?.status}</span>
                                    </span>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
                <div className="flex flex-col flex-2 h-100 border border-gray-300 rounded-md">

                    <div className="p-5 border-b border-gray-300">
                        <h2 className="text-xl font-semibold text-gray-800 text-center font-serif">
                            Schedule List
                        </h2>
                    </div>

                    <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin">

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {populatedSchedules.map((schedule, index) => (
                                <div
                                    key={index}
                                    className="w-full rounded-lg border border-gray-300 bg-white p-5 hover:bg-gray-50 transition-all duration-200"
                                >
                                    <div className="relative flex flex-col gap-y-3 text-sm">
                                        <span className="absolute -top-7 -left-7 rounded-full border border-gray-300 flex items-center justify-center px-1 bg-purple-500 text-white font-bold">{index + 1}</span>
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium text-gray-600">Event Type</span>
                                            <span className="text-gray-800 font-semibold">{schedule.scheduleType}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium text-gray-600">Event Date</span>
                                            <span className="text-gray-800">{formatDate(schedule.eventDate)}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium text-gray-600">Editing Date</span>
                                            <span className="text-gray-800">{formatDate(schedule.editingDate)}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium text-gray-600">Delivery Date</span>
                                            <span className="text-gray-800">{formatDate(schedule.deliveryDate)}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium text-gray-600">Status</span>
                                            <span className="text-gray-800 text-sm bg-cyan-100 rounded-md px-3 capitalize">{schedule.status}</span>

                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </div>

            {currentEditingField && selectedSchedule && (
                <ScheduleDialog
                    open={true}
                    setOpen={() => setCurrentEditingField(null)}
                    title={`Edit ${currentEditingField.replace("Date", " Date")}`}
                    value={
                        selectedDates[currentEditingField] ??
                        recentSchedule?.[currentEditingField] ??
                        new Date()
                    }
                    onChange={(date) =>
                        setSelectedDates(prev => ({
                            ...prev,
                            [currentEditingField]: date
                        }))
                    }
                    onSave={handleSaveDate}
                    isSubmitting={isSubmitting}
                />
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
                    sx={{ width: "100%" }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            <div className="flex items-center justify-center">
                <Dialog maxWidth="sm" open={openModal} onClose={() => setOpenModal(false)} >
                    <DialogTitle><span className="text-normal font-serif">Update Settings</span></DialogTitle>
                    <hr className='h-1 text-gray-300' />
                    <DialogContent>
                        <div className="flex w-75 md:w-100 flex-col items-center gap-3">
                            <div className="w-full flex items-center justify-between border border-purple-500 rounded-md px-4 py-1">
                                <span className="text-sm font-medium">
                                    Allow to download files
                                </span>

                                <Switch
                                    checked={permissions.canDownload}
                                    onChange={(e) =>
                                        handleChange("canDownload", e.target.checked)
                                    }
                                />
                            </div>
                            <div className="w-full flex items-center justify-between border border-purple-500 rounded-md px-4 py-1">
                                <span className="text-sm font-medium">
                                    Allow to share files
                                </span>

                                <Switch
                                    checked={permissions.canShare}
                                    onChange={(e) =>
                                        handleChange("canShare", e.target.checked)
                                    }
                                />
                            </div>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenModal(false)}>Cancel</Button>
                        <Button onClick={hanldeSaveSetting} color="info">
                            {isSubmitting ? "Saving..." : "Save"}
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    )
}

export default ClientDetail
