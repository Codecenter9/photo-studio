"use client";

import { Button, IconButton, Drawer, List, ListItem, ListItemText } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { ChevronRight, Menu } from "lucide-react";

const FrontNavbar = () => {
    const path = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    const toggleMobileMenu = () => setMobileOpen(!mobileOpen);

    const menuItems = [
        { label: "Home", href: "/" },
        { label: "About", href: "/about" },
        { label: "Gallery", href: "/gallery" },
        { label: "Contact", href: "/contact" },
    ];

    return (
        <nav className="w-full flex items-center justify-between">
            <div className="flex items-center justify-center">
                <span className="text-3xl font-serif font-bold tracking-wide text-gray-300">Studio</span>
            </div>

            <div className="hidden md:flex items-center gap-6">
                {menuItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`text-gray-300 font-serif capitalize hover:text-blue-500 transition-colors ${path === item.href ? "text-blue-500 font-semibold" : ""
                            }`}
                    >
                        {item.label}
                    </Link>
                ))}

                <Link href="/auth/login">
                    <Button size="small" variant="outlined" color="primary">
                        Login
                    </Button>
                </Link>
            </div>

            <div className="md:hidden">
                <IconButton onClick={toggleMobileMenu} color="inherit">
                    <Menu size={24} className="text-gray-300" />
                </IconButton>
            </div>

            <Drawer
                anchor="right"
                open={mobileOpen}
                onClose={toggleMobileMenu}
                PaperProps={{ className: "w-64 bg-white/95 backdrop-blur-md" }}
            >
                <List className="flex flex-col items-center">
                    <div className="w-full flex flex-col gap-3 py-5">
                        <span className="text-center text-lg font-serif">Menu</span>
                        <hr className="h-1 text-gray-300" />
                    </div>
                    {menuItems.map((item) => (
                        <ListItem
                            key={item.href}
                            onClick={toggleMobileMenu}
                            className={`${path === item.href ? "text-blue-500 font-semibold" : "text-gray-800"
                                }`}
                        >
                            <Link href={item.href} className="w-full flex group items-center justify-between gap-3">
                                <ListItemText primary={item.label} />
                                <ChevronRight size={16} className="group-hover:translate-x-1 transition-all duration-300" />
                            </Link>
                        </ListItem>
                    ))}

                    <ListItem className="mt-4">
                        <Link href="/auth/login" className="w-full">
                            <Button fullWidth variant="outlined" color="primary">
                                Login
                            </Button>
                        </Link>
                    </ListItem>
                </List>
            </Drawer>
        </nav>
    );
};

export default FrontNavbar;