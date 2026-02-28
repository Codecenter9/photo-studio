import { ISchedule } from '@/types/models/Schedule';
import { IUser } from '@/types/models/user';
import { ArrowLeft } from 'lucide-react'
import React from 'react'

interface ClientDetailSectionProps {
    selectedSchedule?: ISchedule;
    setSelectedScheduleId?: React.Dispatch<React.SetStateAction<string>>;
}
const ClientDetail = ({ selectedSchedule, setSelectedScheduleId }: ClientDetailSectionProps) => {
    return (
        <div className="w-full flex flex-col items-center gap-8 overflow-hidden">
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
            <div className="w-full flex items-center gap-6">
                <div className="flex flex-1 items-center gap-3 border border-gray-300 rounded-md p-6">
                    <div className="flex items-center justify-center w-16 h-16 rounded-md bg-purple-100 border-2 border-purple-400 shadow-sm">
                        <span className="text-2xl font-bold text-purple-700">
                            {(selectedSchedule?.clientId as IUser)?.name?.charAt(0).toUpperCase() || ""}
                        </span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center border border-gray-300 rounded-md bg-gray-100 px-3 py-1">
                            <span>Name: {(selectedSchedule?.clientId as IUser)?.name}</span>
                        </div>
                        <div className="flex items-center border border-gray-300 rounded-md bg-gray-100 px-3 py-1">
                            <span>Phone: {(selectedSchedule?.clientId as IUser)?.phone}</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-2 items-center gap-3 border border-gray-300 rounded-md p-6">
                    schedule-detail
                </div>
            </div>
        </div>
    )
}

export default ClientDetail
