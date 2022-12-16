import express, {Response, Request} from 'express';
const router = express.Router();
import {body} from 'express-validator';
import {BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest} from "@fajartickets/common";
import mongoose from 'mongoose';
import {Order} from "../models/order";
import {Ticket} from "../models/ticket";
import { natsWrapper } from '../nats-wrapper';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';

const EXPIRATION_WINDOW_SECONDS = 15 * 60;
 
router.post("/api/orders", requireAuth, [
    body("ticketId")
    .not()
    .isEmpty()
    .custom((input) => mongoose.Types.ObjectId.isValid(input))
    .withMessage("TicketId must be provided")
], validateRequest, async (req: Request, res: Response)=>{
    const {ticketId} = req.body;

    //find the ticket the user is trying to order in the database
    const ticket  = await Ticket.findById(ticketId);
    if(!ticket){
        throw new NotFoundError("Ticket not found");
    }
    //make sure that ticket is not already reserved
     const isReserved = await ticket.isReserved();
    if(isReserved){
        throw new BadRequestError("Ticket is already reserved");
    }
    //caculate an expiration date for this order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS) //expires 15m
    //build the order and save it to the database
    const order =  Order.build({
        userId: req.currentUser!.id,
        expiresAt: expiration,
        status: OrderStatus.Created,
        ticket: ticket
    })
    await order.save();
    //event to create order
    
    new OrderCreatedPublisher(natsWrapper.client).publish({
        id: order.id,
        userId: order.userId,
        status: order.status,
        expiresAt: order.expiresAt.toISOString(),
        version: order.version,
        ticket: {
            id: ticket.id,
            price: ticket.price,
            title: ticket.title
        }
    })
    res.status(201).send(order)
})


export {router as newOrderRouter}