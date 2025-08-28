import RabbitMQService from '../utils/rabbitmq.js';

class EventConsumer {
  constructor() {
    this.initializeConsumers();
  }

  async initializeConsumers() {
    try {
      // Connect to RabbitMQ
      await RabbitMQService.connect();
      
      // Consume chat events
      await RabbitMQService.consumeMessages('chat_events', this.handleChatEvent.bind(this));
      
      // Consume user notifications
      await RabbitMQService.consumeMessages('user_notifications', this.handleUserNotification.bind(this));
      
      // Consume admin notifications
      await RabbitMQService.consumeMessages('admin_notifications', this.handleAdminNotification.bind(this));
      
      console.log('✅ Event consumers initialized');
    } catch (error) {
      console.error('❌ Error initializing consumers:', error);
    }
  }

  handleChatEvent(event) {
    console.log('📨 Received chat event:', event);
    
    switch (event.type) {
      case 'MESSAGE_SENT':
        this.processMessageSent(event.data);
        break;
      case 'USER_JOINED':
        this.processUserJoined(event.data);
        break;
      case 'USER_LEFT':
        this.processUserLeft(event.data);
        break;
      default:
        console.log('🤷 Unknown chat event type:', event.type);
    }
  }

  handleUserNotification(notification) {
    console.log('🔔 Received user notification:', notification);
    // Handle user-specific notifications
    // Could trigger email, push notifications, etc.
  }

  handleAdminNotification(notification) {
    console.log('👨‍💼 Received admin notification:', notification);
    // Handle admin-specific notifications
    // Could trigger admin dashboard updates, etc.
  }

  processMessageSent(data) {
    // Additional processing after message is sent
    // Could include analytics, spam detection, etc.
    console.log(`💬 Processing sent message from ${data.senderId} in room ${data.roomId}`);
  }

  processUserJoined(data) {
    console.log(`👋 User ${data.userId} joined room ${data.roomId}`);
  }

  processUserLeft(data) {
    console.log(`🚪 User ${data.userId} left room ${data.roomId}`);
  }
}

export default EventConsumer;
