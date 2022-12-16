import { OrderStatus } from "@fajartickets/common";
import request from "supertest";
import { app } from "../../app";
import { Order } from "../../models/order";
import { Payment } from "../../models/payment";
import { stripe } from "../../stripe";

const endpoint = "/api/payment";

// jest.mock("../../stripe");

it("returns a 404 when purchasing an order that does not exists", async () => {
   await request(app)
   .post(endpoint)
   .set("Cookie", signin())
   .send({
    token: "131sadaf",
    orderId: generateObjectId()
   })
   .expect(404);
})
it("retunrs a 401 when purchasing an order that does not belong to the user", async()=> {
   const order =  Order.build({
    id: generateObjectId(),
    price: 30,
    status: OrderStatus.Created,
    userId: generateObjectId(),
    version: 0
   })
   await order.save();

   await request(app)
   .post(endpoint)
   .set("Cookie", signin())
   .send({
    token: "131sadaf",
    orderId: order.id
   })
   .expect(401);
})
it("returns a 400 when purchasing a cancelled order", async () => {
    const userId = generateObjectId();
    const order =  Order.build({
        id: generateObjectId(),
        price: 30,
        status: OrderStatus.Cancelled,
        userId: userId,
        version: 0
       })
    await order.save();

    await request(app)
    .post(endpoint)
    .set("Cookie", signin(userId))
    .send({
     token: "131sadaf",
     orderId: order.id
    })
    .expect(400);
})
it("returns a 204 with valid inputs", async()=>{
    const randomPrice = Math.floor(Math.random() * 100000);
    const userId = generateObjectId();
    const order =  Order.build({
        id: generateObjectId(),
        price: randomPrice,
        status: OrderStatus.Created,
        userId: userId,
        version: 0
       })
       await order.save();

        await request(app)
       .post(endpoint)
       .set("Cookie", signin(userId))
       .send({
        token: "tok_visa",
        orderId: order.id
       })
       .expect(201);

    //    const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
    //    expect(chargeOptions.source).toEqual("tok_visa");
    //    expect(chargeOptions.amount).toEqual(order.price * 100);
    //    expect(chargeOptions.currency).toEqual("usd");

    const stripeCharges = await stripe.charges.list({limit: 50});
    const stripeCharge  = stripeCharges.data.find(charge => {
        return charge.amount === randomPrice * 100
    })

    expect(stripeCharge).toBeDefined();
    expect(stripeCharge?.currency).toEqual("usd");

    const payment = await Payment.findOne({
        orderId: order.id,
        stripeId: stripeCharge!.id
    })

    expect(payment).not.toBeNull();

})