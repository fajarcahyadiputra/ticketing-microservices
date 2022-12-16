import nats from 'node-nats-streaming';
import {randomBytes} from "crypto";
import {TicketCreatedPublisher} from "./events/ticket-created-publisher";

console.clear();
const stan = nats.connect("ticketing",randomBytes(4).toString("hex"),{
    url: "http://localhost:4222"
});

stan.on("connect", async () => {
    console.log('publisher connect to NATS');
    const publisher = new TicketCreatedPublisher(stan);

   await publisher.publish({
        id: "1234",
        title: "concert",
        price: 20
    });
})

