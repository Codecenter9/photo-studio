"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type CalendarMode = "gregorian" | "ethiopian";

interface CalendarContextProps {
    mode: CalendarMode;
    setMode: (mode: CalendarMode) => void;
}

const CalendarContext = createContext<CalendarContextProps>({
    mode: "gregorian",
    setMode: () => { },
});

export const CalendarProvider = ({ children }: { children: ReactNode }) => {
    const [mode, setModeState] = useState<CalendarMode>(() => {
        try {
            const stored = localStorage.getItem("calendarMode") as CalendarMode | null;
            return stored === "ethiopian" || stored === "gregorian" ? stored : "gregorian";
        } catch {
            return "gregorian";
        }
    });

    const setMode = (newMode: CalendarMode) => {
        setModeState(newMode);
        try {
            localStorage.setItem("calendarMode", newMode);
        } catch {
            console.log("error");
        }
    };

    return (
        <CalendarContext.Provider value={{ mode, setMode }}>
            {children}
        </CalendarContext.Provider>
    );
};

export const useCalendar = () => useContext(CalendarContext);