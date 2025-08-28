// rabbitmq/consumer.js
import amqp from 'amqplib';

let connection = null;
let channel = null;

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';
const EXCHANGE_NAME = 'auth_events';
const EXCHANGE_TYPE = 'topic';

// Connect to RabbitMQ for consuming
const connectRabbitMQConsumer = async () => {
  try {
    connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
    
    // Declare exchange
    await channel.assertExchange(EXCHANGE_NAME, EXCHANGE_TYPE, {
      durable: true
    });
    
    console.log('✅ RabbitMQ consumer connected');
    
    // Handle connection events
    connection.on('close', () => {
      console.warn('⚠️  RabbitMQ consumer connection closed');
    });
    
    connection.on('error', (err) => {
      console.error('❌ RabbitMQ consumer connection error:', err.message);
    });
    
    return { connection, channel };
  } catch (err) {
    console.error('❌ RabbitMQ consumer connect error:', err.message);
    throw err;
  }
};

// Subscribe to auth events with routing key patterns
const subscribeToAuthEvents = async (routingKeyPattern, messageHandler) => {
  try {
    if (!channel) {
      await connectRabbitMQConsumer();
    }
    
    // Create a unique queue for this service
    const queueName = `auth_events_${process.env.SERVICE_NAME || 'service'}_${Date.now()}`;
    
    const queue = await channel.assertQueue(queueName, {
      exclusive: true,
      autoDelete: true
    });
    
    // Bind queue to exchange with routing key pattern
    await channel.bindQueue(queue.queue, EXCHANGE_NAME, routingKeyPattern);
    
    console.log(`📥 Subscribed to auth events with pattern: ${routingKeyPattern}`);
    
    // Consume messages
    await channel.consume(queue.queue, async (message) => {
      if (message) {
        try {
          const content = JSON.parse(message.content.toString());
          console.log(`📨 Received auth event: ${content.type}`);
          
          // Call the message handler
          await messageHandler(content, message.fields.routingKey);
          
          // Acknowledge the message
          channel.ack(message);
        } catch (err) {
          console.error('❌ Error processing auth event:', err.message);
          // Reject and don't requeue
          channel.nack(message, false, false);
        }
      }
    });
    
    return queue.queue;
  } catch (err) {
    console.error('❌ RabbitMQ subscribe error:', err.message);
    throw err;
  }
};

// Generic message handler for auth events
const handleAuthEvent = async (eventData, routingKey) => {
  console.log(`🔔 Processing auth event: ${eventData.type} from ${eventData.service}`);
  console.log(`📍 Routing key: ${routingKey}`);
  console.log(`📦 Data:`, eventData.data);
  
  // Add specific handling logic based on event type
  switch (eventData.type) {
    case 'USER_REGISTERED':
      console.log('👤 New user registered:', eventData.data.email);
      break;
    case 'USER_LOGIN':
      console.log('🔑 User logged in:', eventData.data.email);
      break;
    case 'USER_LOGOUT':
      console.log('🚪 User logged out:', eventData.data.userId);
      break;
    case 'PASSWORD_RESET_REQUEST':
      console.log('🔄 Password reset requested:', eventData.data.email);
      break;
    case 'PASSWORD_RESET_SUCCESS':
      console.log('✅ Password reset successful:', eventData.data.email);
      break;
    default:
      console.log('❓ Unknown auth event type:', eventData.type);
  }
};

// Close consumer connection
const closeConsumerConnection = async () => {
  try {
    if (channel) {
      await channel.close();
      console.log('✅ RabbitMQ consumer channel closed');
    }
    if (connection) {
      await connection.close();
      console.log('✅ RabbitMQ consumer connection closed');
    }
  } catch (err) {
    console.error('❌ Error closing RabbitMQ consumer connection:', err.message);
  }
};

// Health check for consumer
const isConsumerConnected = () => {
  return connection && !connection.connection.destroyed && channel;
};

export { 
  connectRabbitMQConsumer, 
  subscribeToAuthEvents, 
  handleAuthEvent, 
  closeConsumerConnection, 
  isConsumerConnected 
};
