import request from 'supertest';
import { app } from '../../app';
import { natsWrapper } from '../../nats-wrapper';
const endpoint = "/api/tickets";


it("returns a 404 if the provided is does not exixts", async()=> {
    await request(app)
    .put(endpoint+`/${generateObjectId()}`)
    .set("Cookie", signin())
    .send({
        title: "title",
        price: 20
    })
    .expect(404)
    });
it("return a 401 if the user is not authenticated", async()=> {
    await request(app)
    .put(endpoint+`/${generateObjectId()}`)
    .send({
        title: "title",
        price: 20
    })
    .expect(401)
});
it("returns a 401 if the user does not own the ticket", async()=> {
    const response = await request(app)
    .post(endpoint)
    .set("Cookie", signin())
    .send({
        title: "title",
        price: 20
    })
    

    await request(app)
    .put(endpoint+`/${response.body.id}`)
    .set("Cookie", signin())
    .send({
        title: "cobatttt",
        price: 1000
    })
    .expect(401);
});
it("return a 400 if the user provides an invalid title or price", async()=> {
    const cookie = signin();
    const response = await request(app)
    .post(endpoint)
    .set("Cookie", cookie)
    .send({
        title: "title",
        price: 20
    })
    

    await request(app)
    .put(endpoint+`/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
        title: "",
    })
    .expect(400);

    await request(app)
    .put(endpoint+`/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
        title: "",
        price: -10
    })
    .expect(400);
});
it("updates the ticket provided an valid input", async()=> {
    const cookie = signin();
    const response = await request(app)
    .post(endpoint)
    .set("Cookie", cookie)
    .send({
        title: "title",
        price: 20
    })
    

    await request(app)
    .put(endpoint+`/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
        title: "new title",
        price: 30,
    })
    .expect(200);

    const ticketResponse = await request(app)
    .get(endpoint+ `/${response.body.id}`)
    .send({})
    .expect(200);

    expect(ticketResponse.body.title).toEqual("new title");
    expect(ticketResponse.body.price).toEqual(30);
});
it("publish an event", async()=>{
    const cookie = signin();
    const response = await request(app)
    .post(endpoint)
    .set("Cookie", cookie)
    .send({
        title: "title",
        price: 20
    })
    

    await request(app)
    .put(endpoint+`/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
        title: "new title",
        price: 30,
    })
    .expect(200);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
})
it("rejects updates if the ticket is reserved" , async () => {
    const cookie = signin();
    const orderId = generateObjectId();

    const response = await request(app)
    .post(endpoint)
    .set("Cookie", cookie)
    .send({
        title: "title",
        price: 20
    })
    

    await request(app)
    .put(endpoint+`/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
        title: "new title",
        price: 30,
        orderId
    })
    .expect(200);

    await request(app)
    .put(endpoint+`/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
        title: "updated title",
        price: 30,
        orderId: generateObjectId()
    })
    .expect(400);
})