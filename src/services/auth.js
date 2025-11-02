import { API_URL } from "@/constants/api";
import axios from "axios";
export const login = async (username, pin) => {
    const response = await axios.post(API_URL, { username, pin });
    return response.data;
}