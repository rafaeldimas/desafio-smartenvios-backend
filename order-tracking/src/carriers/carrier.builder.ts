import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { CarrierContract } from './contracts/carrier.contract';
import { Carriers } from './contracts/tracking-info.contract';
import { CarriersService } from './services/carriers';

@Injectable()
export class CarrierBuilder {
  private carrier: Carriers;

  constructor(private readonly moduleRef: ModuleRef) {}

  setCarrier(carrier: Carriers) {
    this.carrier = carrier;
    return this;
  }

  build(): CarrierContract {
    const carriers = {
      [Carriers.Carriers]: () =>
        this.moduleRef.get<CarrierContract>(CarriersService),
    };

    return carriers[this.carrier]();
  }
}
