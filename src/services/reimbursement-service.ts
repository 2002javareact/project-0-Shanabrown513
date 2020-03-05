import { daoFindReimbursementByStatusId } from "../repositories/reimbursement-dao";
import { daoFindReimbursementById } from "../repositories/reimbursement-dao";
import {reimbursement } from "../models/reimbursement";
import {reimbursementDTO } from "../dtos/reimbursementDTO";
import { daoSaveOneReimbursement } from "../repositories/reimbursement-dao";
import { daoUpdateOneReimbursement } from "../repositories/reimbursement-dao";
// we seperated out the concern of finding the appropriate user from our controller
// this means in the future, when we rewrite this method, we shouldn't have to change the function that is calling it
// by seperating these concerns we are loosly coupling our code

//export async function findUserByUsernameAndPassword(username:string, password:string): Promise<users>{
   
   // keep track of number of login attempts for a username
   // check to see if 5 or more unseccessful in a row
   // time out logins for that user
 //  return await daoFindUserByUsernameAndPassword(username,password)
//}

/*
export async function findAllReimbursement():Promise<reimbursement[]>{
   // I write to a different table, who just sent this request
   // know what time of day, these requests get most sent
   return await daoFindAllReimbursement()
}
*/

 export async function saveOneReimbursement(newReimbursement:reimbursementDTO):Promise<reimbursement>{
    return await daoSaveOneReimbursement(newReimbursement)
 }
 
 export async function updateOneReimbursement(updateReimbursement:reimbursement):Promise<reimbursement>{
   return await daoUpdateOneReimbursement(updateReimbursement)
}

export async function findReimbursementByStatusId(stat:number):Promise<reimbursement[]>{
   return await daoFindReimbursementByStatusId(stat)
}

export async function findReimbursementById(id:number):Promise<reimbursement>{
    return await daoFindReimbursementById(id)
 }