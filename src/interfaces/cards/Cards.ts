import { Address } from "./Address";
import { Image } from "./Image";

export interface Card {
    createdAt: number;
    _id?: string;
    title: string;
    subtitle: string;
    description: string;
    phone: string;
    email: string;
    wed?: string;
    image: Image;
    address: Address;
    bizNumber?: number;
    likes?: string[];
    user_id?: string;   
}