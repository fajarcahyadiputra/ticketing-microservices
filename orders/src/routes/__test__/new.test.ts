import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

const endpoint = "/api/orders";

it("returns an error if the ticket does not exists", async()=> {
    const ticketId = generateObjectId();

    await request(app)
    .post(endpoint)
    .set('Cookie', signin())
    .send({
        ticketId
    })
    .expect(404);
})
it("returns an error if the ticket is already reserved", async()=> {
    const ticket = await Ticket.build({
        id: generateObjectId(),
        price: 20,
        title: "football"
    }).save();

    const order = Order.build({
        status: OrderStatus.Created,
        ticket: ticket,
        userId: generateObjectId(),
        expiresAt: new Date()
    });
    await order.save();

    await request(app)
    .post(endpoint)
    .set('Cookie', signin())
    .send({
        ticketId: ticket.id
    })
    .expect(400);
})
it('reserves a ticket', async() => {
    const ticket = await Ticket.build({
        id: generateObjectId(),
        price: 20,
        title: "football"
    }).save();

    await request(app)
    .post(endpoint)
    .set('Cookie', signin())
    .send({
        ticketId: ticket.id
    })
    .expect(201);
})
it("emit an order created event", async() => {
    const ticket = await Ticket.build({
        id: generateObjectId(),
        price: 20,
        title: "football"
    }).save();

    await request(app)
    .post(endpoint)
    .set('Cookie', signin())
    .send({
        ticketId: ticket.id
    })
    .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
})