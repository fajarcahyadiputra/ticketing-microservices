import {MongoMemoryServer} from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

// to declaration in global
declare global {
    var signin: () => string[];
    var generateObjectId: () => string;
 }

jest.mock("../nats-wrapper");

let mongo:any;
beforeAll(async() => {
    process.env.JWT_KEY = "ngasal"
    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri()

    await mongoose.connect(mongoUri)
})

beforeEach(async()=> {
    const collections = await mongoose.connection.db.collections();
    for(const collection of collections){
        await collection.deleteMany({});
    }
})

afterAll(async()=> {
    await mongo.stop();
    await mongoose.connection.close();
})


global.signin = () => {
    //build a jwt payload . {id: email}
    const payload = {
        id:  new mongoose.Types.ObjectId().toHexString(),
        email: "coba@coba.com"
    }
    //create the JWT;
    const token = jwt.sign(payload, process.env.JWT_KEY!);
    //build session object. {jwt: MYSQ_SCRT}
    const session = {jwt: token}
    //trun that session into JSON
    const sessionJSON = JSON.stringify(session);
    //take JSON and encode it as base64
    const base64 = Buffer.from(sessionJSON).toString("base64");
    //return a string tahts the cookie with the encode  data
    return [`session=${base64}`];
}

global.generateObjectId = ()=>{
    const id = new mongoose.Types.ObjectId().toHexString();
    return id;
}


