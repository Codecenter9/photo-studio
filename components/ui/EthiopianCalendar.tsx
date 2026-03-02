"use client";

import React, { useState } from "react";
import Calendar, { CalendarProps } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { toEthiopian, toGregorian } from "ethiopian-date";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Switch from '@mui/material/Switch';
import { useCalendar } from "@/context/CalendarContext";

const ETH_MONTHS = [
    "መስከረም", "ጥቅምት", "ኅዳር", "ታኅሣሥ",
    "ጥር", "የካቲት", "መጋቢት", "ሚያዝያ",
    "ግንቦት", "ሰኔ", "ሐምሌ", "ነሐሴ", "ጳጉሜን",
];

const ETH_DAYS = ["እሑድ", "ሰኞ", "ማክሰኞ", "ረቡዕ", "ሐሙስ", "ዓርብ", "ቅዳሜ"];

interface CalendarSwitcherProps {
    className?: string;
    value: Date;
    onChange: (date: Date) => void;
}

export default function CalendarSwitcher({ className, value, onChange }: CalendarSwitcherProps) {
    const { mode, setMode } = useCalendar();
    const [showMonthYearPicker, setShowMonthYearPicker] = useState(false);

    const getEthiopianDate = (date?: Date | null) => {
        const d = date ? new Date(date) : new Date(); 
        const [year, month, day] = toEthiopian(
            d.getFullYear(),
            d.getMonth() + 1,
            d.getDate()
        );
        return { year, month, day };
    };

    const todayEthiopian = getEthiopianDate(new Date());

    const getDaysInEthiopianMonth = (year: number, month: number) => {
        if (month < 13) return 30;
        const [gy, gm, gd] = toGregorian(year, month, 1);
        const firstOfPagume = new Date(gy, gm - 1, gd);
        const [nextGy, nextGm, nextGd] = toGregorian(year + 1, 1, 1);
        const firstOfNextYear = new Date(nextGy, nextGm - 1, nextGd);
        const diffDays = (firstOfNextYear.getTime() - firstOfPagume.getTime()) / (1000 * 60 * 60 * 24);
        return diffDays;
    };

    const handleGregorianChange: CalendarProps['onChange'] = (val) => {
        let newDate: Date | undefined;
        if (val instanceof Date) newDate = val;
        else if (Array.isArray(val)) newDate = val.find(v => v instanceof Date) as Date;
        if (newDate) onChange(newDate);
    };

    const handleEthiopianDayClick = (day: number) => {
        const { year, month } = getEthiopianDate(value);
        try {
            const [gy, gm, gd] = toGregorian(year, month, day);
            onChange(new Date(gy, gm - 1, gd));
        } catch (e) {
            console.error("Invalid Ethiopian date", e);
        }
    };

    const goToPrevEthiopianMonth = () => {
        const { year, month, day } = getEthiopianDate(value);
        let newYear = year;
        let newMonth = month - 1;
        if (newMonth < 1) {
            newMonth = 13;
            newYear -= 1;
        }
        const daysInNewMonth = getDaysInEthiopianMonth(newYear, newMonth);
        const newDay = Math.min(day, daysInNewMonth);
        try {
            const [gy, gm, gd] = toGregorian(newYear, newMonth, newDay);
            onChange(new Date(gy, gm - 1, gd));
        } catch (e) {
            console.error("Invalid date", e);
        }
    };

    const goToNextEthiopianMonth = () => {
        const { year, month, day } = getEthiopianDate(value);
        let newYear = year;
        let newMonth = month + 1;
        if (newMonth > 13) {
            newMonth = 1;
            newYear += 1;
        }
        const daysInNewMonth = getDaysInEthiopianMonth(newYear, newMonth);
        const newDay = Math.min(day, daysInNewMonth);
        try {
            const [gy, gm, gd] = toGregorian(newYear, newMonth, newDay);
            onChange(new Date(gy, gm - 1, gd));
        } catch (e) {
            console.error("Invalid date", e);
        }
    };

    const handleEthiopianMonthYearChange = (newYear: number, newMonth: number) => {
        const { day } = getEthiopianDate(value);
        const daysInNewMonth = getDaysInEthiopianMonth(newYear, newMonth);
        const newDay = Math.min(day, daysInNewMonth);
        try {
            const [gy, gm, gd] = toGregorian(newYear, newMonth, newDay);
            onChange(new Date(gy, gm - 1, gd));
            setShowMonthYearPicker(false);
        } catch (e) {
            console.error("Invalid date", e);
        }
    };

    const { year: ethYear, month: ethMonth, day: ethDay } = getEthiopianDate(value);
    const daysInMonth = getDaysInEthiopianMonth(ethYear, ethMonth);

    const [firstGy, firstGm, firstGd] = toGregorian(ethYear, ethMonth, 1);
    const firstDayOfMonth = new Date(firstGy, firstGm - 1, firstGd).getDay();

    const currentEthYear = ethYear;
    const yearOptions = Array.from({ length: 101 }, (_, i) => currentEthYear - 50 + i);
    const monthOptions = ETH_MONTHS.map((name, index) => ({ value: index + 1, label: name }));

    return (
        <div className={cn("w-full", className)}>
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

            {mode === "gregorian" && (
                <Calendar value={value} onChange={handleGregorianChange} />
            )}

            {mode === "ethiopian" && (
                <div className="border border-pink-500 rounded p-3">
                    <div className="flex items-center justify-between mb-3">
                        <span onClick={goToPrevEthiopianMonth} className="hover:bg-gray-100 p-2 transition-all duration-300 cursor-pointer">
                            <ChevronLeft size={18} className="text-gray-950" />
                        </span>
                        <span
                            onClick={() => setShowMonthYearPicker(!showMonthYearPicker)}
                            className="text-center font-semibold hover:bg-gray-100 px-3 py-2 cursor-pointer"
                        >
                            {ETH_MONTHS[ethMonth - 1]} {ethYear}
                        </span>
                        <span onClick={goToNextEthiopianMonth} className="hover:bg-gray-100 p-2 transition-all duration-300 cursor-pointer">
                            <ChevronRight size={18} className="text-gray-950" />
                        </span>
                    </div>

                    {showMonthYearPicker && (
                        <div className="mb-4 p-3 border border-pink-500 rounded bg-gray-50">
                            <div className="flex gap-2">
                                <select
                                    title="select"
                                    value={ethMonth}
                                    onChange={(e) => {
                                        const newMonth = parseInt(e.target.value);
                                        handleEthiopianMonthYearChange(ethYear, newMonth);
                                    }}
                                    className="flex-1 p-1 border border-pink-300  rounded cursor-pointer"
                                >
                                    {monthOptions.map((m) => (
                                        <option key={m.value} value={m.value}>
                                            {m.label}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    title="select"
                                    value={ethYear}
                                    onChange={(e) => {
                                        const newYear = parseInt(e.target.value);
                                        handleEthiopianMonthYearChange(newYear, ethMonth);
                                    }}
                                    className="flex-1 p-1 border border-pink-300 rounded cursor-pointer"
                                >
                                    {yearOptions.map((y) => (
                                        <option key={y} value={y}>
                                            {y}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-7 text-center text-sm font-semibold mb-2">
                        {ETH_DAYS.map((day) => (
                            <div key={day}>{day.substring(0, 2)}</div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 text-center gap-1">
                        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                            <div key={`empty-${i}`} className="p-2" />
                        ))}
                        {Array.from({ length: daysInMonth }).map((_, i) => {
                            const dayNumber = i + 1;
                            const isSelected = dayNumber === ethDay;
                            const isToday =
                                todayEthiopian.year === ethYear &&
                                todayEthiopian.month === ethMonth &&
                                todayEthiopian.day === dayNumber;

                            return (
                                <div
                                    key={dayNumber}
                                    onClick={() => handleEthiopianDayClick(dayNumber)}
                                    className={cn(
                                        "p-2 cursor-pointer transition text-sm",
                                        isToday && "bg-yellow-200",
                                        isSelected && "bg-blue-600 text-white",
                                        !isSelected && "hover:bg-gray-100"
                                    )}
                                >
                                    {dayNumber}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}