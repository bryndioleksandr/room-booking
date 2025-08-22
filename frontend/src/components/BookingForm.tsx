import React, { useState, useEffect } from 'react';
import { createBooking } from '../services/booking';
import { getUsers } from '../services/user';
import { toast } from 'react-toastify';

interface MeetingRoom {
    id: number;
    name: string;
    description: string;
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface BookingFormProps {
    room: MeetingRoom;
    onClose: () => void;
    onSuccess: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ room, onClose, onSuccess }) => {
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [description, setDescription] = useState('');
    const [participantIds, setParticipantIds] = useState<number[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ startTime?: string; endTime?: string; description?: string }>({});

    useEffect(() => {
        fetchUsers();
        // Set default times (next hour)
        const now = new Date();
        const nextHour = new Date(now.getTime() + 60 * 60 * 1000);
        const twoHoursLater = new Date(nextHour.getTime() + 60 * 60 * 1000);

        setStartTime(nextHour.toISOString().slice(0, 16));
        setEndTime(twoHoursLater.toISOString().slice(0, 16));
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await getUsers();
            setUsers(data);
        } catch (error: any) {
            toast.error('Failed to fetch users: ' + error.message);
        }
    };

    const validateForm = () => {
        const newErrors: { startTime?: string; endTime?: string; description?: string } = {};

        if (!startTime) {
            newErrors.startTime = 'Start time is required';
        }

        if (!endTime) {
            newErrors.endTime = 'End time is required';
        }

        if (startTime && endTime) {
            const start = new Date(startTime);
            const end = new Date(endTime);
            const now = new Date();

            if (start <= now) {
                newErrors.startTime = 'Start time must be in the future';
            }

            if (end <= start) {
                newErrors.endTime = 'End time must be after start time';
            }

            if (end.getTime() - start.getTime() < 30 * 60 * 1000) {
                newErrors.endTime = 'Booking must be at least 30 minutes long';
            }
        }

        if (!description.trim()) {
            newErrors.description = 'Description is required';
        } else if (description.trim().length < 10) {
            newErrors.description = 'Description must be at least 10 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        try {
            // For now, using a hardcoded user ID - in a real app, this would come from auth context
            const currentUserId = 1; // This should come from your auth state

            await createBooking({
                roomId: room.id,
                createdBy: currentUserId,
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                description: description.trim(),
                participantIds: participantIds.length > 0 ? participantIds : undefined
            });

            onSuccess();
        } catch (error: any) {
            toast.error(`Failed to book room: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const toggleParticipant = (userId: number) => {
        setParticipantIds(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Book Meeting Room</h3>
                            <p className="text-sm text-gray-600">{room.name}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                                    Start Time *
                                </label>
                                <input
                                    type="datetime-local"
                                    id="startTime"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                        errors.startTime ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {errors.startTime && (
                                    <p className="mt-1 text-sm text-red-600">{errors.startTime}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                                    End Time *
                                </label>
                                <input
                                    type="datetime-local"
                                    id="endTime"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                        errors.endTime ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {errors.endTime && (
                                    <p className="mt-1 text-sm text-red-600">{errors.endTime}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                Meeting Description *
                            </label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                    errors.description ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Describe the purpose of this meeting"
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Participants (Optional)
                            </label>
                            <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-md p-3">
                                {users.length === 0 ? (
                                    <p className="text-gray-500 text-sm">No users available</p>
                                ) : (
                                    <div className="space-y-2">
                                        {users.map((user) => (
                                            <label key={user.id} className="flex items-center space-x-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={participantIds.includes(user.id)}
                                                    onChange={() => toggleParticipant(user.id)}
                                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                />
                                                <span className="text-sm text-gray-700">
                                                    {user.name} ({user.email})
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Booking...
                                    </div>
                                ) : (
                                    'Book Room'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BookingForm;
