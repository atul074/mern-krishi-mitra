const amqp = require("amqplib");


let channel;

const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL || "amqp://localhost");
    channel = await connection.createChannel();
    console.log("✅ RabbitMQ connected");
  } catch (err) {
    console.error("❌ RabbitMQ connection failed:", err.message);
  }
};

const publishEvent = async (queue, message) => {
  try {
    if (!channel) {
      console.error("RabbitMQ channel not initialized");
      return;
    }
    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
  } catch (err) {
    console.error("RabbitMQ publish error:", err.message);
  }
};

module.exports= { connectRabbitMQ, publishEvent };
