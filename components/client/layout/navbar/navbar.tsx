"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@mui/material";
import { Camera, Menu as MenuIcon, X } from "lucide-react";
import { usePathname } from "next/navigation";
const ClientNavbar = () => {
    const router = useRouter();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const pathname = usePathname();

    const handleLogout = async () => {
        await signOut({ redirect: false });
        router.push("/auth/login");
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    return (
        <nav className="fixed w-full bg-white/70 backdrop-blur-lg border-b border-white/20 shadow-sm z-50">
            <div className="h-16 flex items-center justify-between px-4 sm:px-8">
                <div className="flex items-center gap-2 group">
                    <Link href="/client" className="flex items-center gap-2 text-xl font-bold text-gray-800 transition-transform">
                        <Camera size={28} className="text-blue-600 group-hover:text-blue-700 transition-colors" />
                        <span className="bg-linear-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                            PhotoApp
                        </span>
                    </Link>
                </div>

                <div className="hidden md:flex items-center gap-8 text-gray-800 font-medium">
                    <Link
                        href="/client/my-files"
                        className={`hover:text-blue-600 transition-all hover:scale-105 ${pathname === "/client/my-files" ? "text-blue-600" : ""
                            }`}
                    >
                        My Files
                    </Link>
                    <Link
                        href="/client/my-schedules"
                        className={`hover:text-blue-600 transition-all hover:scale-105 ${pathname === "/client/my-schedules" ? "text-blue-600" : ""
                            }`}
                    >
                        My Schedules
                    </Link>
                </div>

                <div className="hidden lg:block">
                    <div className="flex items-center gap-3">
                        <Button variant='outlined' className='w-max'>Book New Schedule</Button>
                        <Button
                            onClick={handleLogout}
                            variant="contained"
                            className="bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-5 py-2 rounded-full shadow-md hover:shadow-lg transform transition-all duration-300 flex items-center gap-2"
                        >
                            Log out
                        </Button>
                    </div>
                </div>

                <span
                    onClick={toggleMobileMenu}
                    className="md:hidden cursor-pointer p-2 rounded-md hover:bg-gray-100 transition-colors"
                    aria-label="Toggle menu"
                >
                    {mobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
                </span>
            </div>

            {mobileMenuOpen && (
                <div className="md:hidden bg-gray-100/30 backdrop-blur-lg px-4 py-4 flex flex-col gap-4">
                    <div className="flex flex-col gap-3 text-gray-800 font-medium">
                        <Link
                            href="/client/my-files"
                            onClick={closeMobileMenu}
                            className={`py-1 px-3 rounded-lg hover:bg-blue-50 transition-colors ${pathname === "/client/my-files" ? "text-blue-500" : ""
                                }`}
                        >
                            My Files
                        </Link>
                        <Link
                            href="/client/my-schedules"
                            onClick={closeMobileMenu}
                            className={`py-1 px-3 rounded-lg hover:bg-blue-50 transition-colors ${pathname === "/client/my-schedules" ? "text-blue-500" : ""
                                }`}   >
                            My Schedules
                        </Link>
                    </div>

                    <div className="w-full flex gap-3 items-center">
                        <Button
                            onClick={() => {
                                handleLogout();
                                closeMobileMenu();
                            }}
                            variant="contained"
                            className='w-full'
                            color="error"
                        >
                            Log out
                        </Button>
                        <Button variant='outlined' className='w-full'>Book New Schedule</Button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default ClientNavbar;