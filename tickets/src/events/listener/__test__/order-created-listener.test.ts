import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import mongoose from "mongoose";
import { OrderCreatedEvent, OrderStatus, TicketUdaptedEvent } from "@fajartickets/common";

const setup = async () => {
    const listener = new OrderCreatedListener(natsWrapper.client);

    const ticket =  Ticket.build({
        price: 55,
        title: "concert",
        userId: new mongoose.Types.ObjectId().toHexString()
      });
      await ticket.save();
      const data: OrderCreatedEvent['data'] = {
        id: generateObjectId(),
        status: OrderStatus.Created,
        userId: new mongoose.Types.ObjectId().toHexString(),
        version: 1,
        expiresAt: "2424",
        ticket: {
            title: ticket.title,
            price: ticket.price,
            id: ticket.id
        }
      }
      // @ts-ignore
      const msg: Message = {
        ack: jest.fn()
      }

      return {data, ticket, listener, msg}
}

it("sets the userId of the ticket" , async () => {
    const {data, listener, msg, ticket} = await setup();
    await listener.onMessage(data, msg);
    const updateTicket = await Ticket.findById(ticket.id);
    expect(updateTicket?.orderId).toEqual(data.id)
})
it("ack the message", async () => {
    const {data, listener, msg, ticket} = await setup();
    await listener.onMessage(data, msg);
    
    expect(msg.ack).toHaveBeenCalled()
})
it("publisher a ticket updated event", async ()=>{
  const {data, listener, msg, ticket} = await setup();
  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  //to call fake natsWrapper
 const ticketUpdatedData =  JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]) as TicketUdaptedEvent['data']
 expect(data.id).toEqual(ticketUpdatedData.orderId)
  
})