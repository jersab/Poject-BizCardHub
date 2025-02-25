import axios from "axios";
import { User } from "../interfaces/users/User";

const API: string = import.meta.env.VITE_USERS_API;


export function registerUser(normalizedUser: User) {
    return axios.post(API, normalizedUser);
}


export function loginUser(user: any) {
    return axios.post(`${API}/login`, user);
}

export function getUserById(id: string){
    return axios.get(`${API}/${id}`, {
        headers: {
            "x-auth-token": sessionStorage.getItem("token"),
        },        
    });
}