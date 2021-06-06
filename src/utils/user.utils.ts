import { IUser } from "../dto";
import jwt_decode from "jwt-decode";

export const decodeUser = (token: string): (IUser | null) => {
    var decoded: IUser = jwt_decode(token);
    if (decoded)
        return decoded;

    return null
}