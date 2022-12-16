import { Listener, OrderCreatedEvent, Subjects } from "@fajartickets/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";


const queueName = "payments-service";

export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    readonly subject = Subjects.OrderCreated;
    readonly queueGroupName = queueName;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message){
        const order =  Order.build({
            userId: data.userId,
            version: data.version,
            price: data.ticket.price,
            status: data.status,
            id: data.id
        })
        await order.save();
        msg.ack();
    }
}