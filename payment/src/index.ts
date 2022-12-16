import mongoose, { mongo } from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { DatabaseConnectionError } from '@fajartickets/common/build/errors/database-connection-error';
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener';
import { OrderCreatedListener } from './events/listeners/order-created-listener';

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
        await mongoose.connect(MONGO_URI);
        await natsWrapper.connect(NATS_CLUSTER_ID,NATS_CLIENT_ID,NATS_URL)
        natsWrapper.client!.on("close", ()=> {
            console.log("NATS close");
            process.exit();
        })
        process.on("SIGINT", () => natsWrapper.client.close())
        process.on("SIGTERM", () => natsWrapper.client.close())

        new OrderCancelledListener(natsWrapper.client).listen();
        new OrderCreatedListener(natsWrapper.client).listen();

        //call listener


        console.log('connected to momngoodb');
    } catch (error) {
        // throw new DatabaseConnectionError()
        console.log(error)
    }
}
startDb();

app.listen(3000, ()=> console.log(`Server Run At port 3000`))