// components/DateField.tsx
"use client";

import React from "react";
import { useCalendar } from "@/context/CalendarContext";
import { formatDate } from "@/lib/calendar";

interface DateFieldProps {
    value?: Date | null;
    label?: string;
    className?: string;
}

export default function DateField({ value, label, className }: DateFieldProps) {
    const { mode } = useCalendar();

    return (
        <div className={`flex flex-col ${className}`}>
            {label && <span className="text-sm text-gray-500 mb-1">{label}</span>}
            <div className="p-2 border rounded-md bg-gray-50">
                {formatDate(value ?? new Date(), mode)}
            </div>
        </div>
    );
}