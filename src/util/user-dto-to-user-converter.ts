import { UserDTO } from "../dtos/userDTO";
import { users } from "../models/users";


export function userDTOToUserConverter(userDTO:UserDTO):users{
    return new users(
        userDTO.user_id,
        userDTO.username,
        userDTO.password,
        userDTO.first_name,
        userDTO.last_name,
        userDTO.email,
        userDTO.role
    )
}