import { TrackingInfoContract } from './tracking-info.contract';

export interface CarrierContract {
  tracking(code: string): Promise<TrackingInfoContract>;
}
