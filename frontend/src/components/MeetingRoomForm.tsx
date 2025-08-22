import React, { useState, useEffect } from 'react';
import { createMeetingRoom, updateMeetingRoom } from '../services/meetingRoom';
import { toast } from 'react-toastify';

interface MeetingRoom {
    id: number;
    name: string;
    description: string;
}

interface MeetingRoomFormProps {
    room?: MeetingRoom | null;
    onClose: () => void;
    onSuccess: () => void;
}

const MeetingRoomForm: React.FC<MeetingRoomFormProps> = ({ room, onClose, onSuccess }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ name?: string; description?: string }>({});

    const isEditing = !!room;

    useEffect(() => {
        if (room) {
            setName(room.name);
            setDescription(room.description);
        }
    }, [room]);

    const validateForm = () => {
        const newErrors: { name?: string; description?: string } = {};

        if (!name.trim()) {
            newErrors.name = 'Room name is required';
        } else if (name.trim().length < 2) {
            newErrors.name = 'Room name must be at least 2 characters';
        }

        if (!description.trim()) {
            newErrors.description = 'Room description is required';
        } else if (description.trim().length < 10) {
            newErrors.description = 'Room description must be at least 10 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setLoading(true);
        try {
            if (isEditing && room) {
                await updateMeetingRoom(room.id.toString(), name, description);
                toast.success('Meeting room updated successfully');
            } else {
                await createMeetingRoom(name, description);
                toast.success('Meeting room created successfully');
            }
            onSuccess();
        } catch (error: any) {
            toast.error(`Failed to ${isEditing ? 'update' : 'create'} meeting room: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">
                            {isEditing ? 'Edit Meeting Room' : 'Add New Meeting Room'}
                        </h3>
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
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Room Name *
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                    errors.name ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter room name"
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                Description *
                            </label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                    errors.description ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter room description"
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                            )}
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
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        {isEditing ? 'Updating...' : 'Creating...'}
                                    </div>
                                ) : (
                                    isEditing ? 'Update Room' : 'Create Room'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default MeetingRoomForm;
