import mongoose, { mongo } from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { DatabaseConnectionError } from '@fajartickets/common/build/errors/database-connection-error';
import { TicketCreatedListener } from './events/listeners/ticket-created-listener';
import { TicketUpdatedListener } from './events/listeners/ticket-updated-listener';
import { ExpirationCompleteListener } from './events/listeners/expiration-complete-listener';
import { PaymentCreatedListener } from './events/listeners/payment-created-listener';

const {
    JWT_KEY,
    MONGO_URI,
    NATS_URL,
    NATS_CLUSTER_ID,
    NATS_CLIENT_ID
} = process.env;


const startDb = async() => {
    if(!JWT_KEY){
        throw new Error("JWT_KEY must be defined in env")
    }
    if(!MONGO_URI){
        throw new Error("MONGO_URI must be defined in env")
    }
    if(!NATS_URL){
        throw new Error("NATS_URL must be defined in env")
    }
    if(!NATS_CLUSTER_ID){
        throw new Error("NATS_CLUSTER_ID must be defined in env")
    }
    if(!NATS_CLIENT_ID){
        throw new Error("NATS_CLIENT_ID must be defined in env")
    }
    try {
        console.log("loading...");
        
        await mongoose.connect(MONGO_URI);
        await natsWrapper.connect(NATS_CLUSTER_ID,NATS_CLIENT_ID,NATS_URL)
        natsWrapper.client!.on("close", ()=> {
            console.log("NATS close");
            process.exit();
        })

        process.on("SIGINT", () => natsWrapper.client.close());
        process.on("SIGTERM", () => natsWrapper.client.close());

        new TicketCreatedListener(natsWrapper.client).listen();
        new TicketUpdatedListener(natsWrapper.client).listen();
        new ExpirationCompleteListener(natsWrapper.client).listen();
        new PaymentCreatedListener(natsWrapper.client).listen();

        console.log('connected to momngoodb');
    } catch (error) {
        // throw new DatabaseConnectionError()
        console.log(error)
    }
}
startDb();

app.listen(3000, ()=> console.log(`Server Run At port 3000`))