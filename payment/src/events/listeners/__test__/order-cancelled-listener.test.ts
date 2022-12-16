import { OrderCancelledEvent, OrderStatus } from "@fajartickets/common";
import { Order } from "../../../models/order";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledListener } from "../order-cancelled-listener";

const setup = async () => {
    //create listener
    const listener = new OrderCancelledListener(natsWrapper.client);
    //crearte and update a ticket
    const order = Order.build({
        id: generateObjectId(),
        status: OrderStatus.Created,
        userId: generateObjectId(),
        price: 10,
        version: 0
    })
    await order.save();
    const data: OrderCancelledEvent['data'] = {
        id: order.id,
        ticket: {
            id: generateObjectId()
        },
        version: 1
    }
    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return {listener, data, msg, order}
}

it("updates status of the order" ,async()=> {
    const {data, msg, listener, order} = await setup();

    await listener.onMessage(data, msg);
    const updatedTicket = await Order.findById(order.id);
    expect(updatedTicket?.status).toEqual(OrderStatus.Cancelled)

})
it("ack the messagel", async() => {
    const {data, msg, listener} = await setup();

    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
})
