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

export function getAllUsers() {
    return axios.get(API, {
      headers: {
        "x-auth-token": sessionStorage.getItem("token"),
      },
    });
}

// פונקציה חדשה לעדכון פרטי משתמש
export function updateUser(userId: string, userData: Partial<User>) {
  return axios.put(
    `${API}/${userId}`,
    userData,
    {
      headers: {
        "x-auth-token": sessionStorage.getItem("token"),
      },
    }
  );
}

export function updateUserStatus(userId: string) {
  return axios.patch(
    `${API}/${userId}`, 
    {}, // גוף בקשה ריק
    {
      headers: {
        "x-auth-token": sessionStorage.getItem("token"),
      },
    }
  );
}

export function deleteUser(userId: string) {
  return axios.delete(
    `${API}/${userId}`, 
    {
      headers: {
        "x-auth-token": sessionStorage.getItem("token"),
      },
    }
  );
}