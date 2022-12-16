import { OrderCancelledEvent, Listener, Subjects, QueueGroup, NotFoundError } from "@fajartickets/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { TicketUdatedPublisher } from "../publisher/ticket-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    readonly subject = Subjects.orderCancelled;
     queueGroupName = QueueGroup.OrderService;

    async onMessage(data: OrderCancelledEvent['data'], msg: Message){
        const {id,version} = data;

        const ticket = await Ticket.findById(data.ticket.id)
        if(!ticket){
            throw new NotFoundError("Ticket not found");
        }

        ticket.set({orderId: undefined})
        await ticket.save();

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
