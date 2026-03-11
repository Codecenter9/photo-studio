"use client"

import FrontFooter from "@/components/frontend/layout/footer";
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
                <div className="min-h-screen relative flex flex-col bg-gray-100">

                    {!isAuthPage && (
                        <div className="">
                            <FrontNavbar />
                        </div>
                    )}

                    <main>
                        {children}
                    </main>
                    {!isAuthPage && (
                        <div className="">
                            <FrontFooter />
                        </div>
                    )}
                </div>
            </body>
        </html>
    );
}