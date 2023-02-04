import Model from "models/Model";
import UserRole from "./UserRole";

export default class User extends Model {
    id: string
    role: UserRole
    iat: number
    exp: number
}