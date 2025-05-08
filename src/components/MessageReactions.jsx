import React, { useState, useRef, useEffect } from 'react';
import { addReaction, removeReaction } from '@/utils/chat';

// Common emojis users might want to react with
const COMMON_EMOJIS = ['👍', '👎', '❤️', '🔥', '😂', '😮', '😢', '🎉', '🚀', '💯', '👀', '🤔'];

const MessageReactions = ({ message, channelId, currentUser }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);
  
  // Initialize reactions from the message
  const reactions = message.reactions || {};
  
  // Handle clicking outside to close the emoji picker
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Add a reaction to the message
  const handleAddReaction = (emoji) => {
    addReaction(channelId, message.id, emoji);
    setShowEmojiPicker(false);
  };
  
  // Remove a reaction from the message
  const handleRemoveReaction = (emoji) => {
    removeReaction(channelId, message.id, emoji);
  };
  
  // Check if the current user has reacted with a specific emoji
  const hasUserReacted = (emoji) => {
    return reactions[emoji] && reactions[emoji].includes(currentUser);
  };
  
  // Toggle a reaction - add if not present, remove if already added
  const toggleReaction = (emoji) => {
    if (hasUserReacted(emoji)) {
      handleRemoveReaction(emoji);
    } else {
      handleAddReaction(emoji);
    }
  };
  
  // Count the total number of reactions
  const getTotalReactions = () => {
    return Object.values(reactions).reduce((total, users) => total + users.length, 0);
  };
  
  return (
    <div className="mt-1 flex flex-wrap items-center">
      {/* Existing reactions */}
      {Object.entries(reactions).map(([emoji, users]) => (
        users.length > 0 && (
          <button
            key={emoji}
            onClick={() => toggleReaction(emoji)}
            className={`mr-1 mb-1 px-2 py-0.5 rounded-full text-xs flex items-center ${
              hasUserReacted(emoji) 
                ? 'bg-blue-600/50 hover:bg-blue-700/50' 
                : 'bg-neutral-700/50 hover:bg-neutral-600/50'
            }`}
            title={`${users.join(', ')}`}
          >
            <span className="mr-1">{emoji}</span>
            <span>{users.length}</span>
          </button>
        )
      ))}
      
      {/* Add reaction button */}
      <div className="relative" ref={emojiPickerRef}>
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="text-neutral-500 hover:text-neutral-300 mb-1 ml-1 text-xs px-2 py-0.5 rounded-full bg-neutral-800/50 hover:bg-neutral-700/50"
        >
          <i className="fas fa-smile mr-1"></i>
          <span>Add Reaction</span>
        </button>
        
        {/* Emoji picker */}
        {showEmojiPicker && (
          <div className="absolute z-10 mt-1  pr-6 mx-auto  text-center w-40 bg-neutral-800 border border-neutral-700 rounded shadow-lg">
            <div className="grid grid-cols-6 gap-x-4">
              {COMMON_EMOJIS.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => handleAddReaction(emoji)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-neutral-700 rounded "
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageReactions; 