import { Publisher, Subjects, TicketUdaptedEvent } from "@fajartickets/common";

export class TicketUdatedPublisher extends Publisher<TicketUdaptedEvent>{
    readonly subject = Subjects.TicketUpdated;
}