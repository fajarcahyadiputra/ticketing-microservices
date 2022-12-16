import request from 'supertest';
import { app } from '../../app';

const endpointSign = "/api/users/signin";
const endpointSignup = "/api/users/signup";

it("fails when an email that does not exist is supplied" , async()=> {
    await request(app)
    .post(endpointSignup)
    .send({
        email: "test@test.com",
        password: "12345678"
    })
    .expect(201);

    await request(app)
    .post(endpointSign)
    .send({
        email: "salah@salah.com",
        password: "12345678"
    })
    .expect(400)
})
it("fails when an incorrect password is supplied" , async()=> {
    await request(app)
    .post(endpointSignup)
    .send({
        email: "test@test.com",
        password: "12345678"
    })
    .expect(201);

    await request(app)
    .post(endpointSign)
    .send({
        email: "test@test.com",
        password: "salahhhhhhh"
    })
    .expect(400)
})
it("response with cookie when given valid credentials",async () => {
    await request(app)
    .post(endpointSignup)
    .send({
        email: "test@test.com",
        password: "12345678"
    })
    .expect(201);

    const response = await request(app)
    .post(endpointSign)
    .send({
        email: "test@test.com",
        password: "12345678"
    })
    .expect(200)

    expect(response.get("Set-Cookie")).toBeDefined();
})