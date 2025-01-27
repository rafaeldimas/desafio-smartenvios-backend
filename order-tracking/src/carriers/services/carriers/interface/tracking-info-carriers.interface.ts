export interface TrackingInfoCarriersInterface {
  PedidoCliente: string;
  ValorFrete: number;
  idItemParceiro: number;
  Cliente: string;
  dtPrevista: string;
  Destinatario: string;
  codigoRastreio: string;
  Url: string;
  UrlProtocolo: string;
  DadosEntrega: DadosEntrega;
  Eventos: Evento[];
}

export interface DadosEntrega {
  Recebedor: string;
  'Doc Recebedor': string;
  Parentesco: string;
  'Data Protocolo': string;
}

export interface Evento {
  Data: string;
  Status: string;
  idStatus: number;
  Descricao: string;
}
