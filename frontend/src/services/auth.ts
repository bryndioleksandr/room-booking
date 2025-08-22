import api from "./axios";

export interface Response {
    user: {
        id: string;
        email: string;
        name: string;
    };
    accessToken: string;
    refreshToken: string;
    message: string;
}

export interface RegisterData {
    email: string;
    name: string;
    password: string;
}

export const registerUser = async (userData: RegisterData): Promise<Response["user"]> => {
    const {data} = await api.post<Response>("/auth/register", userData);
    return data.user;
};

export const loginUser = async (email: string, password: string): Promise<Response["user"]> => {
    try {
        const { data } = await api.post<Response>("/auth/login", {email, password});
        return data.user;
    } catch (error: any) {
        throw new Error(error.response?.data?.msg || "Щось пішло не так");
    }
};

export const logoutUser = async (): Promise<void> => {
    try {
        await api.get("/auth/logout");
        localStorage.clear();
    } catch (error) {
        console.error("Помилка при виході:", error);
    }
};
