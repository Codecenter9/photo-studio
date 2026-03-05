"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Bell, Menu } from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { ISettings } from "@/types/models/settings";
import { formatDate } from "@/lib/calendar";
import { useCalendar } from "@/context/CalendarContext";

interface NavbarProps {
    settings?: ISettings;
    setIsOpen: (open: boolean) => void;
    collapsed: boolean;
}
const Navbar = ({ settings, collapsed, setIsOpen }: NavbarProps) => {
    const router = useRouter();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const { mode } = useCalendar();
    const { loggedInUser } = useCurrentUser();

    const today = new Date();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await signOut({ redirect: false });
        router.push("/auth/login");
    };

    return (
        <nav
            className={`
    fixed top-0 left-0 right-0 z-40 flex items-center justify-between
    backdrop-blur-3xl bg-gray-100/30 py-4 px-6 border-b border-gray-300
    transition-all duration-300 ease-in-out
    ${collapsed ? "md:left-24" : "lg:left-64"}
  `}
        >   <div className=" hidden lg:flex flex-col gap-0 w-64">
                <span className="text-xl font-serif">{settings?.studioName}</span>
                <span className="text-sm font-serif">Today: {formatDate(today, mode)}</span>
            </div>
            <div className="items-center flex lg:hidden cursor-pointer" onClick={() => setIsOpen(true)}>
                <Menu size={20} />
            </div>

            <div className="flex items-center gap-4">
                <span className="relative p-2 bg-gray-50 cursor-pointer hover:bg-gray-100 rounded-full transition">
                    <Bell size={16} className="text-gray-950" />
                    <p className="absolute top-1 right-1 block w-2 h-2 bg-red-500 rounded-full"></p>
                </span>

                <div className="relative" ref={dropdownRef}>
                    <span
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className=" flex items-center bg-gray-50 hover:bg-gray-100 border border-purple-500 rounded-full px-2 py-1 cursor-pointer transition"
                    >
                        <p className=" text-gray-950 text-lg">{loggedInUser?.name.substring(0, 2)}</p>
                    </span>

                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white text-gray-950 rounded-md shadow-lg py-1 z-10">
                            <Link
                                href="/admin/profile"
                                className="block px-4 py-2 text-sm hover:bg-gray-50 cursor-pointer"
                                onClick={() => setDropdownOpen(false)}
                            >
                                Your Profile
                            </Link>
                            <Link
                                href="/admin/settings"
                                className="block px-4 py-2 text-sm hover:bg-gray-50 cursor-pointer"
                                onClick={() => setDropdownOpen(false)}
                            >
                                Settings
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 cursor-pointer"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;