import express, {Response, Request} from 'express';
const router = express.Router();
import {body} from 'express-validator';
import {BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest} from "@fajartickets/common";
import mongoose from 'mongoose';
import {Order} from "../models/order";

router.get("/api/orders" , requireAuth, async(req: Request, res: Response)=> {
    const orders = await Order.find({
        userId: req.currentUser!.id,
    }).populate("ticket");

    res.send(orders);
})

export {router as showAllRouter}
