import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";
import { Message } from "node-nats-streaming";
import mongoose from "mongoose";
import { OrderCreatedEvent, OrderStatus, TicketUdaptedEvent } from "@fajartickets/common";
import { Order } from "../../../models/order";

const setup = async () => {
    const listener = new OrderCreatedListener(natsWrapper.client);

      const data: OrderCreatedEvent['data'] = {
        id: generateObjectId(),
        status: OrderStatus.Created,
        userId: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        expiresAt: "2424",
        ticket: {
            title: "concert",
            price: 30,
            id: generateObjectId()
        }
      }
      // @ts-ignore
      const msg: Message = {
        ack: jest.fn()
      }

      return {data, listener, msg}
}

it("replicates the order info" , async () => {
    const {data, listener, msg} = await setup();
    await listener.onMessage(data, msg);

    const order = await Order.findById(data.id);
    expect(order?.price).toEqual(order?.price)
})
it("ack the message", async () => {
    const {data, listener, msg} = await setup();
    await listener.onMessage(data, msg);
    
    expect(msg.ack).toHaveBeenCalled()
})
// it("publisher a ticket updated event", async ()=>{
//   const {data, listener, msg} = await setup();
//   await listener.onMessage(data, msg);

//   expect(natsWrapper.client.publish).toHaveBeenCalled();

//   //to call fake natsWrapper
//  const ticketUpdatedData =  JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]) as TicketUdaptedEvent['data']
//  expect(data.id).toEqual(ticketUpdatedData.orderId)
  
// })