/**
 * Chat utility functions for WebSocket communication
 */

// Message types to match backend
export const MESSAGE_TYPES = {
  TEXT: 'text',
  CHALLENGE_JOIN: 'challenge_join',
  CHALLENGE_COMPLETE: 'challenge_complete',
  USER_JOIN: 'user_join',
  BADGE_EARNED: 'badge_earned',
  SYSTEM: 'system',
  RECRUITMENT: 'recruitment',
  REACTION: 'reaction',
  ATTACHMENT: 'attachment',
  MENTION: 'mention'
};

// Global WebSocket connection
// Define on window for cross-module access if needed
if (typeof window !== 'undefined') {
  window.chatSocket = window.chatSocket || null;
  // Initialize tracking for channel mentions
  window.channelMentions = window.channelMentions || {};
}
let reconnectTimer = null;

/**
 * Get token from cookies
 * @returns {string|null} - Token from cookies or null if not found
 */
const getCookieToken = () => {
  try {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; idToken=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  } catch (error) {
    console.error('[CHAT] Error getting token from cookies:', error);
    return null;
  }
};

/**
 * Get the WebSocket object safely
 * @returns {WebSocket|null} - The WebSocket instance or null
 */
const getWebSocketInternal = () => {
  if (typeof window === 'undefined') return null;
  return window.chatSocket;
};

/**
 * Create a WebSocket connection to the chat server
 * @param {Function} messageHandler - Callback for incoming messages
 * @param {Function} onConnect - Callback for successful connection
 * @param {Function} onDisconnect - Callback for disconnection
 * @param {Function} onError - Callback for connection errors
 * @returns {boolean} - True if connection initiated, false otherwise
 */
export function connectToChat(
  messageHandler,
  onConnect = () => {},
  onDisconnect = () => {},
  onError = () => {}
) {
  try {
    if (typeof window === 'undefined') {
      console.error('[CHAT] Window is undefined, cannot create WebSocket');
      return false;
    }
    
    // If already connected, don't reconnect
    if (window.chatSocket && window.chatSocket.readyState === WebSocket.OPEN) {
      console.log('[CHAT] WebSocket already connected');
      onConnect();
      return true;
    }
    
    // Close existing socket if it exists but isn't open
    if (window.chatSocket) {
      try {
        window.chatSocket.close();
        window.chatSocket = null;
      } catch (e) {
        console.error('[CHAT] Error closing existing WebSocket:', e);
      }
    }
    
    if (reconnectTimer) {
      console.log('[CHAT] Clearing reconnect timer');
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
    
    // Determine WebSocket URL based on environment or fallback
    const wsUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL || (() => {
      // Determine WebSocket URL based on current protocol
      const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
      // Get the base API URL without http/https prefix
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/^https?:\/\//, '') || 'ctfguide.com';
      // Construct WebSocket URL with /chat path
      return `${protocol}://${apiBaseUrl}/chat`;
    })();
    
    console.log(`[CHAT] Connecting to chat server at ${wsUrl}`);
    window.chatSocket = new WebSocket(wsUrl);
    
    window.chatSocket.onopen = () => {
      console.log('[CHAT] WebSocket connection established');
      
      // Authenticate immediately after connection
      const token = getCookieToken() || localStorage.getItem('idToken');
      if (token) {
        console.log('[CHAT] Sending authentication token');
        window.chatSocket.send(JSON.stringify({
          type: 'auth',
          token
        }));
      } else {
        console.error('[CHAT] No authentication token found');
        onError('No authentication token found');
      }
      
      onConnect();
    };
    
    window.chatSocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('[CHAT] Received message:', data);
        messageHandler(data);
      } catch (error) {
        console.error('[CHAT] Error parsing WebSocket message:', error);
        onError('Error parsing server response');
      }
    };
    
    window.chatSocket.onclose = (event) => {
      console.log(`[CHAT] WebSocket connection closed with code: ${event.code}`);
      window.chatSocket = null;
      onDisconnect();
      
      // Attempt to reconnect after a delay, but only if not closed intentionally
      if (event.code !== 1000) {
        console.log('[CHAT] Scheduling reconnect attempt in 3 seconds');
        reconnectTimer = setTimeout(() => {
          if (typeof window !== 'undefined' && !document.hidden) {
            console.log('[CHAT] Attempting to reconnect...');
            connectToChat(messageHandler, onConnect, onDisconnect, onError);
          }
        }, 3000);
      }
    };
    
    window.chatSocket.onerror = (error) => {
      console.error('[CHAT] WebSocket error:', error);
      onError('Connection error');
    };
    
    return true;
  } catch (error) {
    console.error('[CHAT] Error connecting to WebSocket server:', error);
    onError(`Connection error: ${error.message}`);
    return false;
  }
}

