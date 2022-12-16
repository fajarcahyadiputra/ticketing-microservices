import {  BadRequestError, NotAuthorizedError, NotFoundError, OrderStatus, requireAuth, validateRequest } from "@fajartickets/common";
import {Router, Response, Request} from "express";
import { body } from "express-validator";
import { PaymentCretaedPublisher } from "../events/publishers/payment-created-publisher";
import { Order } from "../models/order";
import { Payment } from "../models/payment";
import { natsWrapper } from "../nats-wrapper";
const router = Router();
import { stripe } from "../stripe";



router.post("/api/payment", requireAuth, [
    body("token").not().isEmpty(),
    body("orderId").not().isEmpty()
], validateRequest, async (req: Request, res: Response)=> {
    const {token, orderId} = req.body;
    
    const order = await Order.findById(orderId);
    if(!order){
        throw new NotFoundError("Order not found");
    }
    if(order.userId !== req.currentUser?.id){
        throw new NotAuthorizedError();
    }
    if(order.status === OrderStatus.Cancelled){
        throw new BadRequestError("Cannot pay for cancelled order");
    }

   const charge = await stripe.charges.create({
        amount: order.price * 100,
        source: token,
        description: "order",
        currency: "usd"
    })
    const payment = Payment.build({
        orderId,
        stripeId: charge.id
    })
    await payment.save();
    new PaymentCretaedPublisher(natsWrapper.client).publish({
        id: payment.id,
        stripeId: payment.stripeId,
        orderId: payment.orderId
    })
   res.status(201).send({id: payment.id, charge})
})

export {router as createChargeRouter}