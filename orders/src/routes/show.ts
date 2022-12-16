import { NotAuthorizedError, NotFoundError, requireAuth } from '@fajartickets/common';
import express, {Response, Request} from 'express';
import { Order } from '../models/order';
const router = express.Router();

router.get("/api/orders/:orderId", requireAuth, async (req: Request, res: Response)=>{
    const {orderId} = req.params;
    const order = await Order.findById(orderId).populate("ticket");

    if(!order){
        throw new NotFoundError("Order Not Found")
    }

    if(order.userId !== req.currentUser!.id){
        throw new NotAuthorizedError();
    }
    res.send(order)
})

export {router as showOrderRouter}