/**
 * Join a chat channel
 * @param {string} channelId - Channel to join
 * @returns {boolean} - True if request sent, false otherwise
 */
export function joinChannel(channelId) {
  try {
    if (!channelId) {
      console.error('[CHAT] Cannot join channel: No channel ID provided');
      return false;
    }
    
    const socket = getWebSocketInternal();
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.error('[CHAT] Cannot join channel: WebSocket is not connected');
      return false;
    }
    
    // Log for debugging
    console.log(`[CHAT] Joining channel: ${channelId}`);
    
    // Create message with channel name for easier debugging
    const message = {
      type: 'join_channel',
      channel: channelId,
      channelName: channelId
    };
    
    // Send message as JSON
    socket.send(JSON.stringify(message));
    
    // Track the current channel in a global state
    if (typeof window !== 'undefined') {
      window.currentChannel = channelId;
      
      // Store last attempted channel for debugging
      window.lastAttemptedChannel = channelId;
      window.lastAttemptTime = new Date().toISOString();
    }
    
    return true;
  } catch (error) {
    console.error('[CHAT] Error joining channel:', error);
    return false;
  }
}

/**
 * Send a text message
 * @param {string} channelId - Channel to send to
 * @param {string} content - Message content
 * @param {Array<string>} mentions - Optional array of usernames mentioned in the message
 * @returns {boolean} - True if message sent, false otherwise
 */
export const sendMessage = (channelId, content, mentions = []) => {
  // Enhanced debugging and validation
  if (!channelId) {
    console.error('[CHAT] Cannot send message: No channel ID provided');
    return false;
  }
  
  const socket = getWebSocketInternal();
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    console.error(`[CHAT] WebSocket not connected, cannot send message to channel ${channelId}`);
    return false;
  }
  
  // Log the complete message details
  console.log(`[CHAT] Sending message to channel "${channelId}": ${content.substring(0, 30)}${content.length > 30 ? '...' : ''}`);
  
  // Include any detected mentions
  if (mentions && mentions.length > 0) {
    console.log(`[CHAT] Message contains mentions: ${mentions.join(', ')}`);
  }
  
  // Create the message payload
  const messagePayload = {
    type: 'message',
    messageType: MESSAGE_TYPES.TEXT,
    channel: channelId,
    content,
    mentions: mentions.length > 0 ? mentions : undefined
  };
  
  // Log the payload for debugging
  console.log('[CHAT] Message payload:', JSON.stringify(messagePayload));
  
  try {
    // Send the message
    socket.send(JSON.stringify(messagePayload));
    
    // Store last sent message info for debugging
    if (typeof window !== 'undefined') {
      window.lastMessageSent = {
        channel: channelId,
        time: new Date().toISOString(),
        contentPreview: content.substring(0, 30),
        mentions
      };
    }
    
    return true;
  } catch (error) {
    console.error(`[CHAT] Error sending message to channel ${channelId}:`, error);
    return false;
  }
};

/**
 * Send a recruitment message
 * @param {string} channelId - Channel to send to
 * @param {string} content - Message content
 * @param {object} recruitment - Recruitment data
 * @returns {boolean} - True if message sent, false otherwise
 */
export const sendRecruitment = (channelId, content, recruitment) => {
  const socket = getWebSocketInternal();
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    console.error('[CHAT] WebSocket not connected, cannot send recruitment');
    return false;
  }
  
  console.log(`[CHAT] Sending recruitment to channel ${channelId}`);
  socket.send(JSON.stringify({
    type: 'message',
    messageType: MESSAGE_TYPES.RECRUITMENT,
    channel: channelId,
    content,
    recruitment
  }));
  
  return true;
};

/**
 * Send an activity message (challenge join, challenge complete, etc.)
 * @param {string} channelId - Channel to send to
 * @param {string} activityType - Activity type from MESSAGE_TYPES
 * @param {object} data - Additional activity data
 * @returns {boolean} - True if activity sent, false otherwise
 */
