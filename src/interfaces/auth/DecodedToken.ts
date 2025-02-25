export interface DecodedToken {
    _id: string;
    email: string;
    isBusiness: boolean;
    isAdmin: boolean;
    iat: number;
    exp: number;
}