import { ObjectId } from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";

const endpoint = "/api/orders";

const createTicket = async () => {
    const ticket = Ticket.build({
      id: generateObjectId(),
        price:34,
        title: "football"
    });
    await ticket.save();
    return ticket;
}
const createOrder = async (cookie: string[], ticketId: ObjectId) => {
    return await request(app).post(endpoint).set("Cookie",cookie).send({ticketId}).expect(201)
}

it("fets order for an particular user", async () => {
   const ticketOne = await createTicket();
   const ticketTwo = await createTicket();
   const ticketThree = await createTicket();

   const userOne = signin();
   const userTwo = signin();
   const userThree = signin();

  const {body: orderOne} = await createOrder(userTwo, ticketTwo.id);
  const {body: orderTwo} =await createOrder(userTwo, ticketThree.id);
//   await createOrder(userThree, ticketThree.id);

  const response  = await request(app)
  .get(endpoint)
  .set("Cookie", userTwo)
  .send({})
  .expect(200);

  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(orderOne.id)
  expect(response.body[1].id).toEqual(orderTwo.id)
  expect(response.body[0].ticket.id).toEqual(ticketTwo.id)
  expect(response.body[1].ticket.id).toEqual(ticketThree.id)
})