export const sendActivity = (channelId, activityType, data = {}) => {
  const socket = getWebSocketInternal();
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    console.error('[CHAT] WebSocket not connected, cannot send activity');
    return false;
  }
  
  console.log(`[CHAT] Sending activity of type ${activityType} to channel ${channelId}`);
  socket.send(JSON.stringify({
    type: 'activity',
    activityType,
    channel: channelId,
    ...data
  }));
  
  return true;
};

/**
 * Check if WebSocket is connected
 * @returns {boolean} - True if connected, false otherwise
 */
export function isConnected() {
  const socket = getWebSocketInternal();
  return socket && socket.readyState === WebSocket.OPEN;
}

/**
 * Close the WebSocket connection
 */
export const closeConnection = () => {
  const socket = getWebSocketInternal();
  if (socket) {
    console.log('[CHAT] Manually closing WebSocket connection');
    socket.close(1000, 'User navigated away');
    if (typeof window !== 'undefined') {
      window.chatSocket = null;
    }
  }
  
  if (reconnectTimer) {
    console.log('[CHAT] Clearing reconnect timer');
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
};

/**
 * Manually refresh a channel's message history
 * @param {string} channelId - Channel to refresh
 * @returns {boolean} - True if refresh request sent, false otherwise
 */
export function refreshChannel(channelId) {
  try {
    const socket = getWebSocketInternal();
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.error('[CHAT] Cannot refresh channel: WebSocket is not connected');
      return false;
    }
    
    console.log(`[CHAT] Manually refreshing channel: ${channelId}`);
    socket.send(JSON.stringify({
      type: 'refresh_channel',
      channel: channelId
    }));
    
    return true;
  } catch (error) {
    console.error('[CHAT] Error refreshing channel:', error);
    return false;
  }
}

/**
 * Add a reaction to a message
 * @param {string} channelId - Channel the message is in
 * @param {string} messageId - ID of the message to react to
 * @param {string} emoji - Emoji reaction to add
 * @returns {boolean} - True if reaction sent, false otherwise
 */
export const addReaction = (channelId, messageId, emoji) => {
  const socket = getWebSocketInternal();
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    console.error(`[CHAT] WebSocket not connected, cannot add reaction to message in channel ${channelId}`);
    return false;
  }
  
  console.log(`[CHAT] Adding reaction ${emoji} to message ${messageId} in channel ${channelId}`);
  
  // Create the reaction payload
  const reactionPayload = {
    type: 'reaction',
    channel: channelId,
    messageId: messageId,
    emoji: emoji
  };
  
  try {
    // Send the reaction
    socket.send(JSON.stringify(reactionPayload));
    
    return true;
  } catch (error) {
    console.error(`[CHAT] Error adding reaction to message in channel ${channelId}:`, error);
    return false;
  }
};

/**
 * Remove a reaction from a message
 * @param {string} channelId - Channel the message is in
 * @param {string} messageId - ID of the message to remove reaction from
 * @param {string} emoji - Emoji reaction to remove
 * @returns {boolean} - True if removal sent, false otherwise
 */
export const removeReaction = (channelId, messageId, emoji) => {
  const socket = getWebSocketInternal();
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    console.error(`[CHAT] WebSocket not connected, cannot remove reaction from message in channel ${channelId}`);
    return false;
  }
  
  console.log(`[CHAT] Removing reaction ${emoji} from message ${messageId} in channel ${channelId}`);
  
  // Create the remove reaction payload
  const removeReactionPayload = {
    type: 'remove_reaction',
    channel: channelId,
    messageId: messageId,
    emoji: emoji
  };
  
  try {
    // Send the remove reaction request
    socket.send(JSON.stringify(removeReactionPayload));
    
    return true;
  } catch (error) {
    console.error(`[CHAT] Error removing reaction from message in channel ${channelId}:`, error);
    return false;
  }
};

/**
 * Upload a file to Cloudflare Images and send as message attachment
 * @param {string} channelId - Channel to send attachment to
 * @param {File} file - File to upload
 * @param {string} caption - Optional caption for the attachment
 * @returns {Promise<boolean>} - Promise that resolves to true if successful, false otherwise
 */
