import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';
const endpoint = "/api/tickets";

it("has a route handler listening to /api/tickets for post request", async() => {
    
    const response = await request(app)
    .post(endpoint)
    .send({});

    expect(response.status).not.toEqual(404);
});
it("can only be accessed if the user is signed in", async() => {
    await request(app)
    .post(endpoint)
    .send({})
    .expect(401);
});
it("return a status other than 401 if the use signed in", async() => {
    const response = await request(app)
    .post(endpoint)
    .set("Cookie", signin())
    .send({});
    
    
    expect(response.status).not.toEqual(401)
});
it("return an error if an invalid title is provided", async() => {
    await request(app)
    .post(endpoint)
    .set("Cookie", signin())
    .send({
        price: 100000
    })
    .expect(400)

    await request(app)
    .post(endpoint)
    .set("Cookie", signin())
    .send({
        title: "",
        price: 100000
    })
    .expect(400)
});
it("return an error if an invalid price is provided", async() => {
    await request(app)
    .post(endpoint)
    .set("Cookie", signin())
    .send({
        title: "title",
        price: -10
    })
    .expect(400)

    await request(app)
    .post(endpoint)
    .set("Cookie", signin())
    .send({
        title: "title"
    })
    .expect(400)
});
it("create a ticket with valid paramters", async() => {
    //add in check to make sure a ticket wa saved
    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0);

    await request(app)
    .post(endpoint)
    .set("Cookie", signin())
    .send({
        title: "title",
        price: 20,
    })
    .expect(201)

    tickets = await Ticket.find({});
    expect(tickets.length).toEqual(1);
    expect(tickets[0].price).toEqual(20);
    expect(tickets[0].title).toEqual("title");
});

it("publisher an event", async () => {
    await request(app)
    .post(endpoint)
    .set("Cookie", signin())
    .send({
        title: "title",
        price: 20,
    })
    .expect(201);
  //to test is an event publish or not
   expect(natsWrapper.client.publish).toHaveBeenCalled();
    
})