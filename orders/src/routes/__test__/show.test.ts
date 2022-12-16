import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";

const endpoint = "/api/orders";

it("fetch the order", async()=> {
    const ticket = await Ticket.build({
        id: generateObjectId(),
        price: 20,
        title: "concert"
    }).save();

    const user = signin();

    const {body: orderOne} = await request(app)
    .post(endpoint)
    .set("Cookie", user)
    .send({ticketId: ticket.id})
    .expect(201);

    const response = await request(app)
    .get(endpoint+ `/${orderOne.id}`)
    .set("Cookie", user)
    .expect(200);


    expect(response.body.id).toEqual(orderOne.id);
    expect(response.body.ticket.id).toEqual(ticket.id)
})
it("return an error if one user to fetch anoter users order", async()=> {
    const ticket = await Ticket.build({
        id: generateObjectId(),
        price: 20,
        title: "concert"
    }).save();

    const user = signin();

    const {body: orderOne} = await request(app)
    .post(endpoint)
    .set("Cookie", user)
    .send({ticketId: ticket.id})
    .expect(201);

    const response = await request(app)
    .get(endpoint+ `/${orderOne.id}`)
    .set("Cookie", signin())
    .expect(401);
})