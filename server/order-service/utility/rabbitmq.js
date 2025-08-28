const amqp = require("amqplib");

let channel, connection;

const connectRabbitMQ = async () => {
  try {
    connection = await amqp.connect(process.env.RABBITMQ_URL || "amqp://localhost");
    channel = await connection.createChannel();
    console.log("✅ RabbitMQ connected");
  } catch (error) {
    console.error("❌ RabbitMQ connection failed:", error.message);
  }
};

const publishToQueue = async (queueName, data) => {
  if (!channel) {
    console.error("❌ No RabbitMQ channel available");
    return;
  }
  try {
    await channel.assertQueue(queueName, { durable: true });
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
    console.log(`📩 Message sent to queue [${queueName}]`);
  } catch (error) {
    console.error("❌ Error publishing to RabbitMQ:", error.message);
  }
};

module.exports = { connectRabbitMQ, publishToQueue };
