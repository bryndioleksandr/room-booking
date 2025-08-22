import api from "./axios";

export interface User {
    id: number;
    name: string;
    email: string;
}

export interface CreateUserData {
    name: string;
    email: string;
    password: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export const getUsers = async () => {
    const { data } = await api.get("/auth/all");
    return data;
}

export const getUser = async (userId: string) => {
    const { data } = await api.get(`/users/${userId}`);
    return data;
}

export const updateUser = async (userId: string, updateData: Partial<User>) => {
    const { data } = await api.put(`/users/${userId}`, updateData);
    return data;
}

export const deleteUser = async (userId: string) => {
    const { data } = await api.delete(`/users/${userId}`);
    return data;
}
