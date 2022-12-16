import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';
import mongoose from 'mongoose';

const endpoint = "/api/orders";

it("marks an order as cancelled", async() => {
    const user =  signin();
    //create ticket
    const ticket = await Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        price:20,
        title: "concert"
    }).save();
    //create order
    const {body: order} = await request(app)
    .post(endpoint)
    .set("Cookie", user)
    .send({ticketId: ticket.id})
    .expect(201);
    //cancle order
     await request(app)
    .delete(endpoint + `/${order.id}`)
    .set("Cookie", user)
    .expect(204);

    const response = await request(app)
    .get(endpoint+ `/${order.id}`)
    .set("Cookie", user)
    .expect(200);

    expect(response.body.status).toEqual(OrderStatus.Cancelled)
})

it("emit a order cancelled event", async() => {
    const user =  signin();
    //create ticket
    const ticket = await Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        price:20,
        title: "concert"
    }).save();
    //create order
    const {body: order} = await request(app)
    .post(endpoint)
    .set("Cookie", user)
    .send({ticketId: ticket.id})
    .expect(201);
    //cancle order
     await request(app)
    .delete(endpoint + `/${order.id}`)
    .set("Cookie", user)
    .expect(204);

    expect(natsWrapper.client.publish).toHaveBeenCalled()
});