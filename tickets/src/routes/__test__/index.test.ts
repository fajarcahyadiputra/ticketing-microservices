import { app } from "../../app";
import request from 'supertest';
const endpoint = "/api/tickets";


const createTicket = async (length: number) => {
    for (let index = 0; index < length; index++) {
        await request(app)
        .post(endpoint)
        .set("Cookie", signin())
        .send({
            title: `title${index+1}`,
            price: index + 10,
        })
        .expect(201);
    }
}

it("can fetch a list of tickets", async()=> {
    await createTicket(5);

    const response = await request(app)
    .get(endpoint)
    .send({})
    .expect(200);

    expect(response.body.length).toEqual(5)
})