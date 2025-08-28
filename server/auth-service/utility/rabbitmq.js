// rabbitmq/producer.js
import amqp from 'amqplib';

let connection = null;
let channel = null;

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';
const EXCHANGE_NAME = 'auth_events';
const EXCHANGE_TYPE = 'topic';

// Connect to RabbitMQ
const connectRabbitMQ = async () => {
  try {
    connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
    
    // Declare exchange for auth events
    await channel.assertExchange(EXCHANGE_NAME, EXCHANGE_TYPE, {
      durable: true
    });
    
    console.log('✅ RabbitMQ producer connected');
    
    // Handle connection close
    connection.on('close', () => {
      console.warn('⚠️  RabbitMQ connection closed');
    });
    
    connection.on('error', (err) => {
      console.error('❌ RabbitMQ connection error:', err.message);
    });
    
    return { connection, channel };
  } catch (err) {
    console.error('❌ RabbitMQ connect error:', err.message);
    throw err;
  }
};

// Publish message to RabbitMQ
const publishMessage = async (routingKey, payload, options = {}) => {
  try {
    if (!channel) {
      console.warn('⚠️  RabbitMQ channel not available, attempting to reconnect...');
      await connectRabbitMQ();
    }
    
    const messageBuffer = Buffer.from(JSON.stringify({
      ...payload,
      timestamp: new Date().toISOString(),
      service: 'auth-service'
    }));
    
    const publishOptions = {
      persistent: true,
      contentType: 'application/json',
      ...options
    };
    
    const published = channel.publish(
      EXCHANGE_NAME,
      routingKey,
      messageBuffer,
      publishOptions
    );
    
    if (published) {
      console.log(`📤 Published message to ${routingKey}:`, payload.type);
    }
    
    return published;
  } catch (err) {
    console.error('❌ RabbitMQ publish error:', err.message);
    // Don't throw - allow service to continue even if messaging fails
    return false;
  }
};

// Publish auth events with specific routing keys
const publishAuthEvent = async (eventType, data) => {
  const routingKey = `auth.${eventType.toLowerCase()}`;
  return await publishMessage(routingKey, {
    type: eventType,
    data,
    source: 'auth-service'
  });
};

// Graceful shutdown
const closeConnection = async () => {
  try {
    if (channel) {
      await channel.close();
      console.log('✅ RabbitMQ channel closed');
    }
    if (connection) {
      await connection.close();
      console.log('✅ RabbitMQ connection closed');
    }
  } catch (err) {
    console.error('❌ Error closing RabbitMQ connection:', err.message);
  }
};

// Health check
const isConnected = () => {
  return connection && !connection.connection.destroyed && channel;
};

export { 
  connectRabbitMQ, 
  publishMessage, 
  publishAuthEvent, 
  closeConnection, 
  isConnected,
  channel,
  connection 
};
