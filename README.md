# desafio-smartenvios-backend

## Setup

Todas as configurações dos microservices estão no arquivo `docker-compose.yml`, como também os serviços do mensageria e banco de dados.

Para iniciar os serviço execute:

```bash
$ docker-compose up -d
```

## order-tracking

Esse é o microservice principal, onde é feito a solitação para efetuar o rastreio pelo código e onde é feito todas as atualização para os outros microservices.

Nesse microservice temos 3 endpoints para gerenciamento dos rastreios:

- POST /tracking Nesse endpoint podemos criar a solicação de rastreio, passando o code no body da request
- GET /tracking Nesse endpoint listamos todos os rastreio solicitados
- GET /tracking/:code Nesse endpoint podemos consultar pelo trackingCode um rastreio especifico

## notification e tracking-portal

Esses dois microservices são apenas para exemplo, nele eu consumo os eventos gerados pelo order-tracking, dessa forma é possível visualizar a interação entre os microservices.
