import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "admin-service",
  brokers: [process.env.KAFKA_BROKER]
});

export const consumer = kafka.consumer({ groupId: "admin-service-group" });

export const connectConsumer = async (topic, eachMessage) => {
  await consumer.connect();
  await consumer.subscribe({ topic, fromBeginning: true });
  await consumer.run({ eachMessage });
  console.log(`Kafka Consumer connected to topic ${topic}`);
};
