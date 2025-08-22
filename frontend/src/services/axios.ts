import axios from "axios";
import { backUrl } from "../config/config";

const api = axios.create({
    baseURL: backUrl,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;
