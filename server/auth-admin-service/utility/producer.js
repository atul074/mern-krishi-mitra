// kafka/producer.js
import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID || "admin-service",
  brokers: (process.env.KAFKA_BROKERS || "localhost:9092").split(","),
});

const producer = kafka.producer();

const connectProducer = async () => {
  try {
    await producer.connect();
    console.log("Kafka producer connected");
  } catch (err) {
    console.error("Kafka producer connect error:", err);
  }
};

/**
 * sendMessage(topic, payload)
 * payload: any JSON-serializable object
 */
const sendMessage = async (topic, payload) => {
  try {
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(payload) }],
    });
  } catch (err) {
    console.error("Kafka sendMessage error:", err);
  }
};

export { producer, connectProducer, sendMessage };
