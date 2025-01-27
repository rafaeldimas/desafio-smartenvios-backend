import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { CarrierContract } from '../../contracts/carrier.contract';
import {
  Carriers,
  TrackingInfoContract,
} from '../../contracts/tracking-info.contract';
import { TrackingInfoCarriersInterface } from './interface/tracking-info-carriers.interface';

@Injectable()
export class CarriersService implements CarrierContract {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async tracking(code: string): Promise<TrackingInfoContract> {
    const data = await this.getTrackingInfo(code);

    return this.formatReturnData(data);
  }

  private async getTrackingInfo(
    code: string,
  ): Promise<TrackingInfoCarriersInterface> {
    const url = `http://api.carriers.com.br/client/Carriers/Tracking/${code}`;

    const bearerToken = this.configService.get<string>('CARRIERS_BEARER_TOKEN');

    const headers = {
      Authorization: `Bearer ${bearerToken}`,
    };

    const { data } = await firstValueFrom(
      this.httpService
        .get<TrackingInfoCarriersInterface>(url, { headers })
        .pipe(
          catchError((error: AxiosError) => {
            if (error.response?.status === 404) {
              throw new NotFoundException('Tracking code not found');
            }

            throw new InternalServerErrorException();
          }),
        ),
    );

    return data;
  }

  private formatReturnData(
    data: TrackingInfoCarriersInterface,
  ): TrackingInfoContract {
    return {
      trackingCode: data.PedidoCliente,
      carrier: Carriers.Carriers,
      events: data.Eventos.map((event) => ({
        timestamp: event.Data,
        status: event.Status,
        location: event.Descricao,
        processed: false,
      })),
    };
  }
}
