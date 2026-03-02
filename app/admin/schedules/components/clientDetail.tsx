import { ISchedule } from '@/types/models/Schedule';
import { IUser } from '@/types/models/user';
import { Box } from '@mui/material';
import { ArrowLeft, Check } from 'lucide-react'
import React from 'react'
import { formatDate as formatCalendarDate } from "@/lib/calendar";
import { useCalendar } from '@/context/CalendarContext';

interface ClientDetailSectionProps {
    schedules: ISchedule[];
    selectedSchedule?: ISchedule;
    setSelectedScheduleId?: React.Dispatch<React.SetStateAction<string>>;
}
const ClientDetail = ({ schedules, selectedSchedule, setSelectedScheduleId }: ClientDetailSectionProps) => {

    const { mode } = useCalendar();

    const getClientId = (client: any) =>
        typeof client === "object" && "_id" in client
            ? client._id.toString()
            : client?.toString();

    const populatedSchedules = schedules.filter(
        (schedule) =>
            getClientId(schedule.clientId) ===
            getClientId(selectedSchedule?.clientId)
    );

    const recentSchedule = populatedSchedules
        .filter(s => s.eventDate)
        .sort((a, b) =>
            new Date(b.eventDate!).getTime() -
            new Date(a.eventDate!).getTime()
        )[0];

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

                <div className="flex flex-col">
                    <span className="text-base font-light text-gray-600">
                        Details:{" "}
                        <i className="underline font-light">{(selectedSchedule?.clientId as IUser)?.name}</i>:{" "}
                    </span>
                    <em className="text-sm font-light">
                        Details about this client is provided here.
                    </em>
                </div>
            </div>
            <div className="w-full flex gap-6">
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
                    <div className="w-full flex flex-col gap-2 border border-gray-300 p-3 rounded-md">
                        <span className="text-center text-normal font-medium font-serif">Recent Schedule</span>
                        <ul className='w-full flex flex-col gap-1 items-center'>
                            <li className='w-full flex items-center justify-between'>
                                <div className="flex items-center gap-1">
                                    <Check size={15} className='text-green-500' />
                                    <span className="text-sm font-light">Type</span>
                                </div>
                                <span className="text-sm font-extralight bg-gray-100 rounded-md border border-gray-500 px-3 ">{recentSchedule.scheduleType?.toUpperCase()}</span>
                            </li>
                            <li className='w-full flex items-center justify-between'>
                                <div className="flex items-center gap-1">
                                    <Check size={15} className='text-green-500' />
                                    <span className="text-sm font-light">Event Date</span>
                                </div>
                                <span className="text-sm font-extra-light">{formatDate(recentSchedule.eventDate)}</span>
                            </li>
                            <li className='w-full flex items-center justify-between'>
                                <div className="flex items-center gap-1">
                                    <Check size={15} className='text-green-500' />
                                    <span className="text-sm font-light">Editing Date</span>
                                </div>
                                <span className="text-sm font-extra-light">{formatDate(recentSchedule.editingDate)}</span>
                            </li>
                            <li className='w-full flex items-center justify-between'>
                                <div className="flex items-center gap-1">
                                    <Check size={15} className='text-green-500' />
                                    <span className="text-sm font-light">Delivery Date</span>
                                </div>
                                <span className="text-sm font-extra-light">{formatDate(recentSchedule.deliveryDate)}</span>
                            </li>
                            <li className='w-full flex items-center justify-between'>
                                <div className="flex items-center gap-1">
                                    <Check size={15} className='text-green-500' />
                                    <span className="text-sm font-light">Status</span>
                                </div>
                                <span className="text-sm font-extralight bg-gray-100 rounded-md border border-gray-500 px-3 ">{recentSchedule.status}</span>
                            </li>
                        </ul>
                    </div>
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
                                            <span className="text-gray-800 text-sm bg-gray-100 rounded-md border border-gray-500 px-3 ">{schedule.status}</span>

                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default ClientDetail
