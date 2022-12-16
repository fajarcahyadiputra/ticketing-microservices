import { NotFoundError } from '@fajartickets/common';
import express, {Response, Request} from 'express';
import { Ticket } from '../models/ticket';

const route = express.Router();

route.get("/api/tickets/:id", async (req:Request, res:Response)=>{
    const {id} = req.params;
    const ticket = await Ticket.findById(id);
    if(!ticket){
        throw new NotFoundError()
    }
    res.json(ticket);
})

export {route as showTicketRoute}