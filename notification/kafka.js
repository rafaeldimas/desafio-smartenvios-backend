import { Kafka } from 'kafkajs';

const { KAFKA_BROKERS = '' } = process.env;

console.log(KAFKA_BROKERS, KAFKA_BROKERS.split(','))

export const kafka = new Kafka({
  clientId: 'notification-service',
  brokers: KAFKA_BROKERS.split(',')
});

export const producer = kafka.producer({ allowAutoTopicCreation: true });

export const consumer = kafka.consumer({ groupId: 'notification-consumer', allowAutoTopicCreation: true });

