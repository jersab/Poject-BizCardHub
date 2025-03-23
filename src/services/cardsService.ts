import axios from "axios";
import { Card } from "../interfaces/cards/Cards";

const API: string = import.meta.env.VITE_CARDS_API;

export function getAllCards() {
  return axios.get(API);
}

export function getCardById(cardId: string) {
  return axios.get(`${API}/${cardId}`);
}

export function getMyCards() {
  return axios.get(`${API}/my-cards`, {
    headers: {
      "x-auth-token": sessionStorage.getItem("token"),
    },
  });
}

export function postNewCard(normalizedCard: Card) {
  return axios.post(API, normalizedCard, {
    headers: {
      "x-auth-token": sessionStorage.getItem("token"),
    },
  });
}

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