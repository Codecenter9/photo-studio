"use client";

import { Album, Calendar, ChevronLeft, LayoutDashboard, Settings, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
    isOpen: boolean;
    collapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;
    setIsOpen: (open: boolean) => void;
}

const Sidebar = ({ isOpen, setIsOpen, collapsed, setCollapsed }: SidebarProps) => {
    const pathname = usePathname();

    const menuItems = [
        { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { name: "Schedules", href: "/admin/schedules", icon: Calendar },
        { name: "Files", href: "/admin/files", icon: Album },
        { name: "Users", href: "/admin/users", icon: User },
        { name: "Settings", href: "/admin/settings", icon: Settings },
    ];

    const closeSidebar = () => setIsOpen(false);

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-gray-100 backdrop-blur-2xl bg-opacity-50 z-20 md:hidden"
                    onClick={closeSidebar}
                />
            )}

            <aside
                className={`
                    fixed top-0 left-0 z-50 h-screen bg-gray-900 text-white
                    flex flex-col justify-between
                    transition-all duration-300 ease-in-out
                    ${collapsed ? "w-24" : "w-64"}
                    ${isOpen ? "translate-x-0" : "-translate-x-full"}
                    md:translate-x-0
                `}
            >
                <div>
                    <div className="p-6 border-b border-gray-700 flex flex-col items-center">
                        <div className="w-20 h-20 bg-gray-600 rounded-full flex items-center justify-center text-2xl font-bold mb-3">
                            JD
                        </div>
                        {!collapsed && (
                            <>
                                <h3 className="text-sm font-medium">John Doe</h3>
                                <p className="text-xs text-gray-400">Admin</p>
                            </>
                        )}
                    </div>

                    <nav className="p-4 space-y-1">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={closeSidebar}
                                    title={collapsed ? item.name : undefined}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-md transition ${isActive
                                        ? "bg-gray-800 text-white"
                                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                                        }`}
                                >
                                    <span className="text-md">{<item.icon size={18} />}</span>
                                    <span
                                        className={`text-sm font-medium transition-all duration-300 ${collapsed ? "hidden" : ""
                                            }`}
                                    >
                                        {item.name}
                                    </span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div>
                    <div className="hidden md:flex justify-end px-4 py-2">
                        <button
                            onClick={() => setCollapsed(!collapsed)}
                            className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors cursor-pointer"
                            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                        >
                            <ChevronLeft
                                size={20}
                                className={`transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
                            />
                        </button>
                    </div>

                    <div className="hidden md:block p-4 border-t border-gray-700 text-xs text-gray-400 text-center">
                        {!collapsed ? (
                            <>
                                <p>© 2025 Your Company</p>
                            </>
                        ) : (
                            <p className="text-xs">©</p>
                        )}
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;