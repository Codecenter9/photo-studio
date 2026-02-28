"use client";
import React, { useState, useEffect } from 'react';
import {
    Button,
    IconButton,
    Typography,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    Pagination,
    Alert,
    Divider,
} from '@mui/material';
import { Eye, Trash, Plus } from 'lucide-react';

interface Schedule {
    id: number;
    date: string;
    type: string;
    description?: string;
    location?: string;
}

const fetchSchedules = (): Promise<Schedule[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { id: 1, date: '2025-03-15', type: 'Wedding', description: 'Smith wedding', location: 'Central Park' },
                { id: 2, date: '2025-02-10', type: 'Conference', description: 'Tech conference', location: 'Convention Center' },
                { id: 3, date: '2025-04-20', type: 'Birthday', description: 'Sarah’s 30th', location: 'Rooftop Lounge' },
                { id: 4, date: '2025-01-05', type: 'Meeting', description: 'Project kickoff', location: 'Zoom' },
                { id: 5, date: '2025-05-12', type: 'Wedding', description: 'Johnson wedding', location: 'Beach Resort' },
            ]);
        }, 1000);
    });
};

const MySchedules = () => {
    // State
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [filteredSchedules, setFilteredSchedules] = useState<Schedule[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<'upcoming' | 'completed' | 'all'>('all');
    const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
    const [scheduleToDelete, setScheduleToDelete] = useState<Schedule | null>(null);
    const [page, setPage] = useState<number>(1);
    const itemsPerPage = 5;

    useEffect(() => {
        const loadSchedules = async () => {
            try {
                setLoading(true);
                const data = await fetchSchedules();
                setSchedules(data);
                setFilteredSchedules(data);
                setError(null);
            } catch (err) {
                setError('Failed to load schedules. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        loadSchedules();
    }, []);

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        let filtered = schedules;
        if (filter === 'upcoming') {
            filtered = schedules.filter((s) => s.date >= today);
        } else if (filter === 'completed') {
            filtered = schedules.filter((s) => s.date < today);
        }
        setFilteredSchedules(filtered);
        setPage(1);
    }, [filter, schedules]);

    const totalPages = Math.ceil(filteredSchedules.length / itemsPerPage);
    const paginatedSchedules = filteredSchedules.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

    // Handlers
    const handleFilterChange = (newFilter: 'upcoming' | 'completed' | 'all') => {
        setFilter(newFilter);
    };

    const handleView = (schedule: Schedule) => {
        setSelectedSchedule(schedule);
    };

    const handleCloseDetail = () => {
        setSelectedSchedule(null);
    };

    const handleDeleteClick = (schedule: Schedule) => {
        setScheduleToDelete(schedule);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (scheduleToDelete) {
            setSchedules((prev) => prev.filter((s) => s.id !== scheduleToDelete.id));
            setDeleteDialogOpen(false);
            setScheduleToDelete(null);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setScheduleToDelete(null);
    };

    const getStatusChip = (date: string) => {
        const today = new Date().toISOString().split('T')[0];
        const isUpcoming = date >= today;
        return (
            <Chip
                label={isUpcoming ? 'Upcoming' : 'Completed'}
                color={isUpcoming ? 'success' : 'default'}
                size="small"
                variant="outlined"
            />
        );
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col lg:flex-row justify-between gap-3">
                <Typography variant="h5" component="h1" className="font-semibold">
                    My Schedules
                </Typography>
                <div className="flex gap-2">
                    <Button
                        variant={filter === 'all' ? 'contained' : 'outlined'}
                        size="small"
                        onClick={() => handleFilterChange('all')}
                    >
                        All
                    </Button>
                    <Button
                        variant={filter === 'upcoming' ? 'contained' : 'outlined'}
                        size="small"
                        onClick={() => handleFilterChange('upcoming')}
                    >
                        Upcoming
                    </Button>
                    <Button
                        variant={filter === 'completed' ? 'contained' : 'outlined'}
                        size="small"
                        onClick={() => handleFilterChange('completed')}
                    >
                        Completed
                    </Button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                <div className="w-full lg:flex-2 border border-gray-300 bg-white rounded-md p-3">
                    {loading ? (
                        <div className="flex justify-center items-center py-10">
                            <CircularProgress enableTrackSlot size={30} />
                        </div>
                    ) : error ? (
                        <Alert severity="error">{error}</Alert>
                    ) : paginatedSchedules.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">
                            No schedules found.
                        </div>
                    ) : (
                        <div className='overflow-x-auto'>
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="p-2">ID</th>
                                        <th className="p-2">Date</th>
                                        <th className="p-2">Type</th>
                                        <th className="p-2">Status</th>
                                        <th className="p-2 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedSchedules.map((schedule) => (
                                        <tr key={schedule.id} className="border-b hover:bg-gray-50">
                                            <td className="p-2">{schedule.id}</td>
                                            <td className="p-2">{new Date(schedule.date).toLocaleDateString()}</td>
                                            <td className="p-2">{schedule.type}</td>
                                            <td className="p-2">{getStatusChip(schedule.date)}</td>
                                            <td className="p-2 text-center">
                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    onClick={() => handleView(schedule)}
                                                >
                                                    <Eye size={18} />
                                                </IconButton>
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() => handleDeleteClick(schedule)}
                                                >
                                                    <Trash size={18} />
                                                </IconButton>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {totalPages > 1 && (
                                <div className="flex justify-center mt-4">
                                    <Pagination
                                        count={totalPages}
                                        page={page}
                                        onChange={(_, value) => setPage(value)}
                                        color="primary"
                                        size="small"
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="w-full lg:w-80 flex flex-col items-center border border-gray-300 bg-white rounded-md p-6">
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-center p-6 rounded-full bg-gray-300 border text-2xl font-bold uppercase">
                            JD
                        </span>
                        <Typography variant="h6" className="mt-2">
                            John Doe
                        </Typography>
                        <Chip label="CameraMan" size="small" className="mt-1" />
                    </div>
                    <Divider sx={{ width: '100%', my: 2 }} />
                    <div className="text-sm text-gray-600 w-full mb-4">
                        <p className="flex justify-between">
                            <span>Total Schedules:</span>
                            <span className="font-semibold">{schedules.length}</span>
                        </p>
                        <p className="flex justify-between mt-1">
                            <span>Upcoming:</span>
                            <span className="font-semibold">
                                {schedules.filter(s => new Date(s.date) >= new Date()).length}
                            </span>
                        </p>
                    </div>
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Plus size={16} />}
                        className="w-full"
                    >
                        Add Schedule
                    </Button>
                </div>
            </div>

            <Dialog open={!!selectedSchedule} onClose={handleCloseDetail} maxWidth="sm" fullWidth>
                <DialogTitle>Schedule Details</DialogTitle>
                <DialogContent dividers>
                    {selectedSchedule && (
                        <div className="space-y-2">
                            <p><strong>ID:</strong> {selectedSchedule.id}</p>
                            <p><strong>Date:</strong> {new Date(selectedSchedule.date).toLocaleDateString()}</p>
                            <p><strong>Type:</strong> {selectedSchedule.type}</p>
                            <p><strong>Description:</strong> {selectedSchedule.description || 'N/A'}</p>
                            <p><strong>Location:</strong> {selectedSchedule.location || 'N/A'}</p>
                            <p><strong>Status:</strong> {getStatusChip(selectedSchedule.date)}</p>
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDetail}>Close</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this schedule?
                    {scheduleToDelete && (
                        <div className="mt-2 text-sm text-gray-600">
                            <p>ID: {scheduleToDelete.id}</p>
                            <p>Type: {scheduleToDelete.type}</p>
                            <p>Date: {new Date(scheduleToDelete.date).toLocaleDateString()}</p>
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel}>Cancel</Button>
                    <Button onClick={handleDeleteConfirm} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default MySchedules;