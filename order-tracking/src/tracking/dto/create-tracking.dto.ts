import { Carriers } from '../../carriers/contracts/tracking-info.contract';

class Event {
  timestamp: string;
  status: string;
  location: string;
  processed: boolean = false;
}

export class CreateTrackingDto {
  trackingCode: string;
  carrier: Carriers;
  wasDelivered: boolean = false;
  events: Event[] = [];
}
