import React, {useEffect, useState} from 'react';
import MeetingRoomList from './MeetingRoomList.tsx';
import { getBookings } from '../services/booking';
import { toast } from 'react-toastify';
import {listParticipants} from "../services";

interface Booking {
    id: number;
    roomId: number;
    createdBy: number;
    startTime: string;
    endTime: string;
    description: string;
    MeetingRoom?: {
        id: number;
        name: string;
    };
    creator?: {
        id: number;
        name: string;
        email: string;
    };
}

interface Participant {
    id: string;
    name: string;
    email: string;
}

const Dashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'rooms' | 'bookings'>('rooms');
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loadingBookings, setLoadingBookings] = useState(false);
    const [participantsByBooking, setParticipantsByBooking] = useState<Record<string, Participant[]>>({});

    useEffect(() => {
        const fetchAllParticipants = async () => {
            try {
                const results: Record<string, Participant[]> = {};

                // Використовуємо Promise.all, щоб паралельно отримати дані
                await Promise.all(
                    bookings.map(async (booking) => {
                        try {
                            const participants = await listParticipants(booking.id.toString());
                            results[booking.id] = participants;
                        } catch (error: unknown) {
                            const message = error instanceof Error ? error.message : undefined;
                            console.error(`Failed to fetch participants for booking ${booking.id}:`, error);
                            toast.error(
                                `Failed to fetch participants for booking ${booking.id}: ${message || "Unknown error"}`
                            );
                            results[booking.id] = [];
                        }
                    })
                );

                setParticipantsByBooking(results);
            } catch (error: unknown) {
                const message = error instanceof Error ? error.message : undefined;
                toast.error("Something went wrong while fetching participants: " + (message || "Unknown error"));
            }
        };

        if (bookings.length > 0) {
            fetchAllParticipants();
        }
    }, [bookings]);

    const fetchBookings = async () => {
        try {
            setLoadingBookings(true);
            const data = await getBookings();
            setBookings(data);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : undefined;
            toast.error('Failed to fetch bookings: ' + (message || 'Unknown error'));
        } finally {
            setLoadingBookings(false);
        }
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    const getUpcomingBookings = () => {
        const now = new Date();
        return bookings.filter(booking => new Date(booking.startTime) > now);
    };

    const getPastBookings = () => {
        const now = new Date();
        return bookings.filter(booking => new Date(booking.endTime) <= now);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
                    <p className="text-lg text-gray-600">Manage your meeting rooms and bookings</p>
                </div>

                <div className="flex justify-center mb-8">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1">
                        <button
                            onClick={() => setActiveTab('rooms')}
                            className={`px-6 py-2 rounded-md font-medium transition-colors ${
                                activeTab === 'rooms'
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            Meeting Rooms
                        </button>
                        <button
                            onClick={() => {
                                setActiveTab('bookings');
                                fetchBookings();
                            }}
                            className={`px-6 py-2 rounded-md font-medium transition-colors ${
                                activeTab === 'bookings'
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            Bookings
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md border border-gray-200">
                    {activeTab === 'rooms' ? (
                        <div className="p-6">
                            <MeetingRoomList />
                        </div>
                    ) : (
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Bookings</h2>
                                <button
                                    onClick={fetchBookings}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                    disabled={loadingBookings}
                                >
                                    {loadingBookings ? 'Refreshing...' : 'Refresh'}
                                </button>
                            </div>

                            {loadingBookings ? (
                                <div className="flex justify-center items-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Bookings</h3>
                                        {getUpcomingBookings().length === 0 ? (
                                            <p className="text-gray-500 text-center py-4">No upcoming bookings</p>
                                        ) : (
                                            <div className="grid gap-4">
                                                {getUpcomingBookings().map((booking) => {
                                                    const participants = participantsByBooking[booking.id];
                                                    return (
                                                        <div
                                                            key={booking.id}
                                                            className="bg-green-50 border border-green-200 rounded-lg p-4"
                                                        >
                                                            <div className="flex justify-between items-start">
                                                                <div>
                                                                    <h4 className="font-medium text-green-900">
                                                                        {booking.MeetingRoom?.name || `Room ${booking.roomId}`}
                                                                    </h4>
                                                                    <p className="text-green-700 text-sm mt-1">{booking.description}</p>

                                                                    {participants === undefined ? (
                                                                        <p className="text-green-700 text-sm mt-1">Loading participants...</p>
                                                                    ) : participants.length === 0 ? (
                                                                        <p className="text-green-700 text-sm mt-1">Users: none</p>
                                                                    ) : (
                                                                        <p className="text-green-700 text-sm mt-1">
                                                                            Users: {participants
                                                                                .map((p) => p.name)
                                                                                .join(", ")}
                                                                        </p>
                                                                    )}

                                                                    <div className="text-green-600 text-sm mt-2">
                                                                        <span className="font-medium">Start:</span> {formatDateTime(booking.startTime)}
                                                                    </div>
                                                                    <div className="text-green-600 text-sm">
                                                                        <span className="font-medium">End:</span> {formatDateTime(booking.endTime)}
                                                                    </div>
                                                                </div>
                                                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                                                    Upcoming
                                                                </span>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Past Bookings</h3>
                                        {getPastBookings().length === 0 ? (
                                            <p className="text-gray-500 text-center py-4">No past bookings</p>
                                        ) : (
                                            <div className="grid gap-4">
                                                {getPastBookings().map((booking) => {
                                                    const participants = participantsByBooking[booking.id];
                                                    return (
                                                        <div
                                                            key={booking.id}
                                                            className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                                                        >
                                                            <div className="flex justify-between items-start">
                                                                <div>
                                                                    <h4 className="font-medium text-gray-900">
                                                                        {booking.MeetingRoom?.name || `Room ${booking.roomId}`}
                                                                    </h4>
                                                                    <p className="text-gray-700 text-sm mt-1">{booking.description}</p>

                                                                    {participants === undefined ? (
                                                                        <p className="text-gray-600 text-sm mt-1">Loading participants...</p>
                                                                    ) : participants.length === 0 ? (
                                                                        <p className="text-gray-600 text-sm mt-1">Users: none</p>
                                                                    ) : (
                                                                        <p className="text-gray-600 text-sm mt-1">
                                                                            Users: {participants.map((p) => p.name).join(", ")}
                                                                        </p>
                                                                    )}

                                                                    <div className="text-gray-600 text-sm mt-2">
                                                                        <span className="font-medium">Start:</span> {formatDateTime(booking.startTime)}
                                                                    </div>
                                                                    <div className="text-gray-600 text-sm">
                                                                        <span className="font-medium">End:</span> {formatDateTime(booking.endTime)}
                                                                    </div>
                                                                </div>
                                                                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                                                                    Completed
                                                                </span>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
