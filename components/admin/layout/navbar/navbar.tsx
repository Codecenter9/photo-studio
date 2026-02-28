"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Bell, Menu, Search } from "lucide-react";
import Button from "@mui/material/Button";

interface NavbarProps {
    setIsOpen: (open: boolean) => void;
    collapsed: boolean;
}
const Navbar = ({ collapsed, setIsOpen }: NavbarProps) => {
    const router = useRouter();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

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
        >   <div className="items-center hidden lg:flex bg-white rounded-md px-3 py-2 w-64">
                <Search size={16} className="mr-2" />
                <input
                    type="text"
                    placeholder="Search..."
                    className="bg-transparent border-none focus:outline-none text-sm w-full"
                />
            </div>
            <div className="items-center flex lg:hidden cursor-pointer" onClick={() => setIsOpen(true)}>
                <Menu size={20} />
            </div>

            <div className="flex items-center gap-4">
                <Button className="relative p-2 bg-white hover:bg-gray-50 rounded-full transition">
                    <Bell size={16} className="text-gray-950" />
                    <span className="absolute top-1 right-1 block w-2 h-2 bg-red-500 rounded-full"></span>
                </Button>

                <div className="relative" ref={dropdownRef}>
                    <Button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center gap-2 bg-white hover:bg-gray-50 rounded-md py-1 px-2 cursor-pointer transition"
                    >
                        <span className=" text-gray-950 text-sm">John Doe</span>
                    </Button>

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