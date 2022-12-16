import { OrderCancelledEvent } from "@fajartickets/common";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledListener } from "../order-cancelled-listener";

const setup = async () => {
    //create listener
    const listener = new OrderCancelledListener(natsWrapper.client);
    //crearte and update a ticket
    const orderId = generateObjectId();
    const ticket = await Ticket.build({
        price: 77,
        title: "concert",
        userId: generateObjectId()
    });
    ticket.set({orderId })
    await ticket.save();
    const data: OrderCancelledEvent['data'] = {
        id: orderId,
        ticket: {
            id: ticket.id
        },
        version: 0
    }
    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return {listener, data, msg, ticket}
}

it("updates the ticket " ,async()=> {
    const {data, ticket, msg, listener} = await setup();

    await listener.onMessage(data, msg);
    const updatedTicket = await Ticket.findById(ticket.id)
    expect(updatedTicket?.orderId).not.toBeDefined();

})
it("ack the messagel", async() => {
    const {data, ticket, msg, listener} = await setup();

    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
})
it("publisher a ticket update event", async() => {
    const {data, ticket, msg, listener} = await setup();

    await listener.onMessage(data, msg);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
})