export const sendAttachment = async (channelId, file, caption = '') => {
  try {
    if (!channelId) {
      console.error('[CHAT] Cannot send attachment: No channel ID provided');
      return false;
    }
    
    const socket = getWebSocketInternal();
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.error(`[CHAT] WebSocket not connected, cannot send attachment to channel ${channelId}`);
      return false;
    }
    
    console.log(`[CHAT] Uploading attachment to channel ${channelId}: ${file.name} (${file.size} bytes)`);
    
    // Get authentication token
    const token = getCookieToken() || localStorage.getItem('idToken');
    if (!token) {
      console.error('[CHAT] No authentication token found for file upload');
      return false;
    }
    
    // Create FormData and append file
    const formData = new FormData();
    formData.append('image', file);
    
    // Direct upload approach
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
    const uploadResponse = await fetch(`${apiUrl}/upload-chat-image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    // Check if upload was successful
    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      throw new Error(`Upload failed: ${uploadResponse.status} ${errorText}`);
    }
    
    // Parse response
    const result = await uploadResponse.json();
    console.log('[CHAT] Upload response:', result);
    
    if (!result.imageUrl) {
      throw new Error('Invalid response from server: Missing image URL');
    }
    
    // Set the lastUploadedUrl on the file object so we can reference it later
    // This is a crucial part of our temporary workaround
    file.lastUploadedUrl = result.imageUrl;
    
    // Also store in localStorage immediately as a backup
    try {
      if (typeof window !== 'undefined') {
        const tempMsgId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
        const storedUrls = JSON.parse(localStorage.getItem('ctfguide_image_urls') || '{}');
        storedUrls[tempMsgId] = result.imageUrl;
        localStorage.setItem('ctfguide_image_urls', JSON.stringify(storedUrls));
        console.log('[CHAT] Saved image URL to localStorage:', tempMsgId, result.imageUrl);
      }
    } catch (err) {
      console.error('[CHAT] Error saving URL to localStorage:', err);
    }
    
    // Create attachment message payload
    const attachmentPayload = {
      type: 'message',
      messageType: MESSAGE_TYPES.ATTACHMENT,
      channel: channelId,
      content: caption,
      url: result.imageUrl, // Add URL directly to the message for redundancy
      imageUrl: result.imageUrl, // Add imageUrl directly to the message for redundancy
      // Including both property naming formats for compatibility during transition
      attachment: {
        url: result.imageUrl,
        filename: file.name,  
        fileName: file.name,  
        size: file.size,      
        fileSize: file.size,  
        type: file.type,      
        fileType: file.type   
      }
    };
    
    console.log('[CHAT] File uploaded successfully, full payload:', JSON.stringify(attachmentPayload));
    
    // Send the attachment message through WebSocket
    socket.send(JSON.stringify(attachmentPayload));
    
    return true;
  } catch (error) {
    console.error(`[CHAT] Error sending attachment to channel ${channelId}:`, error);
    return false;
  }
};

/**
 * Join a team via recruitment message
 * @param {string} channelId - Channel with the recruitment message
 * @param {string} messageId - ID of the recruitment message
 * @returns {boolean} - True if request sent, false otherwise
 */
export const joinTeam = (channelId, messageId) => {
  const socket = getWebSocketInternal();
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    console.error(`[CHAT] WebSocket not connected, cannot join team in channel ${channelId}`);
    return false;
  }
  
  console.log(`[CHAT] Joining team from message ${messageId} in channel ${channelId}`);
  
  // Create the join team payload
  const joinTeamPayload = {
    type: 'join_team',
    channel: channelId,
    messageId: messageId
  };
  
  try {
    // Send the join team request
    socket.send(JSON.stringify(joinTeamPayload));
    
    return true;
  } catch (error) {
    console.error(`[CHAT] Error joining team in channel ${channelId}:`, error);
    return false;
  }
};

/**
 * Leave a team via recruitment message
 * @param {string} channelId - Channel with the recruitment message
 * @param {string} messageId - ID of the recruitment message
 * @returns {boolean} - True if request sent, false otherwise
 */
export const leaveTeam = (channelId, messageId) => {
  const socket = getWebSocketInternal();
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    console.error(`[CHAT] WebSocket not connected, cannot leave team in channel ${channelId}`);
    return false;
  }
  
  console.log(`[CHAT] Leaving team from message ${messageId} in channel ${channelId}`);
  
  // Create the leave team payload
  const leaveTeamPayload = {
    type: 'leave_team',
    channel: channelId,
    messageId: messageId
  };
  
  try {
    // Send the leave team request
    socket.send(JSON.stringify(leaveTeamPayload));
    
    return true;
  } catch (error) {
    console.error(`[CHAT] Error leaving team in channel ${channelId}:`, error);
    return false;
  }
};

// Update the getWebSocket function to return window.chatSocket
export function getWebSocket() {
  if (typeof window === 'undefined') return null;
  return window.chatSocket;
}

/**
 * Check if a message contains a mention of the specified user
 * @param {Object} message - The message to check for mentions
 * @param {string} username - The username to check for
 * @returns {boolean} - True if the user is mentioned, false otherwise
 */
export function wasUserMentioned(message, username) {
  if (!message || !username) return false;
  
  // Check explicit mentions array if it exists
  if (message.mentions && Array.isArray(message.mentions)) {
    if (message.mentions.some(mentioned => mentioned.toLowerCase() === username.toLowerCase())) {
      return true;
    }
  }
  
  // Check message content for @username
  if (message.content) {
    const mentionRegex = new RegExp(`@${username}\\b`, 'i');
    return mentionRegex.test(message.content);
  }
  
  return false;
}

/**
 * Mark a channel as having a mention for the current user
 * @param {string} channelId - ID of the channel with the mention
 */
export function addChannelMention(channelId) {
  if (typeof window === 'undefined') return;
  
  console.log(`[CHAT] Adding mention for channel ${channelId}`);
  window.channelMentions[channelId] = true;
  
  // Dispatch an event to notify components about the mention
  const event = new CustomEvent('chatMentionUpdate', {
    detail: { channelId, hasMention: true }
  });
  window.dispatchEvent(event);
  
  // Store mentions in localStorage for persistence across page loads
  try {
    const mentions = JSON.parse(localStorage.getItem('channelMentions') || '{}');
    mentions[channelId] = true;
    localStorage.setItem('channelMentions', JSON.stringify(mentions));
  } catch (error) {
    console.error('[CHAT] Error saving mentions to localStorage:', error);
  }
}

/**
 * Clear mentions for a specific channel
 * @param {string} channelId - ID of the channel to clear mentions for
 */
export function clearChannelMention(channelId) {
  if (typeof window === 'undefined') return;
  
  console.log(`[CHAT] Clearing mention for channel ${channelId}`);
  delete window.channelMentions[channelId];
  
  // Dispatch an event to notify components about the mention change
  const event = new CustomEvent('chatMentionUpdate', {
    detail: { channelId, hasMention: false }
  });
  window.dispatchEvent(event);
  
  // Update localStorage
  try {
    const mentions = JSON.parse(localStorage.getItem('channelMentions') || '{}');
    delete mentions[channelId];
    localStorage.setItem('channelMentions', JSON.stringify(mentions));
  } catch (error) {
    console.error('[CHAT] Error updating mentions in localStorage:', error);
  }
}

/**
 * Check if a channel has unread mentions
 * @param {string} channelId - ID of the channel to check
 * @returns {boolean} - True if the channel has mentions, false otherwise
 */
export function hasChannelMention(channelId) {
  if (typeof window === 'undefined') return false;
  
  // First check the window object
  if (window.channelMentions && window.channelMentions[channelId]) {
    return true;
  }
  
  // Then check localStorage for persistence
  try {
    const mentions = JSON.parse(localStorage.getItem('channelMentions') || '{}');
    return !!mentions[channelId];
  } catch (error) {
    console.error('[CHAT] Error reading mentions from localStorage:', error);
    return false;
  }
}

/**
 * Initialize mention tracking from localStorage
 * This should be called during application startup
 */
export function initializeMentions() {
  if (typeof window === 'undefined') return;
  
  console.log('[CHAT] Initializing mention tracking');
  window.channelMentions = {};
  
  try {
    const mentions = JSON.parse(localStorage.getItem('channelMentions') || '{}');
    Object.keys(mentions).forEach(channelId => {
      if (mentions[channelId]) {
        window.channelMentions[channelId] = true;
        
        // Notify listeners about the existing mentions
        const event = new CustomEvent('chatMentionUpdate', {
          detail: { channelId, hasMention: true }
        });
        window.dispatchEvent(event);
      }
    });
  } catch (error) {
    console.error('[CHAT] Error loading mentions from localStorage:', error);
  }
}

// Make sure the initialization happens when the module is loaded
if (typeof window !== 'undefined') {
  // Initialize mentions on the next tick to ensure window is fully loaded
  setTimeout(() => {
    initializeMentions();
  }, 0);
}

// Add function to get all channels with mentions
export const getChannelsWithMentions = () => {
  if (typeof window === 'undefined') return [];
  
  window.channelMentions = window.channelMentions || {};
  return Object.keys(window.channelMentions).filter(channelId => window.channelMentions[channelId]);
}; 