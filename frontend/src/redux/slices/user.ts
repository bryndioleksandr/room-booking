import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface User {
    id: string;
    name: string;
    email: string;
}

interface UserState {
    user: User | null;
}

const initialState: UserState = {
    user: typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("user") || "null")
        : null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        dispUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
            if (typeof window !== "undefined") {
                localStorage.setItem("user", JSON.stringify(action.payload));
            }
        },
        logout: (state) => {
            state.user = null;
            if (typeof window !== "undefined") {
                localStorage.removeItem("user");
            }
        },
    },
});

export default userSlice.reducer;
export const { dispUser, logout } = userSlice.actions;
