"use client"
import ClientNavbar from '@/components/client/layout/navbar/navbar';
import { Roboto } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";

const roboto = Roboto({
    weight: '400',
    subsets: ['latin'],
})

interface Props {
    children: React.ReactNode;
    session: Session;
}
const ClientLayout = ({
    children,
    session,
}: Props) => {
    return (
        <SessionProvider session={session}>
            <div className={`relative overflow-x-hidden flex min-h-screen scrollbar-thin ${roboto.className} font-sans`}>
                <ClientNavbar />
                <main className="pt-24 flex-1 bg-gray-100 p-6 md:px-12 lg:px-16">
                    {children}
                </main>
            </div>
        </SessionProvider>
    )
}

export default ClientLayout
