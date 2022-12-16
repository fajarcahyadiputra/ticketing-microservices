import express from 'express';
import {json, urlencoded} from 'body-parser';
import "express-async-errors";
import cookieSession from 'cookie-session';

//import router
import {
    currentUserRouter, 
    signin, 
    signout, 
    signup
} from './routes';
import {errorHandler, NotFoundError} from '@fajartickets/common';


const app = express();
app.set("trust proxy", true)
app.use(json({limit:"50mb"}))
app.use(urlencoded({extended: false}))
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test"
}))

//init router
app.use("/api/users/",currentUserRouter)
app.use("/api/users/",signin)
app.use("/api/users/",signout)
app.use("/api/users/",signup)
app.all("*", async(req,res, next) => {
    throw new NotFoundError()
})
app.use(errorHandler)

export {app};