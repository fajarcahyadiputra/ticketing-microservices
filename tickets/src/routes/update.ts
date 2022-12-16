import { BadRequestError, NotAuthorizedError, NotFoundError, requireAuth, validateRequest } from '@fajartickets/common';
import express, {Response, Request} from 'express';
import { Ticket } from '../models/ticket';
import { body } from 'express-validator';
import { TicketUdatedPublisher } from '../events/publisher/ticket-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

const route = express.Router();

route.put("/api/tickets/:id",requireAuth, [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price").not().isEmpty().withMessage("Price is required").isFloat({gt: 0}).withMessage("Price must be grater than 0"),
], validateRequest, async (req:Request, res:Response)=>{
    const {id} = req.params;
    const dataBody = req.body;
    const ticket = await Ticket.findById(id);
    if(!ticket){
        throw new NotFoundError()
    }
    if(ticket.orderId){
        throw new BadRequestError("Canot edit a reserved ticket")
    }
    if(ticket.userId !== req.currentUser!.id){
        throw new NotAuthorizedError();
    }
    ticket.set(dataBody)
    await ticket.save();
    await new TicketUdatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
        version: ticket.version
    })
    res.json(ticket);
})

export {route as updateTicket}