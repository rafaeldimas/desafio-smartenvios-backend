class Event {
  timestamp: string;
  status: string;
  location: string;
  processed: boolean = false;
}

export class CreateTrackingDto {
  trackingCode: string;
  carrier: string;
  events: Event[] = [];
}
