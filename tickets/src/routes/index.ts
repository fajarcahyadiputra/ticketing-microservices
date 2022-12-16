import { NotFoundError } from '@fajartickets/common';
import express, {Response, Request} from 'express';
import { Ticket } from '../models/ticket';

const route = express.Router();

route.get("/api/tickets", async (req:Request, res:Response)=>{
    const tickets = await Ticket.find({orderId: undefined});
    res.json(tickets);
})

export {route as indexRoute}