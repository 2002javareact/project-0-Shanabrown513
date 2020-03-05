import { PoolClient } from "pg";
import { connectionPool } from ".";
import { reimbursement } from "../models/reimbursement";
import { UnauthorizedError} from '../errors/UnauthorizedError'
import { InternalServerError } from "../errors/InternalServerError";
import { reimbursementDTOToReimbursementConverter } from '../util/reimbursement-dto-to-reimbursement-converter';
import { reimbursementDTO } from "../dtos/reimbursementDTO";
import { reimbursementNotFoundError } from "../errors/reimbursementNotFoundError"; 


// function that saves a new reimbursement and returns that reimbursement with its new id
export async function daoUpdateOneReimbursement(updateReimbursement:reimbursementDTO):Promise<reimbursement> {
    let client:PoolClient
    try { 
        client = await connectionPool.connect()
        //let reimbursementId = updateReimbursement.reimbursementId;
        //let oldReimbursement = (await client.query('Select * from "project_0".reimbursement where reimbursement.reimbursement_id = $1', [reimbursementId])).rows[0];

        //console.log(oldReimbursement);

        //oldReimbursement.author = updateReimbursement.author || oldReimbursement.author;
        //oldReimbursement.amount = updateReimbursement.amount || oldReimbursement.amount;
        //oldReimbursement.dateSubmitted = updateReimbursement.dateSubmitted || oldReimbursement.dateSubmitted;
        //oldReimbursement.dateResolved = updateReimbursement.dateResolved || oldReimbursement.dateResolved;
        //oldReimbursement.description = updateReimbursement.description || oldReimbursement.description;
        //oldReimbursement.resolver = updateReimbursement.resolver || oldReimbursement.resolver;
        //oldReimbursement.status = updateReimbursement.status || oldReimbursement.status;
        //oldReimbursement.type = updateReimbursement.type || oldReimbursement.type;

        //console.log(oldReimbursement);
        

        // send a query and immeadiately get the role id matching the name on the dto
        //let roleId = (await client.query('SELECT * FROM "project_0"."roles" WHERE role_name = $1', [updateReimbursement.role])).rows[0].role_id
        // send an insert that uses the id above and the Reimbursement input
         let result = await client.query('UPDATE "project_0"."reimbursement" Set author = $1, amount = $2, date_submitted = $3, date_resolved = $4, description = $5, resolver = $6, status = $7, type = $8 where reimbursement_id = $9',
        [updateReimbursement.author, updateReimbursement.amount, updateReimbursement.date_submitted, updateReimbursement.date_resolved, updateReimbursement.description, updateReimbursement.resolver, updateReimbursement.status, updateReimbursement.type, updateReimbursement.reimbursement_id]);
        // put that newly genertaed Reimbursement_id on the DTO 
        //updateReimbursement.Reimbursement_id = result.rows[0].Reimbursement_id
        return reimbursementDTOToReimbursementConverter(updateReimbursement)
        //reimbursementDTOToReimbursementConverter(updateReimbursement)// convert and send back
    } catch(e){
        console.log(e);
        throw new InternalServerError()
    } finally {
        client && client.release()
    }
}

export async function daoSaveOneReimbursement(newReimbursement:reimbursementDTO):Promise<reimbursement> {
    let client:PoolClient
    try { 
        client = await connectionPool.connect()
        // send a query and immeadiately get the role id matching the name on the dto
        //let reimbursementId = (await client.query('SELECT * FROM "project_0"."reimbursement" WHERE reimbursement_id = $1', [newReimbursement.reimbursement_id])).rows[0].reimbursement_id
        // send an insert that uses the id above and the reimbursement input
        let result = await client.query('INSERT INTO "project_0"."reimbursement" (author, amount, date_submitted, date_resolved, description, resolver, status, type) values ($1,$2,$3,$4,$5,$6,$7,$8) returning reimbursement_id;',
        [newReimbursement.author, newReimbursement.amount, newReimbursement.date_submitted, newReimbursement.date_resolved, newReimbursement.description, newReimbursement.resolver, newReimbursement.status, newReimbursement.type])
        // put that newly genertaed reimbursement_id on the DTO 
        //newReimbursement.reimbursement_id = result.rows[0].reimbursement_id
        newReimbursement.reimbursement_id = result.rows[0].reimbursement_id;

        return reimbursementDTOToReimbursementConverter(newReimbursement)// convert and send back
    } catch(e){
        console.log(e);
        
        throw new InternalServerError()
    } finally {
        client && client.release()
    }
}


export async function daoFindReimbursementById(id:number):Promise<reimbursement>{
    let client:PoolClient
    try{
        client = await connectionPool.connect()
        let result = await client.query('select * from project_0.reimbursement where reimbursement.author = $1', [id])
        if(result.rowCount === 0){
            throw new Error('reimbursement Not Found')
        }
        return reimbursementDTOToReimbursementConverter(result.rows[0])

    }catch(e){
        // id DNE
        //need if for thatdx'
        if(e.message === 'reimbursement Not Found'){
            throw new reimbursementNotFoundError()
        } console.log(e);
        throw new InternalServerError()
    } finally {
        client && client.release()
    }
}


export async function daoFindReimbursementByStatusId(stat:number):Promise<reimbursement[]>{
    let client:PoolClient
    try{
        client = await connectionPool.connect()
        let result = await client.query('select * from project_0.reimbursement where reimbursement.status = $1', [stat])
        if(result.rowCount === 0){
            throw new Error('reimbursement Not Found')
        }
        return result.rows.map(reimbursementDTOToReimbursementConverter)

    }catch(e){
        // id DNE
        //need if for thatdx
        if(e.message ==='reimbursement Not Found'){
            throw new reimbursementNotFoundError()
        }
        throw new InternalServerError()
    } finally {
        client && client.release()
    }
}
