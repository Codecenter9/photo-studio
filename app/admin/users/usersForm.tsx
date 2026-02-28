import Input from '@/components/ui/input'
import DialogBox from '@/components/ui/modal'
import { CircularProgress, FormControl, MenuItem, Select, Snackbar, Alert } from '@mui/material'
import axios from 'axios'
import React, { useState, useRef } from 'react'

interface UserFormProps {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    fetchUsers: () => void;
}

interface RegisterForm {
    name: string
    email: string
    phone: string
    password?: string
    role: "admin" | "client"
}

const UsersForm = ({ open, setOpen, fetchUsers }: UserFormProps) => {

    const [form, setForm] = useState<RegisterForm>({
        name: '',
        email: '',
        phone: '',
        password: '1234',
        role: 'client'
    })
    const hiddenSubmitRef = useRef<HTMLButtonElement>(null)

    const [fieldErrors, setFieldErrors] = useState<Partial<RegisterForm>>({})
    const [loading, setLoading] = useState(false)

    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState("")

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handleRoleChange = (e: any) => {
        setForm(prev => ({
            ...prev,
            role: e.target.value
        }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setFieldErrors({})

        if (!form.name || !form.email || !form.phone) {
            setFieldErrors({
                name: !form.name ? 'Name is required' : undefined,
                email: !form.email ? 'Email / Username is required' : undefined,
                phone: !form.phone ? 'Phone is required' : undefined,
            })
            setLoading(false)
            return
        }

        try {
            const response = await axios.post('/api/auth/user', form)

            if (response.status === 201 || response.status === 200) {
                setSnackbarMessage("User registered successfully!")
                setSnackbarOpen(true)
                setOpen(false)
                fetchUsers()
                setForm({
                    name: '',
                    email: '',
                    phone: '',
                    password: '1234',
                    role: 'client'
                })
            }

        } catch (error: any) {
            if (error.response?.data?.errors) {
                setFieldErrors(error.response.data.errors)
            } else {
                setSnackbarMessage("Something went wrong!")
                setSnackbarOpen(true)
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <DialogBox
                open={open}
                title="Create New User"
                onClose={() => (
                    setOpen(false),
                    setFieldErrors({}),
                    setForm({
                        name: '',
                        email: '',
                        phone: '',
                        password: '1234',
                        role: 'client'
                    })
                )}
                onSave={() => hiddenSubmitRef.current?.click()}
                maxWidth="xl"
                saveLabel={loading
                    ? <span className="flex items-center gap-2"><CircularProgress size={15} /> Saving...</span>
                    : "Save"
                }
            >
                <div className='flex w-2xl flex-col gap-3'>
                    {Object.keys(fieldErrors).length > 0 && (
                        <div className="mb-4 p-2 rounded-md bg-red-100">
                            <span className="text-red-600 text-sm text-start">
                                {Object.values(fieldErrors).map((error, index) => (
                                    <p key={index}>{error}<br /></p>
                                ))}
                            </span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} id="user-form" className='w-full grid grid-cols-1 md:grid-cols-2 gap-4'>

                        <Input
                            type="text"
                            name="name"
                            label='Name'
                            placeholder="Enter user name"
                            value={form.name}
                            onChange={handleChange}
                        />

                        <Input
                            type="text"
                            name="email"
                            label='Email/Username'
                            placeholder="Enter user email/username"
                            value={form.email}
                            onChange={handleChange}
                        />

                        <Input
                            type="text"
                            name="phone"
                            label='Phone'
                            placeholder="Enter user phone number"
                            value={form.phone}
                            onChange={handleChange}
                        />

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">
                                Select Role
                            </label>
                            <FormControl fullWidth size="small">
                                <Select
                                    name="role"
                                    value={form.role}
                                    onChange={handleRoleChange}
                                >
                                    <MenuItem value="admin">Admin</MenuItem>
                                    <MenuItem value="client">Client</MenuItem>
                                </Select>
                            </FormControl>
                        </div>

                        <button title='submit button' type="submit" ref={hiddenSubmitRef} className='hidden' />
                    </form>
                </div>
            </DialogBox>

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
        </>
    )
}

export default UsersForm