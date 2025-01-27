import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CarriersService } from './services/carriers';
import { ConfigModule } from '@nestjs/config';
import { CarrierBuilder } from './carrier.builder';

@Module({
  imports: [ConfigModule, HttpModule],
  providers: [CarrierBuilder, CarriersService],
  exports: [CarrierBuilder],
})
export class CarriersModule {}
