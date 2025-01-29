export interface TrackingInfoContract {
  trackingCode: string;
  carrier: Carriers;
  wasDelivered: boolean;
  events: Event[];
}

export enum Carriers {
  Carriers = 'Carriers',
}

export interface Event {
  timestamp: string;
  status: string;
  location: string;
  processed: boolean;
}
