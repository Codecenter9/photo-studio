"use client"

import FrontNavbar from "@/components/frontend/layout/navbar";
import { usePathname } from "next/navigation";

export default function FrontLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const path = usePathname();
    const isAuthPage = path.startsWith("/auth");

    return (
        <html lang="en">
            <body>
                <div className="min-h-screen relative flex flex-col bg-gray-50">

                    {!isAuthPage && (
                        <div className="fixed top-0 z-10 w-full h-18 px-6 lg:px-16 flex items-center
                                        bg-gray-900/10 backdrop-blur-md">
                            <FrontNavbar />
                        </div>
                    )}

                    <main>
                        {children}
                    </main>

                </div>
            </body>
        </html>
    );
}