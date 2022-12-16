import express from 'express';
import {json, urlencoded} from 'body-parser';
import "express-async-errors";
import cookieSession from 'cookie-session';
import {currentUser, errorHandler, NotFoundError} from '@fajartickets/common';

//import router
import { createChargeRouter } from './routes/new';



const app = express();
app.set("trust proxy", true)
app.use(json({limit:"50mb"}))
app.use(urlencoded({extended: false}))
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test"
}))
//midleware to check cookie 
app.use(currentUser);
//init router
app.use(createChargeRouter)

app.all("*", async(req,res, next) => {
    throw new NotFoundError()
})
app.use(errorHandler)

export {app};