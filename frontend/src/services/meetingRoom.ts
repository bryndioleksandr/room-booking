import api from "./axios";

export const createMeetingRoom = async (name:string, description:string) => {
    const { data } = await api.post("/rooms", {name, description});
    return data;
}

export const getMeetingRooms = async () => {
    const { data } = await api.get("/rooms");
    return data;
}

export const getMeetingRoom = async (roomId: string) => {
    const { data } = await api.get(`/rooms/${roomId}`);
    return data;
}

export const updateMeetingRoom = async (roomId: string, name: string, description: string) => {
    const { data } = await api.put(`/rooms/${roomId}`, { name, description });
    return data;
}

export const deleteMeetingRoom = async (roomId: string) => {
    const { data } = await api.delete(`/rooms/${roomId}`);
    return data;
}
