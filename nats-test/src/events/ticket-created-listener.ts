import {Stan, Message} from 'node-nats-streaming';
import { Listener } from './base-listener';
import { TicketCreatedEvent } from './ticket-created-event';
import { Subjects } from './subjects';

export class TicketCreatedListener extends Listener<TicketCreatedEvent>{
    readonly subject = Subjects.TicketCreated
    queueGroupName = 'payment-service'
    constructor(client: Stan){
      super(client)
    }
  
    onMessage(data: TicketCreatedEvent['data'], msg: Message): void {
      console.log('Evenet data', data);
      msg.ack();
    }
  }