import api from "./axios";

export interface CreateBookingData {
    roomId: number;
    createdBy: number;
    startTime: string | Date;
    endTime: string | Date;
    description?: string;
    participantIds?: number[];
}

export interface UpdateBookingData {
    startTime?: string | Date;
    endTime?: string | Date;
    description?: string;
}

export const createBooking = async (bookingData: CreateBookingData) => {
    const { data } = await api.post("/bookings", bookingData);
    return data;
}

export const getBookings = async () => {
    const { data } = await api.get("/bookings");
    return data;
}

export const getBooking = async (bookingId: string) => {
    const { data } = await api.get(`/bookings/${bookingId}`);
    return data;
}

export const updateBooking = async (bookingId: string, updateData: UpdateBookingData) => {
    const { data } = await api.put(`/bookings/${bookingId}`, updateData);
    return data;
}

export const deleteBooking = async (bookingId: string) => {
    const { data } = await api.delete(`/bookings/${bookingId}`);
    return data;
}
