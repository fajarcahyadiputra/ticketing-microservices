import express from 'express';
import {json, urlencoded} from 'body-parser';
import "express-async-errors";
import cookieSession from 'cookie-session';

//import router
import {currentUser, errorHandler, NotFoundError} from '@fajartickets/common';
import {
    deleteOrderRouter,
    newOrderRouter,
    showOrderRouter,
    showAllRouter
} from "./routes";

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
app.use(newOrderRouter)
app.use(showOrderRouter)
app.use(deleteOrderRouter)
app.use(showAllRouter)
//init router
app.all("*", async(req,res, next) => {
    throw new NotFoundError()
})
app.use(errorHandler)

export {app};