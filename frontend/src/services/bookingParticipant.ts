import api from "./axios";

export interface AddParticipantData {
    bookingId: number;
    userId: number;
}

export const addParticipant = async (participantData: AddParticipantData) => {
    const { data } = await api.post("/booking-participants", participantData);
    return data;
}

export const removeParticipant = async (participantData: AddParticipantData) => {
    const { data } = await api.delete("/booking-participants", { data: participantData });
    return data;
}

export const listParticipants = async (bookingId: string) => {
    const { data } = await api.get(`/booking-participants/${bookingId}/participants`);
    return data;
}
