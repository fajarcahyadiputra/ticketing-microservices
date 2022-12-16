import { natsWrapper } from "../../nats-wrapper";
import { OrderCreatedEvent, Listener, OrderStatus, Subjects, QueueGroup, NotFoundError } from "@fajartickets/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { TicketUdatedPublisher } from "../publisher/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
    readonly queueGroupName = QueueGroup.OrderService;

   async onMessage(data: OrderCreatedEvent['data'], msg: Message){
    const {id} = data;
    const ticket = await Ticket.findById(data.ticket.id);
    if(!ticket){
        throw new NotFoundError("Ticket not found")
    }
    ticket.set({orderId: id});
    await ticket.save();

    //if created new ticket from service order and will updated ticker in listener who connect to publisher updatedTicket

    await new TicketUdatedPublisher(this.client).publish({
        id: ticket.id,
        price: ticket.price,
        title: ticket.title,
        userId: ticket.userId,
        version: ticket.version,
        orderId: ticket.orderId
    })
    msg.ack();
    }
}