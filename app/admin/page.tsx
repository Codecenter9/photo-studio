
import React from 'react'
import Dashboard from './dashboard/dashboard'

const Admin = () => {
    return (
        <div className='w-full min-h-screen flex flex-col gap-6'>
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-sm text-gray-500">
                    Quick access to all your admin features and settings. Manage users, view analytics, and configure your application with ease.
                </p>
            </div>
            <Dashboard />
        </div>
    )
}

export default Admin
