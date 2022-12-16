import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TicketCreatedListener } from './events/ticket-created-listener';

const stan = nats.connect("ticketing",randomBytes(4).toString("hex"),{
    url: "http://localhost:4222"
});
console.clear();

stan.on("connect", ()=>{
  console.log('listener connect to NATS');
    // Subscriber can specify how many existing messages to get.
    stan.on("close", () => {
      console.log('NATS client close');
      process.exit();
    })
    const TickerCreatedInit = new TicketCreatedListener(stan);
    TickerCreatedInit.listen();
  })
  
  process.on("SIGINT", () => stan.close())
  process.on("SIGTERM", () => stan.close())








