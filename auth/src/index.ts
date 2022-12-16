import mongoose, { mongo } from 'mongoose';
import { app } from './app';
import { DatabaseConnectionError } from '@fajartickets/common/build/errors/database-connection-error';

const startDb = async() => {
    console.log("halohaloajfoiajifhj");
    
    if(!process.env.JWT_KEY){
        throw new Error("JWT_KEY must be defined in env")
    }
    if(!process.env.MONGO_URI){
        throw new Error("MONGO_URI must be defined in env")
    }
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('connected to momngoodb');
    } catch (error) {
        // throw new DatabaseConnectionError()
        console.log(error)
    }
}
startDb();

app.listen(3000, ()=> console.log(`Server Run At port 3000`))