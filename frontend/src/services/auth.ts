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
    } catch (error: unknown) {
        const message =
            typeof error === "object" && error !== null && "response" in error
                ? (error as { response?: { data?: { msg?: string } } }).response?.data?.msg
                : undefined;
        throw new Error(message || "Щось пішло не так");
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
