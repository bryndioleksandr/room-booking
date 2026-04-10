import React, { useState, useEffect } from 'react';
import { getMeetingRooms, deleteMeetingRoom } from '../services/meetingRoom';
import { toast } from 'react-toastify';
import MeetingRoomForm from "./MeetingRoomForm.tsx";
import BookingForm from "./BookingForm.tsx";
import Modal from "./ui/Modal";

interface MeetingRoom {
    id: number;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

const MeetingRoomList: React.FC = () => {
    const [meetingRooms, setMeetingRooms] = useState<MeetingRoom[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRoom, setSelectedRoom] = useState<MeetingRoom | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<"createdDesc" | "createdAsc" | "nameAsc">("createdDesc");

    useEffect(() => {
        fetchMeetingRooms();
    }, []);

    const fetchMeetingRooms = async () => {
        try {
            setLoading(true);
            const data = await getMeetingRooms();
            setMeetingRooms(data);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : undefined;
            toast.error('Failed to fetch meeting rooms: ' + (message || 'Unknown error'));
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedRoom) return;

        try {
            await deleteMeetingRoom(selectedRoom.id.toString());
            toast.success('Meeting room deleted successfully');
            setShowDeleteModal(false);
            setSelectedRoom(null);
            fetchMeetingRooms();
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : undefined;
            toast.error('Failed to delete meeting room: ' + (message || 'Unknown error'));
        }
    };

    const openDeleteModal = (room: MeetingRoom) => {
        setSelectedRoom(room);
        setShowDeleteModal(true);
    };

    const openEditModal = (room: MeetingRoom) => {
        setSelectedRoom(room);
        setShowEditModal(true);
    };

    const openBookingModal = (room: MeetingRoom) => {
        setSelectedRoom(room);
        setShowBookingModal(true);
    };

    const filteredRooms = meetingRooms
        .filter((room) => {
            const q = searchQuery.trim().toLowerCase();
            if (!q) return true;
            return room.name.toLowerCase().includes(q) || room.description.toLowerCase().includes(q);
        })
        .slice()
        .sort((a, b) => {
            if (sortBy === "nameAsc") return a.name.localeCompare(b.name);
            const aTime = new Date(a.createdAt).getTime();
            const bTime = new Date(b.createdAt).getTime();
            return sortBy === "createdAsc" ? aTime - bTime : bTime - aTime;
        });

    if (loading) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Meeting Rooms</h2>
                        <p className="text-sm text-gray-600 mt-1">Search, edit, and book available rooms</p>
                    </div>
                    <button
                        onClick={() => setShowEditModal(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Add New Room
                    </button>
                </div>

                <div className="flex flex-col md:flex-row md:items-center md:gap-3 gap-2">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by name or description..."
                        className="w-full md:flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    />
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                        className="px-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    >
                        <option value="createdDesc">Newest</option>
                        <option value="createdAsc">Oldest</option>
                        <option value="nameAsc">Name (A-Z)</option>
                    </select>
                    <div className="text-sm text-gray-600">
                        {filteredRooms.length} {filteredRooms.length === 1 ? "room" : "rooms"}
                    </div>
                </div>
            </div>

            {meetingRooms.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No meeting rooms found</p>
                    <p className="text-gray-400">Create your first meeting room to get started</p>
                </div>
            ) : filteredRooms.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-gray-500 text-lg">No rooms match your search</p>
                    <p className="text-gray-400 mt-1">Try a different keyword or clear the filters.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRooms.map((room) => (
                        <div
                            key={room.id}
                            className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-semibold text-gray-900">{room.name}</h3>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => openEditModal(room)}
                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => openDeleteModal(room)}
                                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>

                            <p className="text-gray-600 mb-4 line-clamp-2">{room.description}</p>

                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-400">
                                    Created: {new Date(room.createdAt).toLocaleDateString()}
                                </span>
                                <button
                                    onClick={() => openBookingModal(room)}
                                    className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 transition-colors"
                                >
                                    Book Room
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showDeleteModal && selectedRoom && (
                <Modal
                    title="Delete Meeting Room"
                    onClose={() => setShowDeleteModal(false)}
                    className="max-w-md"
                >
                    <p className="text-gray-600">
                        Are you sure you want to delete "{selectedRoom.name}"? This action cannot be undone.
                    </p>

                    <div className="flex space-x-3 pt-4">
                        <button
                            onClick={() => setShowDeleteModal(false)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDelete}
                            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                        >
                            Delete
                        </button>
                    </div>
                </Modal>
            )}

            {showEditModal && (
                <MeetingRoomForm
                    room={selectedRoom}
                    onClose={() => {
                        setShowEditModal(false);
                        setSelectedRoom(null);
                    }}
                    onSuccess={() => {
                        setShowEditModal(false);
                        setSelectedRoom(null);
                        fetchMeetingRooms();
                    }}
                />
            )}

            {showBookingModal && selectedRoom && (
                <BookingForm
                    room={selectedRoom}
                    onClose={() => {
                        setShowBookingModal(false);
                        setSelectedRoom(null);
                    }}
                    onSuccess={() => {
                        setShowBookingModal(false);
                        setSelectedRoom(null);
                        toast.success('Room booked successfully!');
                    }}
                />
            )}
        </div>
    );
};

export default MeetingRoomList;
