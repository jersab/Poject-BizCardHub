import axios from "axios";
import { Card } from "../interfaces/cards/Cards";

const API: string = import.meta.env.VITE_CARDS_API;

// קבלת כל הכרטיסים (ציבורי)
export function getAllCards() {
  return axios.get(API);
}

// קבלת כרטיס לפי מזהה (ציבורי)
export function getCardById(cardId: string) {
  return axios.get(`${API}/${cardId}`);
}

// קבלת הכרטיסים של המשתמש המחובר
export function getMyCards() {
  return axios.get(`${API}/my-cards`, {
    headers: {
      "x-auth-token": sessionStorage.getItem("token"),
    },
  });
}

// יצירת כרטיס חדש (רק משתמש עסקי)
export function postNewCard(normalizedCard: Card) {
  return axios.post(API, normalizedCard, {
    headers: {
      "x-auth-token": sessionStorage.getItem("token"),
    },
  });
}

// עדכון כרטיס קיים (רק יוצר הכרטיס או אדמין)
export function updateCard(cardId: string, normalizedCard: Card) {
  return axios.put(
    `${API}/${cardId}`,
    normalizedCard,
    {
      headers: {
        "x-auth-token": sessionStorage.getItem("token"),
      },
    }
  );
}

// מחיקת כרטיס (רק יוצר הכרטיס או אדמין)
export function deleteCard(cardId: string) {
  return axios.delete(
    `${API}/${cardId}`,
    {
      headers: {
        "x-auth-token": sessionStorage.getItem("token"),
      },
    }
  );
}

// הוספה/הסרה של כרטיס למועדפים
export function likeCard(cardId: string) {
  return axios.patch(
    `${API}/${cardId}`,
    {},
    {
      headers: {
        "x-auth-token": sessionStorage.getItem("token"),
      },
    }
  );
}