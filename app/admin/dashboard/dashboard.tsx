"use client";

import { User } from 'lucide-react'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import TodaySchedule from './todaySchedule'
import { ISchedule } from "@/types/models/Schedule";
import axios from "axios";
import { handleError } from "@/lib/error";
import { IUser } from '@/types/models/user';
import Link from 'next/link';
import ClientDetail from '../schedules/components/clientDetail';

const Dashboard = () => {
    const [schedules, setSchedules] = useState<ISchedule[]>([]);
    const [users, setUsers] = useState<IUser[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    const [selectedScheduleId, setSelectedScheduleId] = useState("");

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

    const totalClients = users.filter(user => user.role === "client").length;
    const totalAdmins = users.filter(user => user.role === "admin").length;

    const now = new Date().getTime();
    const upcomingSchedules = schedules.filter(schedule => {
        return schedule?.eventDate && new Date(schedule.eventDate).getTime() > now;
    }).length;

    const isWithin24Hours = useCallback((date?: Date | string | null) => {
        if (!date) return false;

        const now = new Date().getTime();
        const next24Hours = now + 24 * 60 * 60 * 1000;

        const scheduleTime = new Date(date).getTime();
        return scheduleTime >= now && scheduleTime <= next24Hours;
    }, []);

    const todayPhotoShotSchedules = useMemo(
        () =>
            schedules.filter((schedule) =>
                isWithin24Hours(schedule.eventDate)
            ),
        [schedules, isWithin24Hours]
    );

    const todayEditingSchedules = useMemo(
        () =>
            schedules.filter((schedule) =>
                isWithin24Hours(schedule.editingDate)
            ),
        [schedules, isWithin24Hours]
    );

    const todayDeliverySchedules = useMemo(
        () =>
            schedules.filter((schedule) =>
                isWithin24Hours(schedule.deliveryDate)
            ),
        [schedules, isWithin24Hours]
    );

    const totalTodaySchedules =
        todayPhotoShotSchedules.length +
        todayEditingSchedules.length +
        todayDeliverySchedules.length

    const selectedSchedule = schedules.find((schedule) => schedule._id === selectedScheduleId);
    return (
        <>
            {
                selectedSchedule ? (
                    <ClientDetail fetchSchedules={fetchSchedules} schedules={schedules} selectedSchedule={selectedSchedule} setSelectedScheduleId={setSelectedScheduleId} />
                ) :
                    (<div className='flex flex-col gap-6'>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            <div className="flex flex-col gap-3 rounded-md border border-gray-300 hover:border-gray-500 transition-all duration-300 p-3 cursor-pointer group">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-base font-serif font-normal text-gray-500 group-hover:text-gray-950 transition-all duration-300">Today Schedules</h2>
                                    <User className="w-6 h-6 text-gray-500 group-hover:text-gray-950 transition-all duration-300" />
                                </div>
                                <hr className="flex-1 border-gray-200" />
                                <div className="flex flex-col gap-2">
                                    <p className="text-lg font-serif font-normal text-gray-500 group-hover:text-gray-950 transition-all duration-300">{totalTodaySchedules} <sub className="text-sm text-gray-500 font-extralight">Schedules</sub></p>
                                </div>

                                <div className="flex items-center justify-center gap-1">
                                    <a href='#todayschedule' className="text-sm text-indigo-500 font-medium cursor-pointer hover:underline">View details</a>
                                    <hr className="flex-1 border-gray-200" />
                                </div>
                            </div>
                            <div className="flex flex-col gap-3 rounded-md border border-gray-300 hover:border-gray-500 transition-all duration-300 p-3 cursor-pointer group">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-base font-serif font-normal text-gray-500 group-hover:text-gray-950 transition-all duration-300">UpComming Schedules</h2>
                                    <User className="w-6 h-6 text-gray-500 group-hover:text-gray-950 transition-all duration-300" />
                                </div>
                                <hr className="flex-1 border-gray-200" />
                                <div className="flex flex-col gap-2">
                                    <p className="text-lg font-serif font-normal text-gray-500 group-hover:text-gray-950 transition-all duration-300">{upcomingSchedules} <sub className="text-sm text-gray-500 font-extralight">Scheduls</sub></p>
                                </div>

                                <div className="flex items-center justify-center gap-1">
                                    <Link href="/admin/schedules" className="text-sm text-indigo-500 font-medium cursor-pointer hover:underline">View details</Link>
                                    <hr className="flex-1 border-gray-200" />
                                </div>
                            </div>
                            <div className="flex flex-col gap-3 rounded-md border border-gray-300 hover:border-gray-500 transition-all duration-300 p-3 cursor-pointer group">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-base font-serif font-normal text-gray-500 group-hover:text-gray-950 transition-all duration-300">Total Clients</h2>
                                </div>
                                <hr className="flex-1 border-gray-200" />
                                <div className="flex flex-col gap-2">
                                    <p className="text-lg font-serif font-normal text-gray-500 group-hover:text-gray-950 transition-all duration-300">{totalClients} <sub className="text-sm text-gray-500 font-extralight">Total Clients</sub></p>
                                </div>

                                <div className="flex items-center justify-center gap-1">
                                    <Link href="/admin/users" className="text-sm text-indigo-500 font-medium cursor-pointer hover:underline">View details</Link>
                                    <hr className="flex-1 border-gray-200" />
                                </div>
                            </div>
                            <div className="flex flex-col gap-3 rounded-md border border-gray-300 hover:border-gray-500 transition-all duration-300 p-3 cursor-pointer group">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-base font-serif font-normal text-gray-500 group-hover:text-gray-950 transition-all duration-300">Administrators</h2>
                                    <User className="w-6 h-6 text-gray-500 group-hover:text-gray-950 transition-all duration-300" />
                                </div>
                                <hr className="flex-1 border-gray-200" />
                                <div className="flex flex-col gap-2">
                                    <p className="text-lg font-serif font-normal text-gray-500 group-hover:text-gray-950 transition-all duration-300">{totalAdmins} <sub className="text-sm text-gray-500 font-extralight">Total Admins</sub></p>
                                </div>

                                <div className="flex items-center justify-center gap-1">
                                    <Link href="/admin/users" className="text-sm text-indigo-500 font-medium cursor-pointer hover:underline">View details</Link>
                                    <hr className="flex-1 border-gray-200" />
                                </div>
                            </div>
                        </div>
                        <div id="todayschedule" >
                            <TodaySchedule schedules={schedules} loading={loading} error={error} setSelectedScheduleId={setSelectedScheduleId} />
                        </div>
                    </div>
                    )}
        </>

    )
}

export default Dashboard
