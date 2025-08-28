// Utility functions for chat operations

/**
 * Generate a unique conversation ID for one-to-one chats
 * @param {string} userId1 
 * @param {string} userId2 
 * @returns {string} Conversation ID
 */
export function generateConversationId(userId1, userId2) {
  // Ensure consistent ordering to avoid duplicate conversations
  const sortedIds = [userId1, userId2].sort();
  return `conv_${sortedIds[0]}_${sortedIds[1]}`;
}

/**
 * Get room name for one-to-one chat
 * @param {string} userId1 
 * @param {string} userId2 
 * @returns {string} Room name for socket.io
 */
export function getOneToOneRoomName(userId1, userId2) {
  const sortedIds = [userId1, userId2].sort();
  return `room_${sortedIds[0]}_${sortedIds[1]}`;
}

/**
 * Get admin support room name
 * @param {string} userId 
 * @returns {string} Admin support room name
 */
export function getAdminSupportRoomName(userId) {
  return `admin_support_${userId}`;
}

/**
 * Validate chat message data
 * @param {object} messageData 
 * @returns {object} Validation result
 */
export function validateMessageData(messageData) {
  const { senderId, message, chatType } = messageData;
  
  if (!senderId || !message || !chatType) {
    return {
      isValid: false,
      error: 'Missing required fields: senderId, message, chatType'
    };
  }
  
  if (chatType === 'one_to_one' && !messageData.receiverId) {
    return {
      isValid: false,
      error: 'receiverId is required for one-to-one chats'
    };
  }
  
  if (chatType === 'admin_support' && !messageData.roomId) {
    return {
      isValid: false,
      error: 'roomId is required for admin support chats'
    };
  }
  
  return { isValid: true };
}

/**
 * Format message for client
 * @param {object} message 
 * @returns {object} Formatted message
 */
export function formatMessageForClient(message) {
  return {
    id: message._id,
    senderId: message.senderId,
    receiverId: message.receiverId,
    message: message.message,
    messageType: message.messageType,
    chatType: message.chatType,
    isRead: message.isRead,
    timestamp: message.timestamp,
    conversationId: message.conversationId,
    roomId: message.roomId
  };
}

export default {
  generateConversationId,
  getOneToOneRoomName,
  getAdminSupportRoomName,
  validateMessageData,
  formatMessageForClient
};
