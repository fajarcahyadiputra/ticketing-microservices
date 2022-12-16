import express from 'express';
import {json, urlencoded} from 'body-parser';
import "express-async-errors";
import cookieSession from 'cookie-session';

//import router
import { createTicketRouter } from './routes/new';
import { showTicketRoute } from './routes/show';
import { indexRoute } from './routes/index';
import { updateTicket } from './routes/update';
import {currentUser, errorHandler, NotFoundError} from '@fajartickets/common';


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
app.use(createTicketRouter)
app.use(showTicketRoute)
app.use(indexRoute)
app.use(updateTicket)
app.all("*", async(req,res, next) => {
    throw new NotFoundError()
})
app.use(errorHandler)

export {app};