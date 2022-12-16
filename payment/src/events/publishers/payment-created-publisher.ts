import { Publisher, Subjects , PaymentCreatedEvent} from "@fajartickets/common";

export class PaymentCretaedPublisher extends Publisher<PaymentCreatedEvent>{
   readonly subject = Subjects.PaymentCreated;
}