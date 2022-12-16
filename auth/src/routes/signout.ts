import {Router} from 'express';
const router = Router();

router.post("/signout", function(req, res){
    req.session = null;
    return res.send({})
 })


 export {router as signout}