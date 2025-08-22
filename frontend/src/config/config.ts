export const backUrl = 'http://localhost:5501';

export interface User {
    id: string;
    name: string;
    email: string;
}

export const setUser = (user: User): void => {
    localStorage.setItem("user", JSON.stringify(user));
};

export const getUser = (): User | null => {
    const data = localStorage.getItem("user");
    return data ? JSON.parse(data) as User : null;
};
