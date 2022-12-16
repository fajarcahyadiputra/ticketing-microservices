import { Subjects, Publisher, OrderCancelledEvent } from '@fajartickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.orderCancelled = Subjects.orderCancelled;
}
