import { consumer } from "./kafka.js";

async function main() {
  const { KAFKA_TOPIC } = process.env;

  await consumer.connect();
  await consumer.subscribe({ topics: [KAFKA_TOPIC], fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log('Received message', {
        topic,
        partition,
        value: message.value.toString(),
      });
    },
  });
}

main().then(() => console.log('notification microservice is started')).catch(console.error);
