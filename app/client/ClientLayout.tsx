"use client"
import ClientNavbar from '@/components/client/layout/navbar/navbar';
import { Roboto } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import { ISettings } from '@/types/models/settings';
import { useEffect, useState } from 'react';
import axios from 'axios';

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

    const [settings, setSettings] = useState<ISettings>();

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await axios.get('/api/settings');

                setSettings(response.data);
            } catch (error) {
                console.log("failed to fetch settings", error);
            }
        }
        fetchSettings();
    }, [])
    
    return (
        <SessionProvider session={session}>
            <div className={`relative overflow-x-hidden flex min-h-screen scrollbar-thin ${roboto.className} font-sans`}>
                <ClientNavbar settings={settings} />
                <main className="pt-24 flex-1 bg-gray-100 p-6 md:px-12 lg:px-16">
                    {children}
                </main>
            </div>
        </SessionProvider>
    )
}

export default ClientLayout
