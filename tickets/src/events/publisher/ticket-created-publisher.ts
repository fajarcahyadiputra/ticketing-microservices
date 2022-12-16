import { Publisher, Subjects, TicketCreatedEvent } from "@fajartickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
    readonly subject = Subjects.TicketCreated;
}
