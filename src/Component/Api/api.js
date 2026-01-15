import axios from "axios";
import { url } from "../../Baseurl";
export const api = axios.create({
    baseURL: `${url}/api`, // change to your server IP
});

// Attach token automatically
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("U_Token");
        console.log(token)
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (err) => Promise.reject(err)
);
