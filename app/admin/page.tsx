import { User } from 'lucide-react'
import React from 'react'

const Admin = () => {
    return (
        <div className='w-full min-h-screen flex flex-col gap-6'>
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-sm text-gray-500">
                    Quick access to all your admin features and settings. Manage users, view analytics, and configure your application with ease.
                </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                <div className="flex flex-col gap-3 rounded-md border border-gray-300 hover:border-gray-500 transition-all duration-300 p-3 cursor-pointer group">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-normal text-gray-500 group-hover:text-gray-950 transition-all duration-300">Clients</h2>
                        <User className="w-6 h-6 text-gray-500 group-hover:text-gray-950 transition-all duration-300" />
                    </div>
                    <hr className="flex-1 border-gray-200" />
                    <div className="flex flex-col gap-2">
                        <p className="text-lg font-normal text-gray-500 group-hover:text-gray-950 transition-all duration-300">500 <sub className="text-sm text-gray-500 font-extralight">Total Clients</sub></p>
                    </div>

                    <div className="flex items-center justify-center gap-1">
                        <p className="text-sm text-indigo-500 font-medium cursor-pointer hover:underline">View details</p>
                        <hr className="flex-1 border-gray-200" />
                    </div>
                </div>
                <div className="flex flex-col gap-3 rounded-md border border-gray-300 p-3 cursor-pointer group">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-normal text-gray-500 group-hover:text-gray-950 transition-all duration-300">Clients</h2>
                        <User className="w-6 h-6 text-gray-500 group-hover:text-gray-950 transition-all duration-300" />
                    </div>
                    <hr className="flex-1 border-gray-200" />
                    <div className="flex flex-col gap-2">
                        <p className="text-lg font-normal text-gray-500 group-hover:text-gray-950 transition-all duration-300">500 <sub className="text-sm text-gray-500 font-extralight">Total Clients</sub></p>
                    </div>

                    <div className="flex items-center justify-center gap-1">
                        <p className="text-sm text-indigo-500 font-medium cursor-pointer hover:underline">View details</p>
                        <hr className="flex-1 border-gray-200" />
                    </div>
                </div>
                <div className="flex flex-col gap-3 rounded-md border border-gray-300 p-3 cursor-pointer group">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-normal text-gray-500 group-hover:text-gray-950 transition-all duration-300">Clients</h2>
                        <User className="w-6 h-6 text-gray-500 group-hover:text-gray-950 transition-all duration-300" />
                    </div>
                    <hr className="flex-1 border-gray-200" />
                    <div className="flex flex-col gap-2">
                        <p className="text-lg font-normal text-gray-500 group-hover:text-gray-950 transition-all duration-300">500 <sub className="text-sm text-gray-500 font-extralight">Total Clients</sub></p>
                    </div>

                    <div className="flex items-center justify-center gap-1">
                        <p className="text-sm text-indigo-500 font-medium cursor-pointer hover:underline">View details</p>
                        <hr className="flex-1 border-gray-200" />
                    </div>
                </div>
                <div className="flex flex-col gap-3 rounded-md border border-gray-300 p-3 cursor-pointer group">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-normal text-gray-500 group-hover:text-gray-950 transition-all duration-300">Clients</h2>
                        <User className="w-6 h-6 text-gray-500 group-hover:text-gray-950 transition-all duration-300" />
                    </div>
                    <hr className="flex-1 border-gray-200" />
                    <div className="flex flex-col gap-2">
                        <p className="text-lg font-normal text-gray-500 group-hover:text-gray-950 transition-all duration-300">500 <sub className="text-sm text-gray-500 font-extralight">Total Clients</sub></p>
                    </div>

                    <div className="flex items-center justify-center gap-1">
                        <p className="text-sm text-indigo-500 font-medium cursor-pointer hover:underline">View details</p>
                        <hr className="flex-1 border-gray-200" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Admin
