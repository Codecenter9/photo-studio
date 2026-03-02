"use client";

import { useState } from "react";
import Navbar from "@/components/admin/layout/navbar/navbar";
import Sidebar from "@/components/admin/layout/sidebar/sidebar";
import { Roboto } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import { CalendarProvider } from "@/context/CalendarContext";

const roboto = Roboto({
    weight: '400',
    subsets: ['latin'],
})

interface Props {
    children: React.ReactNode;
    session: Session;
}

export default function AdminLayout({
    children,
    session,
}: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    return (
        <CalendarProvider>
            <SessionProvider session={session}>
                <div className={`relative overflow-x-hidden flex h-screen scrollbar-thin ${roboto.className} font-sans`}>
                    <Sidebar isOpen={isOpen} collapsed={collapsed} setCollapsed={setCollapsed} setIsOpen={setIsOpen} />
                    <div className={`relative flex flex-col flex-1 transition-all duration-300 ease-in-out ${collapsed ? "lg:ml-24" : "lg:ml-64"}`}>
                        <Navbar collapsed={collapsed} setIsOpen={setIsOpen} />
                        <main className="pt-24 p-6 bg-gray-50 min-h-screen overflow-x-auto">
                            {children}
                        </main>
                    </div>
                </div>
            </SessionProvider>
        </CalendarProvider>
    );
}
