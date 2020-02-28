import { daoFindUserByUsernameAndPassword, daoFindAllUsers, daoSaveOneUser, daoFindUserById } from "../repositories/user-dao";
import { users } from "../models/users";
import { UserDTO } from "../dtos/userDTO";

// we seperated out the concern of finding the appropriate user from our controller
// this means in the future, when we rewrite this method, we shouldn't have to change the function that is calling it
// by seperating these concerns we are loosly coupling our code
export async function findUserByUsernameAndPassword(username:string, password:string): Promise<users>{
   
   // keep track of number of login attempts for a username
   // check to see if 5 or more unseccessful in a row
   // time out logins for that user
   return await daoFindUserByUsernameAndPassword(username,password)
}


export async function findAllUsers():Promise<users[]>{
   // I write to a different table, who just sent this request
   // know what time of day, these requests get most sent
   return await daoFindAllUsers()
}


export async function saveOneUser(newUser:UserDTO):Promise<users>{
   return await daoSaveOneUser(newUser)
}



export async function findUserById(id:number):Promise<users>{
   return await daoFindUserById(id)
}