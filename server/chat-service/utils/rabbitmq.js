import amqp from 'amqplib';

class RabbitMQService {
  constructor() {
    this.connection = null;
    this.channel = null;
  }

  async connect() {
    try {
      this.connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
      this.channel = await this.connection.createChannel();
      
      // Assert exchanges and queues
      await this.channel.assertExchange('chat_exchange', 'topic', { durable: true });
      await this.channel.assertQueue('chat_events', { durable: true });
      await this.channel.assertQueue('user_notifications', { durable: true });
      await this.channel.assertQueue('admin_notifications', { durable: true });
      
      // Bind queues to exchange
      await this.channel.bindQueue('chat_events', 'chat_exchange', 'chat.*');
      await this.channel.bindQueue('user_notifications', 'chat_exchange', 'user.*');
      await this.channel.bindQueue('admin_notifications', 'chat_exchange', 'admin.*');
      
      console.log('✅ RabbitMQ service connected');
    } catch (error) {
      console.error('❌ RabbitMQ connection error:', error);
      throw error;
    }
  }

  async publishMessage(routingKey, message) {
    try {
      if (!this.channel) {
        await this.connect();
      }
      
      const messageBuffer = Buffer.from(JSON.stringify(message));
      await this.channel.publish('chat_exchange', routingKey, messageBuffer, { persistent: true });
      console.log(`📤 Published message to ${routingKey}`);
    } catch (error) {
      console.error('❌ Error publishing message:', error);
    }
  }

  async consumeMessages(queueName, callback) {
    try {
      if (!this.channel) {
        await this.connect();
      }
      
      await this.channel.consume(queueName, (msg) => {
        if (msg) {
          const content = JSON.parse(msg.content.toString());
          callback(content);
          this.channel.ack(msg);
        }
      });
      
      console.log(`📥 Started consuming from ${queueName}`);
    } catch (error) {
      console.error('❌ Error consuming messages:', error);
    }
  }

  async close() {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      if (this.connection) {
        await this.connection.close();
      }
      console.log('🔌 RabbitMQ connection closed');
    } catch (error) {
      console.error('❌ Error closing RabbitMQ connection:', error);
    }
  }
}

export default new RabbitMQService();
