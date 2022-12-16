import { Listener, NotFoundError, OrderStatus, PaymentCreatedEvent, QueueGroup, Subjects } from "@fajartickets/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent>{
    readonly subject = Subjects.PaymentCreated;
    readonly queueGroupName = QueueGroup.OrderService;

    async onMessage(data: PaymentCreatedEvent['data'], msg: Message){
        const order  = await Order.findById(data.orderId);
        if(!order){
            throw new NotFoundError("Order not found");
        }

        order.set({status: OrderStatus.Complete});
        await order.save();
        msg.ack();
    }
}