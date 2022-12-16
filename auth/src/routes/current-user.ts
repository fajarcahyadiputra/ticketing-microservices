import {Router, Response, Request} from 'express';
import { currentUser } from '@fajartickets/common';

const router = Router();

router.get("/currentuser", currentUser, function(req: Request, res: Response){
    return res.send({currentUser: req.currentUser || null})
 })




 export {router as currentUserRouter}