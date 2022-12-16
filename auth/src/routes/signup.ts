import {Router, Request, Response} from 'express';
import {body, validationResult} from 'express-validator';
import { BadRequestError, validateRequest} from '@fajartickets/common';
import {User} from '../models/user';
import {sign} from "jsonwebtoken";

const router = Router();

router.post("/signup", [
    body("email").notEmpty().isEmail().withMessage("Email must be valid"),
    body("password").trim().isLength({min: 6, max: 20}).withMessage("Password must be between 6 and 20 characters")
], validateRequest, async function(req: Request, res: Response){
    const {email, password} = req.body;
    let existingUser = await User.findOne({email});
    if(existingUser){
       throw new BadRequestError("Email in use");
    }
    let user =  User.build({email, password});
    await user.save();
    //generate json web token
    const token = sign({id: user.id, email: user.email}, process.env.JWT_KEY!); // ! untuk memberitahu typecript bahwa process.env.JWT_KEY bakal/pasti ada
    req.session = {
        jwt: token
    }
    return res.status(201).json(user)
 })


 export {router as signup}