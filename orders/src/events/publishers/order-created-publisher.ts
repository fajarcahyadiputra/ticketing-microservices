import { Publisher, OrderCreatedEvent, Subjects } from '@fajartickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  
}
