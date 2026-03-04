"use client"

import React, { useEffect, useState } from 'react'
import UsersForm from './usersForm'
import { Alert, Button, CircularProgress, IconButton, Snackbar } from '@mui/material'
import { Edit, Trash } from 'lucide-react'
import axios from 'axios'
import { IUser } from '@/types/models/user'
import { handleError } from '@/lib/error'
import DeleteModal from '@/components/ui/deleteModal'

const Users = () => {
    const [open, setOpen] = useState(false);
    const [users, setUsers] = useState<IUser[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState("")

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await axios.get("/api/auth/user");
            setUsers(response.data);
        } catch (err: unknown) {
            setError(handleError(err));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDeleteUser = async (id: string) => {
        setIsDeleting(true);
        try {
            await axios.delete(`/api/auth/user/${id}`);

            setSnackbarMessage("User deleted successfully");
            setSnackbarOpen(true);
            setUserToDelete(null)
            setDeleteModalOpen(false);
            fetchUsers();
        } catch (err) {
            console.error("Delete failed", err);
        } finally {
            setIsDeleting(false)
        }
    }

    const clients = users.filter((client) => client.role === "client");
    const admins = users.filter((admin) => admin.role === "admin");

    return (
        <div className='flex flex-col gap-3'>
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold">Users</h1>
                <p className="text-sm text-gray-500">
                    Manage and organize system users.
                </p>
            </div>

            <div className="">
                {error ? (
                    <p className="flex flex-2 bg-yellow-100 text-red-600 px-3 py-1 rounded-md">{error}</p>
                ) : (
                    <div className="col-span-2 flex flex-col gap-3 border border-gray-300 p-4 rounded-md">
                        <div className="w-full flex items-center justify-between">
                            <h2 className="text-lg font-medium">User List</h2>
                            <Button onClick={() => setOpen(true)} variant="outlined" size='small' color="primary">
                                Add New User
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 overflow-hidden">
                            {loading ?
                                (<span className="flex items-center justify-center gap-1"><CircularProgress enableTrackSlot size={15} /><p>Loading admins...</p></span>)
                                :
                                (<div className="overflow-auto scrollbar-thin border border-gray-300 rounded-md p-3">
                                    <span className="text-base text-center font-light font-serif">Admins</span>
                                    <table className='w-full text-sm'>
                                        <thead className="bg-gray-100">
                                            <tr className="border border-gray-300 hover:bg-gray-50 cursor-pointer">
                                                <th className='text-left p-2'>ID</th>
                                                <th className="text-left p-2">Name</th>
                                                <th className="text-left p-2">Email</th>
                                                <th className="text-left p-2">Phone</th>
                                                <th className="text-left p-2">Role</th>
                                                <th className="text-left p-2">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {admins.map((user, index) => (
                                                <tr key={index} className="border border-gray-300 hover:bg-gray-50 cursor-pointer">
                                                    <td className="p-2">{index + 1}</td>
                                                    <td className="p-2">{user.name}</td>
                                                    <td className="p-2">{user.email}</td>
                                                    <td className="p-2">{user.phone}</td>
                                                    <td className="p-2"><span className='px-3 rounded-sm text-sm bg-cyan-100 font-semibold'>{user.role}</span></td>
                                                    <td className="p-2">
                                                        <IconButton size='small' color="info">
                                                            <Edit size={16} />
                                                        </IconButton>
                                                        <IconButton onClick={() => {
                                                            setUserToDelete(user._id);
                                                            setDeleteModalOpen(true);
                                                        }}
                                                            size='small' color="error">
                                                            <Trash size={16} />
                                                        </IconButton>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>)
                            }
                            {loading ?
                                (<span className="flex items-center justify-center gap-1"><CircularProgress enableTrackSlot size={15} /><p>Loading clients...</p></span>)
                                :
                                (<div className="overflow-auto scrollbar-thin border border-gray-300 rounded-md p-3">
                                    <span className="w-full text-base text-center font-light font-serif">Clients</span>
                                    <table className='w-full text-sm'>
                                        <thead className="bg-gray-100">
                                            <tr className="border border-gray-300 hover:bg-gray-50 cursor-pointer">
                                                <th className='text-left p-2'>ID</th>
                                                <th className="text-left p-2">Name</th>
                                                <th className="text-left p-2">Email</th>
                                                <th className="text-left p-2">Phone</th>
                                                <th className="text-left p-2">Role</th>
                                                <th className="text-left p-2">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {clients.map((user, index) => (
                                                <tr key={index} className="border border-gray-300 hover:bg-gray-50 cursor-pointer">
                                                    <td className="p-2">{index + 1}</td>
                                                    <td className="p-2">{user.name}</td>
                                                    <td className="p-2">{user.email}</td>
                                                    <td className="p-2">{user.phone}</td>
                                                    <td className="p-2"><span className='px-3 rounded-sm text-sm bg-cyan-100 font-semibold'>{user.role}</span></td>
                                                    <td className="p-2">
                                                        <IconButton size='small' color="info">
                                                            <Edit size={16} />
                                                        </IconButton>
                                                        <IconButton size='small' color="error">
                                                            <Trash size={16} />
                                                        </IconButton>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>)
                            }
                        </div>
                    </div>
                )}

            </div>

            <UsersForm setOpen={setOpen} open={open} fetchUsers={fetchUsers} />
            <DeleteModal
                isOpen={deleteModalOpen}
                title="Delete User"
                description="Are you sure you want to delete this user? This action cannot be undone."
                onClose={() => {
                    setDeleteModalOpen(false);
                    setUserToDelete(null);
                }}
                onConfirm={() => {
                    if (userToDelete) {
                        handleDeleteUser(userToDelete);
                    }
                }}
                confirmText={isDeleting ? "Deleting..." : "Yes, Delete"}
            />

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <Alert
                    onClose={() => setSnackbarOpen(false)}
                    severity="success"
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    )
}

export default Users
