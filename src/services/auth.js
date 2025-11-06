import { API_URL } from "@/constants/api";
import axios from "axios";
export const login = async (username, pin) => {
    const response = await axios.get(API_URL, { username, pin  });
    return response.data;
}

export const register = async (registerObject) => {
    try {
        const response = await axios.get(API_URL)
        if (response.data.find(user => user.user_name === registerObject.user_name)) {
            console.log("Username already exists:", registerObject.user_name);
            throw new Error("Username already exists");
        }
        const registerData = await axios.post(API_URL, registerObject);
        return registerData.data;
    } catch (error) {
        console.error("Registration error:", error);
        throw error;
    }
}