import { jwtDecode } from "jwt-decode";
import { DecodedToken } from "../interfaces/auth/DecodedToken";

export function decodeToken(token: string): DecodedToken {
  return jwtDecode(token) as DecodedToken;
}