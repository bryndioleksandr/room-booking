import api from "./axios";

export interface AddUserToRoomData {
    roomId: number;
    userId: number;
}

export interface SetUserRoleData {
    roomId: number;
    userId: number;
    role: 'Admin' | 'User';
}

export const addUserToRoom = async (userData: AddUserToRoomData) => {
    const { data } = await api.post("/rooms/users/add", userData);
    return data;
}

export const removeUserFromRoom = async (userData: AddUserToRoomData) => {
    const { data } = await api.post("/rooms/users/remove", userData);
    return data;
}

export const listRoomUsers = async (roomId: string) => {
    const { data } = await api.get(`/rooms/${roomId}/users`);
    return data;
}

export const setUserRole = async (roleData: SetUserRoleData) => {
    const { data } = await api.post("/rooms/users/role", roleData);
    return data;
}
