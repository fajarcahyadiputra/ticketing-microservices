import {Router, Response, Request} from 'express';
import {body} from 'express-validator';
import { validateRequest, BadRequestError } from '@fajartickets/common';
import { User } from '../models/user';
import { Password } from '../services/password';
import { sign, verify } from 'jsonwebtoken';
const router = Router();

const managePassword = new Password();

router.post("/signin",[
    body("password").trim().notEmpty().withMessage("You must supply a password"),
    body("email").notEmpty().withMessage("You must supply a email").isEmail().withMessage("Email must be valid")
], validateRequest, async function(req: Request, res: Response){
    const {email, password} = req.body;
    let existingUser = await User.findOne({email});
    if(!existingUser){
        throw new BadRequestError("Invalid credentials");
    }
    const passwordMatch = await managePassword.compare(existingUser.password, password);
    if(!passwordMatch){
        throw new BadRequestError('Invalid credentials');
    }

    let userJwt = sign({id: existingUser.id, email: existingUser.email}, process.env.JWT_KEY!);
    req.session = {
        jwt: userJwt
    }

    return res.status(200).json(existingUser)
 })


 export {router as signin}