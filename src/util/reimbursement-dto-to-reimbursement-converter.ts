import { reimbursementDTO } from "../dtos/reimbursementDTO";
import { reimbursement } from "../models/reimbursement";


export function reimbursementDTOToReimbursementConverter(reimbursementDTO:reimbursementDTO):reimbursement{
    return new reimbursement(
        reimbursementDTO.reimbursement_id,
        reimbursementDTO.author,
        reimbursementDTO.amount,
        reimbursementDTO.date_submitted,
        reimbursementDTO.date_resolved,
        reimbursementDTO.description,
        reimbursementDTO.resolver,
        reimbursementDTO.status,
        reimbursementDTO.type 
    )
}
