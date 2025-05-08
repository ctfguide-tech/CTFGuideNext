import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import { Context } from '@/context';
import { useContext } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import request from '@/utils/request';
import { 
  connectToChat, 
  joinChannel, 
  sendMessage, 
  sendRecruitment, 
  sendActivity, 
  closeConnection,
  isConnected,
  refreshChannel,
  MESSAGE_TYPES,
  getWebSocket,
  wasUserMentioned,
  addChannelMention,
  clearChannelMention,
  hasChannelMention,
  initializeMentions
} from '@/utils/chat';
import MessageReactions from '@/components/MessageReactions';
import MessageAttachment from '@/components/MessageAttachment';
import { sendAttachment, joinTeam, leaveTeam } from '@/utils/chat';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Predefined channels
const PREDEFINED_CHANNELS = [
  { id: 'announcements', name: 'Announcements', description: 'Official announcements from the CTFGuide team', icon: 'fa-bullhorn' },
  { id: 'general', name: 'General', description: 'General discussion about CTFGuide', icon: 'fa-comments' },
  { id: 'help', name: 'Help', description: 'Get help with challenges and CTFs', icon: 'fa-question-circle' },
  { id: 'introductions', name: 'Introductions', description: 'Introduce yourself to the community', icon: 'fa-handshake' },
  { id: 'ctf-events', name: 'CTF Events', description: 'Discuss upcoming CTF events', icon: 'fa-calendar-alt' }
];

export default function Community() {
  const { username, role } = useContext(Context);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [activeChannelId, setActiveChannelId] = useState('general');
  const [isLoading, setIsLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [showRecruitmentForm, setShowRecruitmentForm] = useState(false);
  const [recruitmentData, setRecruitmentData] = useState({
    challengeName: '',
    challengeId: '',
    slots: 2,
    difficulty: 'medium',
    description: ''
  });
  const [connected, setConnected] = useState(false);
  const [wsError, setWsError] = useState(null);
  const messagesEndRef = useRef(null);
  const [pendingChannel, setPendingChannel] = useState(null);
  const pendingChannelRef = useRef(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [fileToUpload, setFileToUpload] = useState(null);
  const [uploadCaption, setUploadCaption] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const fileInputRef = useRef(null);
  const [mentionCounts, setMentionCounts] = useState({});
  const mentionSoundRef = useRef(null);
  
  // User profile card state
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [profileUser, setProfileUser] = useState(null);
  const [profileCardPosition, setProfileCardPosition] = useState({ top: 0, left: 0 });
  const [loadingProfile, setLoadingProfile] = useState(false);
  
  // Handle profile click to show user card
  const handleProfileClick = async (user, event) => {
    event.preventDefault();
    event.stopPropagation();
    
    // Always calculate position from the current click event
    const rect = event.currentTarget.getBoundingClientRect();
    
    // Calculate position to ensure the card stays within viewport
    let left = rect.left + window.scrollX;
    const top = rect.bottom + window.scrollY + 5; // Add small gap
    
    // Adjust horizontal position to keep card within viewport
    const viewportWidth = window.innerWidth;
    const cardWidth = 320; // matches the w-80 class (320px)
    
    if (left + cardWidth > viewportWidth) {
      // If card would overflow right edge, align right edge of card with right edge of profile pic
      left = Math.max(0, rect.right + window.scrollX - cardWidth);
    }
    
    // Always update the position state first
    setProfileCardPosition({ top, left });
    
    // If clicking on the same user, toggle the card
    if (profileUser && profileUser.username === user.username && showProfileCard) {
      setShowProfileCard(false);
      return;
    }
    
    // Show card with basic info immediately
    setProfileUser(user);
    setShowProfileCard(true);
    setLoadingProfile(true);
  // Handle profile click to show user card
  const handleProfileClick = async (user, event) => {
    event.preventDefault();
    event.stopPropagation();
    
    // Always calculate position from the current click event
    const rect = event.currentTarget.getBoundingClientRect();
    
    // Calculate position to ensure the card stays within viewport
    let left = rect.left + window.scrollX;
    const top = rect.bottom + window.scrollY + 5; // Add small gap
    
    // Adjust horizontal position to keep card within viewport
    const viewportWidth = window.innerWidth;
    const cardWidth = 320; // matches the w-80 class (320px)
    
    if (left + cardWidth > viewportWidth) {
      // If card would overflow right edge, align right edge of card with right edge of profile pic
      left = Math.max(0, rect.right + window.scrollX - cardWidth);
    }
    
    // Always update the position state first
    setProfileCardPosition({ top, left });
    
    // If clicking on the same user, toggle the card
    if (profileUser && profileUser.username === user.username && showProfileCard) {
      setShowProfileCard(false);
      return;
    }
    
    // Show card with basic info immediately
    setProfileUser(user);
    setShowProfileCard(true);
    setLoadingProfile(true);
    
    try {
      // Fetch comprehensive user data from API using the correct request format
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
      
      const profileData = await request(
        `${apiUrl}/users/${user.username}`,
        'GET',
        null
      );
      
      // Basic user data loaded, update with more details gradually
      if (profileData) {
        const userData = {
          ...user,
          ...profileData,
          badges: [],
          points: 0,
          challengesSolved: 0,
          isLoading: false
        };
        
        setProfileUser(userData);
        
        // Now fetch additional data
        try {
          const badges = await request(
            `${apiUrl}/users/${user.username}/badges`,
            'GET',
            null
          );
          
          if (badges) {
            setProfileUser(prev => ({
              ...prev,
              badges: badges
            }));
          }
        } catch (error) {
          console.log("Failed to fetch badges", error);
        }
        
        try {
          const pointsData = await request(
            `${apiUrl}/users/${user.username}/points`,
            'GET',
            null
          );
          
          if (pointsData && pointsData.totalPoints) {
            setProfileUser(prev => ({
              ...prev,
              points: pointsData.totalPoints
            }));
          }
        } catch (error) {
          console.log("Failed to fetch points", error);
        }
        
        try {
          const solvedChallenges = await request(
            `${apiUrl}/users/${user.username}/solvedChallenges`,
            'GET',
            null
          );
          
          if (solvedChallenges) {
            const totalSolved = 
              (solvedChallenges.beginnerChallenges?.length || 0) +
              (solvedChallenges.easyChallenges?.length || 0) +
              (solvedChallenges.mediumChallenges?.length || 0) +
              (solvedChallenges.hardChallenges?.length || 0) +
              (solvedChallenges.insaneChallenges?.length || 0);
            
            setProfileUser(prev => ({
              ...prev,
              challengesSolved: totalSolved
            }));
          }
        } catch (error) {
          console.log("Failed to fetch solved challenges", error);
        }
      }
    } catch (error) {
      console.error('[PROFILE] Error fetching user profile:', error);
    } finally {
      setLoadingProfile(false);
    }
  };
  };
  
  // Function to close the profile card
  const closeProfileCard = () => {
    setShowProfileCard(false);
  };
  
  // Get the active channel details from predefined channels
  const activeChannel = PREDEFINED_CHANNELS.find(channel => channel.id === activeChannelId) || PREDEFINED_CHANNELS[0];

  // Update the function to handle missing sound file
  const playMentionSound = () => {
    try {
      if (mentionSoundRef.current) {
        // First try playing the sound file
        mentionSoundRef.current.currentTime = 0;
        mentionSoundRef.current.volume = 0.5;
        
        // Play the sound, but handle any errors with a fallback
        mentionSoundRef.current.play().catch(err => {
          console.log('[CHAT] Could not play sound file, using fallback:', err);
          // Use Web Audio API as fallback if the file doesn't exist
          playFallbackSound();
        });
      } else {
        // If sound reference doesn't exist, use Web Audio API
        playFallbackSound();
      }
    } catch (error) {
      console.error('[CHAT] Error playing mention sound:', error);
      // Try the fallback as a last resort
      playFallbackSound();
    }
  };

  // Add a fallback sound using Web Audio API
  const playFallbackSound = () => {
    try {
      // Create an AudioContext
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Create an oscillator for a simple "ping" sound
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      // Connect nodes
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Set type and frequency for a pleasant notification tone
      oscillator.type = 'sine';
      oscillator.frequency.value = 880; // A5 note
      
      // Create a short fade in/out envelope
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      // Play the sound
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.error('[CHAT] Error playing fallback sound:', error);
    }
  };

  // Update the useEffect to handle cases where the sound file might not exist
  useEffect(() => {
    // Create audio element for mention notification
    if (typeof window !== 'undefined') {
      try {
        mentionSoundRef.current = new Audio('/sounds/mention.mp3');
        
        // Handle errors loading the sound file
        mentionSoundRef.current.addEventListener('error', (e) => {
          console.warn('[CHAT] Sound file could not be loaded, will use fallback sound');
          mentionSoundRef.current = null;
        });
        
        // Initialize mentions from localStorage
        initializeMentions();
        
        // Try to preload the sound
        if (mentionSoundRef.current) {
          mentionSoundRef.current.load();
        }
      } catch (error) {
        console.warn('[CHAT] Error setting up sound:', error);
        mentionSoundRef.current = null;
      }
    }
    
    return () => {
      // Clean up audio element
      if (mentionSoundRef.current) {
        mentionSoundRef.current = null;
      }
    };
  }, []);
  
  // Handle WebSocket messages with improved channel handling
  const handleWebSocketMessage = (data) => {
    switch (data.type) {
      case 'auth_success':
        console.log('[CHAT] Authentication successful', data.user);
        // Check if we have a pending channel request in EITHER state or ref
        const pendingChan = pendingChannelRef.current || pendingChannel;
        if (pendingChan) {
          console.log(`[CHAT] Joining pending channel after auth: ${pendingChan} (ref: ${pendingChannelRef.current})`);
          joinChannel(pendingChan);
        } else {
          // Join the active channel if no pending request
          console.log(`[CHAT] Joining active channel after auth: ${activeChannelId}`);
          joinChannel(activeChannelId);
        }
        break;
        
      case 'auth_error':
        console.error('[CHAT] Authentication error:', data.error);
        setWsError(`Authentication error: ${data.error}`);
        setPendingChannel(null);
        pendingChannelRef.current = null; // Clear ref too
        toast.error(`Authentication error: ${data.error}`);
        break;
        
      case 'channel_history':
        // Get pending channel from EITHER ref or state
        const currentPendingChannel = pendingChannelRef.current || pendingChannel;
        
        console.log(`[CHAT] Received history for ${data.channel} with ${data.messages?.length || 0} messages (pendingChannel: ${pendingChannel}, pendingRef: ${pendingChannelRef.current}, activeChannel: ${activeChannelId})`);
        
        // Accept messages for either the active channel or a pending channel request from EITHER ref or state
        if (data.channel === activeChannelId || data.channel === currentPendingChannel) {
          console.log(`[CHAT] Processing history for channel: ${data.channel} (pending: ${currentPendingChannel})`);
          
          // IMPORTANT: First update the active channel, then set messages
          // This ensures messages are sent to the correct channel
          if (data.channel === currentPendingChannel) {
            console.log(`[CHAT] Channel history complete - UPDATING activeChannelId from ${activeChannelId} to ${data.channel}`);
            
            // Immediately update the active channel to ensure message sending works
            setActiveChannelId(data.channel);
            setPendingChannel(null);
            pendingChannelRef.current = null; // Clear ref too
            
            // Store this in window for debugging
            if (typeof window !== 'undefined') {
              window.lastChannelSwitch = {
                from: activeChannelId,
                to: data.channel,
                time: new Date().toISOString()
              };
            }
          }
          
          if (Array.isArray(data.messages) && data.messages.length > 0) {
            setMessages(data.messages);
            setIsLoading(false);
          } else {
            console.warn(`[CHAT] Received empty history for ${data.channel}`);
            setMessages([{
              id: `empty_${Date.now()}`,
              type: 'system',
              content: `No messages yet in #${data.channel}. Be the first to start a conversation!`,
              createdAt: new Date().toISOString()
            }]);
            setIsLoading(false);
          }
        } else {
          console.log(`[CHAT] Ignoring history for ${data.channel}, active channel is ${activeChannelId}, pending is ${currentPendingChannel}`);
        }
        break;
        
      case 'message':
        // Add the channel ID to the message object for better tracking
        if (data.message && !data.message.channelId) {
          data.message.channelId = data.channel;
        }
        
        // Make sure we're only processing messages for the active channel
        if (data.channel === activeChannelId && data.message) {
          console.log(`[CHAT] Received message for channel ${data.channel} (active: ${activeChannelId})`);
          
          // Check for mentions in the message
          if (username && data.message.content && data.message.content.includes(`@${username}`)) {
            console.log(`[CHAT] User ${username} was mentioned in channel ${data.channel}`);
            
            // If this is the current channel, we'll immediately mark it as read
            // Otherwise, we'll mark the channel as having a notification
            if (data.channel !== activeChannelId) {
              addChannelMention(data.channel);
              
              // Play sound notification
              playMentionSound();
              
              // Show a toast notification for the mention
              toast.info(`You were mentioned in #${data.channel}`, {
                onClick: () => handleChannelSelect(data.channel)
              });
            }
          }
          
          // Double check that this message belongs to the current channel
          if (data.message.channelId !== activeChannelId) {
            console.error(`[CHAT] Channel mismatch: Message for ${data.message.channelId} received in ${activeChannelId}`);
            return; // Skip this message
          }
          
          // Check for duplicates and replace temporary messages
          setMessages(prevMessages => {
            // Check if this message already exists
            if (prevMessages.some(msg => !msg.isTemporary && msg.id === data.message.id)) {
              return prevMessages; // Message already exists
            }
            
            // Check if there's a temporary message from the same sender with similar content
            // This handles replacing our optimistically added messages with real ones
            const tempIndex = prevMessages.findIndex(msg => 
              msg.isTemporary && 
              msg.sender.username === data.message.sender.username &&
              msg.content === data.message.content
            );
            
            if (tempIndex >= 0) {
              // Replace the temporary message with the real one
              const newMessages = [...prevMessages];
              newMessages[tempIndex] = data.message;
              return newMessages;
            }
            
            // If not found, add as a new message
            return [...prevMessages, data.message];
          });
          
          // Scroll to bottom when receiving new messages
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
          }, 100);
        } else if (data.channel !== activeChannelId) {
          console.log(`[CHAT] Message for channel ${data.channel} (active: ${activeChannelId})`);
          
          // Check for mentions if this is a message for another channel
          if (username && data.message && data.message.content && wasUserMentioned(data.message, username)) {
            console.log(`[CHAT] User ${username} was mentioned in channel ${data.channel} while viewing ${activeChannelId}`);
            
            // Mark the channel as having a mention
            addChannelMention(data.channel);
            
            // Play sound notification
            playMentionSound();
            
            // Show a toast notification for the mention
            toast.info(`You were mentioned in #${data.channel}`, {
              onClick: () => handleChannelSelect(data.channel)
            });
          }
        }
        break;
        
      case 'error':
        console.error('[CHAT] WebSocket error:', data.error);
        toast.error(`Error: ${data.error}`);
        // Clear pending channel on error
        setPendingChannel(null);
        pendingChannelRef.current = null; // Clear ref too
        // If the error mentions channel loading, set isLoading to false
        if (data.error?.includes('channel') || data.error?.includes('history')) {
          setIsLoading(false);
          // Show a helpful message in the channel
          setMessages([{
            id: `error_${Date.now()}`,
            type: 'system',
            content: `Error: ${data.error}. Please try refreshing the page.`,
            createdAt: new Date().toISOString()
          }]);
        }
        break;
        
      case MESSAGE_TYPES.REACTION:
        // Update the message with the new reactions
        setMessages(prevMessages => {
          return prevMessages.map(msg => {
            if (msg.id === data.messageId) {
              // Update the message with the new reactions
              return {
                ...msg,
                reactions: data.reactions
              };
            }
            return msg;
          });
        });
        break;
        
      case MESSAGE_TYPES.SYSTEM:
        // If this is for the active channel, add the system message to the state
        if (data.channel === activeChannelId) {
          console.log(`[CHAT] Received system message for channel ${data.channel}`);
          setMessages(prevMessages => {
            // Create a system message object
            const systemMessage = {
              id: data.id || `system_${Date.now()}`,
            type: MESSAGE_TYPES.SYSTEM,
              content: data.content,
              createdAt: data.createdAt || new Date().toISOString(),
              // Add extra properties for announcements
              isAnnouncement: data.channel === 'announcements',
              styling: data.styling || {
                importance: 'normal',
                color: '#4a90e2',
                pinned: false
              }
            };
            
            // Add to messages
            return [...prevMessages, systemMessage];
          });
          
          // Scroll to bottom when receiving system messages
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
          }, 100);
        }
        break;
      
      case 'message_deleted':
        console.log(`[CHAT] Received message deletion event for message ${data.messageId}`);
        
        // Update the messages state to mark the message as deleted
        setMessages(prevMessages => {
          return prevMessages.map(msg => {
            if (msg.id === data.messageId) {
              // Mark the message as deleted
              return {
                ...msg,
                deleted: true,
                deletedAt: data.deletedAt,
                deletedBy: data.deletedBy
              };
            }
            return msg;
          });
        });
        break;
      
      case MESSAGE_TYPES.MENTION:
        console.log(`[CHAT] Received mention in channel ${data.channel} for message ${data.messageId}`);
        
        // Process the mention if it's for the current user
        if (data.username === username) {
          console.log(`[CHAT] User ${username} was mentioned in channel ${data.channel}`);
          
          // If this is not the active channel, mark it as having a mention
          if (data.channel !== activeChannelId) {
            addChannelMention(data.channel);
            
            // Play sound notification
            playMentionSound();
            
            // Show a toast notification
            toast.info(`You were mentioned in #${data.channel} by ${data.sender}`, {
              onClick: () => handleChannelSelect(data.channel)
            });
          }
        }
        break;
      
      default:
        console.warn('[CHAT] Unknown message type:', data.type);
    }
  };

  // Initialize WebSocket connection with better error handling
  useEffect(() => {
    // Initial connection when component mounts
    if (!connected && !wsError) {
      console.log('[CHAT] Setting up initial WebSocket connection');
      connectToChat(
        handleWebSocketMessage,
        () => {
          console.log('[CHAT] WebSocket connected successfully');
          setConnected(true);
          setWsError(null);
        },
        () => {
          console.log('[CHAT] WebSocket disconnected');
          setConnected(false);
        },
        (error) => {
          console.error('[CHAT] WebSocket error:', error);
          setWsError(error);
          setConnected(false);
        }
      );
    }
    
    // Clean up on component unmount
    return () => {
      console.log('[CHAT] Component unmounting, closing WebSocket connection');
      closeConnection();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Helper function to get cookie
  function getCookie(name) {
    if (typeof document === 'undefined') return null;
    
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Update handleSendMessage to process mentions when sending messages
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || sendingMessage) return;
    
    // Check if user is trying to post in announcements and is not an admin
    if (activeChannelId === 'announcements' && role !== 'ADMIN') {
      toast.error('Only administrators can post in the announcements channel');
      return;
    }
    
    setSendingMessage(true);
    
    // Log channel information for debugging
    console.log(`[CHAT] Sending message to channel: ${activeChannelId}`);
    
    // Scan for mentions in the message
    const mentionRegex = /@(\w+)/g;
    const mentions = [];
    let match;
    
    while ((match = mentionRegex.exec(inputMessage)) !== null) {
      mentions.push(match[1]);  // Store the username without the @ symbol
    }
    
    if (mentions.length > 0) {
      console.log(`[CHAT] Message contains mentions: ${mentions.join(', ')}`);
    }
    
    // Create a temporary message with the current content
    const tempMessage = {
      id: `temp_${Date.now()}`,
      type: MESSAGE_TYPES.TEXT,
      content: inputMessage,
      sender: {
        username: username || 'You',
        role: role || 'USER'
      },
      createdAt: new Date().toISOString(),
      isTemporary: true,
      channelId: activeChannelId, // Add explicit channel ID
      mentions: mentions.length > 0 ? mentions : undefined
    };
    
    // If this is an announcement, add special styling and markdown
    if (activeChannelId === 'announcements') {
      tempMessage.isAnnouncement = true;
      tempMessage.markdownEnabled = true;
      tempMessage.styling = {
        importance: 'normal',
        color: '#4a90e2',
        pinned: false
      };
    }
    
    // Optimistically add the message to the UI
    setMessages(prev => [...prev, tempMessage]);
    
    // Clear input right away for better UX
    setInputMessage('');
    
    // Scroll to bottom immediately
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
    
    // Send the message to the server
    const success = sendMessage(activeChannelId, tempMessage.content, mentions);
    
    // Handle send result
    if (!success) {
      toast.error('Failed to send message. Please try again.');
      
      // Remove temporary message if failed
      setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
    }
    
      setSendingMessage(false);
  };

  // Add a helper function for processing @mentions in the input area
  const processInputForMentions = (value) => {
    const parts = value.split(/(@\w+)/g);
    
    return (
      <>
        {parts.map((part, index) => {
          if (part.startsWith('@')) {
            return (
              <span key={index} className="text-blue-400 font-medium">
                {part}
              </span>
            );
          }
          return <span key={index}>{part}</span>;
        })}
      </>
    );
  };

  // Improve handleChannelSelect to include reconnection logic
  const handleChannelSelect = (channelId) => {
    if (channelId === activeChannelId) return;
    
    console.log(`[CHAT] User selected channel: ${channelId}, current active: ${activeChannelId}`);
    
    // Clear any mentions for the selected channel
    clearChannelMention(channelId);
    
    // Set the pending channel FIRST before anything else
    setPendingChannel(channelId);
    pendingChannelRef.current = channelId;
    console.log(`[CHAT] Set pendingChannel to ${channelId}`);
    
    // Clear messages immediately to give immediate feedback
    setMessages([]);
    setIsLoading(true);
    
    // First check if we're connected
    if (!connected) {
      console.log('[CHAT] Not connected, attempting to connect before changing channel');
      toast.info('Connecting to chat server...');
      
      connectToChat(
        handleWebSocketMessage,
        () => {
          console.log(`[CHAT] Connected, now joining channel: ${channelId}`);
          setConnected(true);
          
          // Important: Don't set activeChannelId yet, wait for the response
          // This keeps pendingChannel active until we get a response
          
          // Join the new channel
          joinChannel(channelId);
        },
        () => {
          console.error('[CHAT] Failed to connect');
          setConnected(false);
          setPendingChannel(null);
          pendingChannelRef.current = null;
          setIsLoading(false);
          toast.error('Failed to connect to chat server. Please try again.');
        },
        (error) => {
          console.error('[CHAT] Connection error:', error);
          setWsError(error);
          setConnected(false);
          setPendingChannel(null);
          pendingChannelRef.current = null;
          setIsLoading(false);
          toast.error(`Connection error: ${error}`);
        }
      );
    } else {
      // We're already connected, join channel without changing activeChannelId yet
      console.log(`[CHAT] Connected, joining channel ${channelId} (pendingChannel: ${channelId})`);
      
      // DON'T change activeChannelId here, wait for the server response
      // setActiveChannelId(channelId); <-- this was causing the issue
      
      // Join the new channel immediately
      const success = joinChannel(channelId);
      
      // Handle join failure case
      if (!success) {
        console.error(`[CHAT] Failed to join channel: ${channelId}`);
        toast.error('Failed to join channel. Attempting to reconnect...');
        
        // If joining fails, check if we're still connected
        if (!isConnected()) {
          // If not connected, try to reconnect
          console.log('[CHAT] WebSocket not connected, attempting to reconnect');
          
          // Wait a bit before trying to reconnect
          setTimeout(() => {
            connectToChat(
              handleWebSocketMessage,
              () => {
                console.log('[CHAT] Reconnected after channel join failure');
                setConnected(true);
                // Try to join the channel again after reconnection
                joinChannel(channelId);
              },
              () => {
                console.log('[CHAT] Failed to reconnect after channel join failure');
                setConnected(false);
                setPendingChannel(null);
                pendingChannelRef.current = null;
                setIsLoading(false);
              },
              (error) => {
                console.error('[CHAT] Reconnection error:', error);
                setWsError(error);
                setConnected(false);
                setPendingChannel(null);
                pendingChannelRef.current = null;
                setIsLoading(false);
                toast.error(`Reconnection error: ${error}`);
              }
            );
          }, 1000);
        } else {
          // We're connected but join still failed, try one more time
          console.log('[CHAT] Connected but join failed, retrying once...');
          setTimeout(() => {
            if (isConnected()) {
              joinChannel(channelId);
            }
          }, 500);
        }
      }
    }
  };

  // Format date for messages
  const formatMessageDate = (date) => {
    const messageDate = new Date(date);
    const now = new Date();
    
    // Same day - show time only
    if (messageDate.toDateString() === now.toDateString()) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // Within 7 days - show day of week and time
    const diffDays = Math.floor((now - messageDate) / (1000 * 60 * 60 * 24));
    if (diffDays < 7) {
      return `${messageDate.toLocaleDateString([], { weekday: 'short' })} at ${messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Older - show full date
    return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' }) + 
           ' at ' + messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get role icon
  const getRoleIcon = (role) => {
    if (role === 'ADMIN') return <i className="fas fa-shield text-red-500 ml-1"></i>;
    if (role === 'PRO') return <i className="fas fa-crown text-yellow-500 ml-1"></i>;
    return null;
  };

  // Create a challenge join action
  const handleJoinChallenge = () => {
    const challenges = [
      { id: 'web-exploit', name: 'Web Exploitation Basics' },
      { id: 'crypto-challenge', name: 'Cryptography Challenge' },
      { id: 'reverse-engineering', name: 'Reverse Engineering 101' },
      { id: 'forensics-intro', name: 'Digital Forensics Introduction' }
    ];
    
    // Select a random challenge
    const challenge = challenges[Math.floor(Math.random() * challenges.length)];
    
    // Send activity
    const success = sendActivity(activeChannelId, MESSAGE_TYPES.CHALLENGE_JOIN, {
      challengeName: challenge.name,
      challengeId: challenge.id
    });
    
    if (success) {
    toast.info(`Joined challenge: ${challenge.name}`);
    } else {
      toast.error('Failed to join challenge. Please try again.');
    }
  };
  
  // Create a challenge completion action
  const handleCompleteChallenge = () => {
    const challenges = [
      { id: 'web-exploit', name: 'Web Exploitation Basics' },
      { id: 'crypto-challenge', name: 'Cryptography Challenge' },
      { id: 'reverse-engineering', name: 'Reverse Engineering 101' },
      { id: 'forensics-intro', name: 'Digital Forensics Introduction' }
    ];
    
    // Select a random challenge
    const challenge = challenges[Math.floor(Math.random() * challenges.length)];
    
    // Send activity
    const success = sendActivity(activeChannelId, MESSAGE_TYPES.CHALLENGE_COMPLETE, {
      challengeName: challenge.name,
      challengeId: challenge.id
    });
    
    if (success) {
    toast.success(`Completed challenge: ${challenge.name}`);
    } else {
      toast.error('Failed to complete challenge. Please try again.');
    }
  };
  
  // Handle opening the recruitment form
  const handleOpenRecruitmentForm = () => {
    setShowRecruitmentForm(true);
  };

  // Handle closing the recruitment form
  const handleCloseRecruitmentForm = () => {
    setShowRecruitmentForm(false);
  };

  // Handle recruitment form input changes
  const handleRecruitmentInputChange = (e) => {
    const { name, value } = e.target;
    setRecruitmentData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle submitting the recruitment form
  const handleRecruitmentSubmit = (e) => {
    e.preventDefault();
    
    // Send recruitment message
    const success = sendRecruitment(
      activeChannelId,
      `I'm looking for teammates to join me on "${recruitmentData.challengeName}"`,
      {
        ...recruitmentData,
        joined: []
      }
    );
    
    if (success) {
    // Close form and reset data
    setShowRecruitmentForm(false);
    setRecruitmentData({
      challengeName: '',
      challengeId: '',
      slots: 2,
      difficulty: 'medium',
      description: ''
    });
    
    toast.success('Recruitment post created!');
    } else {
      toast.error('Failed to create recruitment post. Please try again.');
    }
  };

  // Handle joining a recruitment
  const handleJoinRecruitment = (messageId) => {
    const message = messages.find(msg => msg.id === messageId);
    if (!message) return;
    
        // Check if user is already in the joined list
        const alreadyJoined = message.recruitment.joined.some(user => user.username === username);
    let updatedJoined;
        
        if (alreadyJoined) {
          // If already joined, remove user
      updatedJoined = message.recruitment.joined.filter(user => user.username !== username);
        } else {
          // If not joined, add user
      updatedJoined = [
            ...message.recruitment.joined,
            { username: username || 'Guest', role, joinedAt: new Date().toISOString() }
          ];
    }
    
    // Update message in state
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
          return {
          ...msg,
            recruitment: {
            ...msg.recruitment,
              joined: updatedJoined
            }
          };
        }
      return msg;
    }));
    
    // TODO: In a real implementation, we would also send this update to the server
  };

  // Define handlers for file upload and team joining
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setFileToUpload(file);
    setShowUploadModal(true);
  };

  // Handle file upload
  const handleFileUpload = async () => {
    if (!fileToUpload) return;
    
    setUploadingFile(true);
    
    try {
      const success = await sendAttachment(activeChannelId, fileToUpload, uploadCaption);
      
      if (success) {
        toast.success('File uploaded successfully');
        setShowUploadModal(false);
        setFileToUpload(null);
        setUploadCaption('');
      } else {
        toast.error('Failed to upload file');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Error uploading file');
    } finally {
      setUploadingFile(false);
    }
  };

  // Handle joining a team
  const handleJoinTeam = (messageId) => {
    const success = joinTeam(activeChannelId, messageId);
    
    if (success) {
      toast.success('Joined team successfully');
    } else {
      toast.error('Failed to join team');
    }
  };

  // Handle leaving a team
  const handleLeaveTeam = (messageId) => {
    const success = leaveTeam(activeChannelId, messageId);
    
    if (success) {
      toast.success('Left team successfully');
    } else {
      toast.error('Failed to leave team');
    }
  };

  // Update the renderMessage function to support markdown in announcements
  const renderAnnouncementContent = (message) => {
    if (message.markdownEnabled) {
      return (
        <ReactMarkdown 
          className="prose prose-invert prose-sm max-w-none break-words text-gray-300"
          remarkPlugins={[remarkGfm]}
        >
          {message.content}
        </ReactMarkdown>
      );
    } else {
      return <p className="break-words text-gray-300">{message.content}</p>;
    }
  };

  // Helper to render delete button for admins
  const renderDeleteButton = (message) => {
    if (role !== 'ADMIN') return null;
    
    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleDeleteMessage(message.id);
        }}
        className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 bg-red-500/10 hover:bg-red-500/20 p-1 rounded absolute right-0 top-0 mr-2 mt-2"
        title="Delete Message"
      >
        <i className="fas fa-trash text-xs"></i>
      </button>
    );
  };

  // Helper to render deleted message
  const renderDeletedMessage = (message) => {
    return (
      <div className="flex items-center py-2 px-3 my-1 bg-neutral-800/50 rounded-md italic text-gray-500 text-sm">
        <i className="fas fa-ban mr-2 text-red-500/50"></i>
        Message deleted 
        {message.deletedBy && (
          <span className="ml-1">by {message.deletedBy.username}</span>
        )}
        {message.deletedAt && (
          <span className="ml-1">at {formatMessageDate(message.deletedAt)}</span>
        )}
      </div>
    );
  };

  // Add a helper function to get the profile picture URL
  const getProfilePictureUrl = (sender) => {
    // If the sender has a profilePicture property, use it
    if (sender.profilePicture) {
      return sender.profilePicture;
    }
    
    // Otherwise, fallback to robohash
    return `https://robohash.org/${sender.username}.png?set=set1&size=150x150`;
  };

  // Modify the renderMessage function to handle announcements with special formatting
  const renderMessage = (message) => {
    switch (message.type) {
      case MESSAGE_TYPES.TEXT:
        // Check if message is deleted
        if (message.deleted) {
          return renderDeletedMessage(message);
        }
        
        // Check if this is an announcement message that needs special formatting
        if (message.isAnnouncement) {
          const importance = message.styling?.importance || 'normal';
          const color = message.styling?.color || '#4a90e2';
          const isPinned = message.styling?.pinned || false;
          
        return (
            <div className={`flex items-start group ${isPinned ? 'sticky top-0 z-10' : ''} relative`}>
            <img 
                src={getProfilePictureUrl(message.sender)} 
                alt={message.sender.username} 
                className="h-10 w-10 rounded-full mr-3 flex-shrink-0 object-cover cursor-pointer hover:ring-2 hover:ring-blue-500"
                data-profile-trigger="true"
                onClick={(e) => handleProfileClick(message.sender, e)}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center">
                <span 
                  className="font-bold text-white flex items-center cursor-pointer hover:underline"
                  data-profile-trigger="true"
                  onClick={(e) => handleProfileClick(message.sender, e)}
                >
                  {message.sender.username}
                  {getRoleIcon(message.sender.role)}
                </span>
                <span className="ml-2 text-xs text-gray-400">
                  {formatMessageDate(message.createdAt)}
                </span>
                  {isPinned && (
                    <span className="ml-2 text-xs text-yellow-500">
                      <i className="fas fa-thumbtack"></i> Pinned
                    </span>
                  )}
                  {message.markdownEnabled && (
                    <span className="ml-2 text-xs text-blue-400">
                      <i className="fas fa-markdown"></i> Markdown
                    </span>
                  )}
              </div>
                
                <div 
                  className={`p-3 rounded-md mt-1 ${
                    importance === 'critical' ? 'bg-red-900/40 border border-red-700/50' : 
                    importance === 'important' ? 'bg-yellow-900/40 border border-yellow-700/50' : 
                    'bg-blue-900/40 border border-blue-700/50'
                  }`}
                  style={{ borderLeft: `4px solid ${color}` }}
                >
                  <div className="flex items-center mb-1">
                    <i className={`fas fa-bullhorn text-sm ${
                      importance === 'critical' ? 'text-red-400' : 
                      importance === 'important' ? 'text-yellow-400' : 
                      'text-blue-400'
                    } mr-2`}></i>
                    <span className={`text-xs font-semibold ${
                      importance === 'critical' ? 'text-red-400' : 
                      importance === 'important' ? 'text-yellow-400' : 
                      'text-blue-400'
                    }`}>
                      {importance === 'critical' ? 'CRITICAL ANNOUNCEMENT' : 
                       importance === 'important' ? 'IMPORTANT ANNOUNCEMENT' : 
                       'ANNOUNCEMENT'}
                    </span>
                  </div>
                  {renderAnnouncementContent(message)}
                  </div>
                  
                {/* Render attachment if present */}
                {message.attachment && (
                  <MessageAttachment attachment={message.attachment} />
                )}
                
                {/* Render message reactions */}
                <MessageReactions 
                  message={message} 
                  channelId={activeChannelId} 
                  currentUser={username}
                />
                          </div>
              {renderDeleteButton(message)}
                      </div>
          );
        }
        
        // Regular message format
        return (
          <div className="flex items-start group relative">
            <img 
              src={getProfilePictureUrl(message.sender)} 
              alt={message.sender.username} 
              className="h-10 w-10 rounded-full mr-3 flex-shrink-0 object-cover cursor-pointer hover:ring-2 hover:ring-blue-500"
              data-profile-trigger="true"
              onClick={(e) => handleProfileClick(message.sender, e)}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center">
                <span 
                  className="font-bold text-white flex items-center cursor-pointer hover:underline"
                  data-profile-trigger="true"
                  onClick={(e) => handleProfileClick(message.sender, e)}
                >
                  {message.sender.username}
                  {getRoleIcon(message.sender.role)}
                </span>
                <span className="ml-2 text-xs text-gray-400">
                  {formatMessageDate(message.createdAt)}
                </span>
                  </div>
              {renderMessageContent(message.content)}
              
              {/* Render attachment if present */}
              {message.attachment && (
                <MessageAttachment attachment={message.attachment} />
              )}
              
              {/* Render message reactions */}
              <MessageReactions 
                message={message} 
                channelId={activeChannelId} 
                currentUser={username}
              />
            </div>
            {renderDeleteButton(message)}
          </div>
        );
        
      case MESSAGE_TYPES.RECRUITMENT:
        // Check if message is deleted
        if (message.deleted) {
          return renderDeletedMessage(message);
        }
        
        return (
          <div className="flex items-start group relative">
            <img 
              src={getProfilePictureUrl(message.sender)} 
              alt={message.sender.username} 
              className="h-10 w-10 rounded-full mr-3 flex-shrink-0 object-cover cursor-pointer hover:ring-2 hover:ring-blue-500"
              data-profile-trigger="true"
              onClick={(e) => handleProfileClick(message.sender, e)}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center">
                <span 
                  className="font-bold text-white flex items-center cursor-pointer hover:underline"
                  data-profile-trigger="true"
                  onClick={(e) => handleProfileClick(message.sender, e)}
                >
                  {message.sender.username}
                  {getRoleIcon(message.sender.role)}
                </span>
                <span className="ml-2 text-xs text-gray-400">
                  {formatMessageDate(message.createdAt)}
                </span>
              </div>
              {renderMessageContent(message.content)}
              
              {/* Recruitment Card */}
              <div className="mt-3 bg-gradient-to-r from-blue-900/40 to-indigo-900/40 rounded-lg border border-blue-700/50 p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <i className="fas fa-users text-blue-400 mr-2"></i>
                    <h4 className="text-blue-300 font-semibold">{message.recruitment.challengeName}</h4>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    message.recruitment.difficulty === 'easy' ? 'bg-green-900/50 text-green-400' :
                    message.recruitment.difficulty === 'medium' ? 'bg-yellow-900/50 text-yellow-400' :
                    'bg-red-900/50 text-red-400'
                  }`}>
                    {message.recruitment.difficulty.charAt(0).toUpperCase() + message.recruitment.difficulty.slice(1)}
                  </span>
                </div>
                
                {message.recruitment.description && (
                  <p className="text-sm text-gray-300 mb-2">
                    {message.recruitment.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center">
                    <span className="text-gray-400 text-sm mr-2">Team:</span>
                    <div className="flex -space-x-2">
                      <img 
                        src={getProfilePictureUrl(message.sender)} 
                        className="w-6 h-6 rounded-full border border-neutral-800 object-cover cursor-pointer hover:ring-1 hover:ring-blue-500"
                        title={message.sender.username + " (Creator)"}
                        alt={message.sender.username}
                        data-profile-trigger="true"
                        onClick={(e) => handleProfileClick(message.sender, e)}
                      />
                      {message.recruitment.joined.map((user, idx) => (
                        <img 
                          key={idx}
                          src={getProfilePictureUrl(user)} 
                          className="w-6 h-6 rounded-full border border-neutral-800 object-cover cursor-pointer hover:ring-1 hover:ring-blue-500"
                          title={user.username}
                          alt={user.username}
                          data-profile-trigger="true"
                          onClick={(e) => handleProfileClick(user, e)}
                        />
                      ))}
                      {Array.from({ length: Math.max(0, message.recruitment.slots - message.recruitment.joined.length - 1) }).map((_, idx) => (
                        <div 
                          key={idx}
                          className="w-6 h-6 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center"
                        >
                          <i className="fas fa-plus text-xs text-neutral-600"></i>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => message.recruitment.joined.some(user => user.username === username) 
                      ? handleLeaveTeam(message.id) 
                      : handleJoinTeam(message.id)
                    }
                    className={`text-xs px-3 py-1 rounded-full ${
                      message.recruitment.joined.some(user => user.username === username)
                        ? 'bg-green-900/50 text-green-400 hover:bg-green-900'
                        : 'bg-blue-900/50 text-blue-400 hover:bg-blue-900'
                    } transition-colors`}
                  >
                    {message.recruitment.joined.some(user => user.username === username)
                      ? 'Joined ✓'
                      : 'Join Team'}
                  </button>
                </div>
              </div>
              
              {/* Render message reactions */}
              <MessageReactions 
                message={message} 
                channelId={activeChannelId} 
                currentUser={username}
              />
            </div>
            {renderDeleteButton(message)}
          </div>
        );
        
      case MESSAGE_TYPES.ATTACHMENT:
        // Check if message is deleted
        if (message.deleted) {
          return renderDeletedMessage(message);
        }
        
        return (
          <div className="flex items-start group relative">
            <img 
              src={getProfilePictureUrl(message.sender)} 
              alt={message.sender.username} 
              className="h-10 w-10 rounded-full mr-3 flex-shrink-0 object-cover cursor-pointer hover:ring-2 hover:ring-blue-500"
              data-profile-trigger="true"
              onClick={(e) => handleProfileClick(message.sender, e)}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center">
                <span 
                  className="font-bold text-white flex items-center cursor-pointer hover:underline"
                  data-profile-trigger="true"
                  onClick={(e) => handleProfileClick(message.sender, e)}
                >
                  {message.sender.username}
                  {getRoleIcon(message.sender.role)}
                </span>
                <span className="ml-2 text-xs text-gray-400">
                  {formatMessageDate(message.createdAt)}
                </span>
            </div>
              
              {/* Render content if present */}
              {message.content && renderMessageContent(message.content)}
              
              {/* Render attachment */}
              <MessageAttachment attachment={message.attachment} />
              
              {/* Render message reactions */}
              <MessageReactions 
                message={message} 
                channelId={activeChannelId} 
                currentUser={username}
              />
            </div>
            {renderDeleteButton(message)}
          </div>
        );
        
      // Add a case for SYSTEM messages to the renderMessage function
      case MESSAGE_TYPES.SYSTEM:
        // Check if message is deleted
        if (message.deleted) {
          return renderDeletedMessage(message);
        }
        
        // Check if this is in the announcements channel
        if (activeChannelId === 'announcements' || message.isAnnouncement) {
        return (
            <div className="flex items-start group relative">
              <img 
                src={message.sender?.profilePicture || "https://cdn.ctfguide.com/assets/logo-full.png"}
                alt={message.sender?.username || "CTFGuide Staff"}
                className="h-10 w-10 rounded-full mr-3 flex-shrink-0 object-cover cursor-pointer hover:ring-2 hover:ring-blue-500"
                data-profile-trigger="true"
                onClick={(e) => message.sender ? handleProfileClick(message.sender, e) : null}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center">
                  <span 
                    className="font-bold text-white flex items-center cursor-pointer hover:underline"
                    data-profile-trigger="true"
                    onClick={(e) => message.sender ? handleProfileClick(message.sender, e) : null}
                  >
                    {message.sender?.username || "CTFGuide Staff"}
                    <i className="fas fa-shield text-red-500 ml-1"></i>
                  </span>
                  <span className="ml-2 text-xs text-gray-400">
                    {formatMessageDate(message.createdAt)}
                  </span>
                  {message.markdownEnabled && (
                    <span className="ml-2 text-xs text-blue-400">
                      <i className="fas fa-markdown"></i> Markdown
                    </span>
                  )}
            </div>
                <div className="p-3 rounded-md mt-1 bg-indigo-900/40 border border-indigo-700/50" style={{ borderLeft: '4px solid #6366f1' }}>
                  {message.markdownEnabled ? (
                    <ReactMarkdown 
                      className="prose prose-invert prose-sm max-w-none break-words text-gray-300"
                      remarkPlugins={[remarkGfm]}
                    >
                      {message.content}
                    </ReactMarkdown>
                  ) : (
                    <p className="break-words text-gray-300">
                      {message.content}
                    </p>
                  )}
            </div>
              </div>
              {renderDeleteButton(message)}
          </div>
        );
        } else {
          // Regular system message
        return (
            <div className="flex items-center justify-center my-2 relative">
              <div className="bg-neutral-800 rounded-md px-3 py-2">
                <p className="text-sm text-gray-400">
                  <i className="fas fa-info-circle mr-2"></i>
                  {message.content}
                </p>
            </div>
              {renderDeleteButton(message)}
          </div>
        );
        }
        
      // Other message types...
      default:
        // Check if message is deleted - for any unhandled message types
        if (message.deleted) {
          return renderDeletedMessage(message);
        }
        // If message type is not recognized and not deleted, log and return null
        console.warn(`[CHAT] Unknown message type: ${message.type}`);
        return null;
    }
  };

  // Update the channel change effect to handle pending channel changes
  useEffect(() => {
    if (pendingChannel && connected) {
      console.log(`[CHAT] Channel change effect: pendingChannel=${pendingChannel}, activeChannelId=${activeChannelId}`);
      
      // This useEffect now only handles pending channel changes
      // The regular channel changes are handled in the handleChannelSelect function
      
      // Set a timeout to handle potential infinite loading
      const timeoutId = setTimeout(() => {
        if (isLoading && pendingChannel) {
          console.warn(`[CHAT] Loading timeout for channel ${pendingChannel}`);
          setIsLoading(false);
          
          // Keep the pending channel as-is but show error message
          setMessages([{
            id: `timeout_${Date.now()}`,
            type: 'system',
            content: `Could not load messages for #${pendingChannel}. Please try refreshing.`,
            createdAt: new Date().toISOString()
          }]);
          
          toast.warn('Channel loading timed out. Try refreshing or rejoining the channel.');
          
          // Try to refresh the channel once more
          console.log('[CHAT] Attempting to manually refresh channel after timeout');
          if (isConnected()) {
            refreshChannel(pendingChannel);
          }
        }
      }, 7000); // 7 second timeout
      
      // Clear the timeout on success or component unmount
      return () => clearTimeout(timeoutId);
    }
  }, [pendingChannel, connected, isLoading]);

  // Update the handleDeleteMessage function with better role checking
  const handleDeleteMessage = (messageId) => {
    // Check if role is defined and is ADMIN
    if (!role || role !== 'ADMIN') {
      toast.error('Only administrators can delete messages');
      return;
    }
    
    // Confirm the deletion
    if (!window.confirm('Are you sure you want to delete this message? This action cannot be undone.')) {
      return;
    }
    
    if (!isConnected()) {
      toast.error('Not connected to chat server');
      return;
    }
    
    console.log(`[CHAT] Sending delete request for message: ${messageId}`);
    
    // Send a WebSocket message to request message deletion
    const ws = getWebSocket();
    if (ws) {
      ws.send(JSON.stringify({
        type: 'delete_message',
        channel: activeChannelId,
        messageId
      }));
      
      // Show a toast notification to confirm action
      toast.info('Message deletion request sent');
    } else {
      toast.error('WebSocket connection not available');
    }
  };

  // Add effect to listen for mention updates
  useEffect(() => {
    const handleMentionUpdate = (event) => {
      const { channelId, hasMention } = event.detail;
      console.log(`[CHAT] Mention update for channel ${channelId}: ${hasMention}`);
      
      setMentionCounts(prev => ({
        ...prev,
        [channelId]: hasMention
      }));
    };
    
    window.addEventListener('chatMentionUpdate', handleMentionUpdate);
    
    return () => {
      window.removeEventListener('chatMentionUpdate', handleMentionUpdate);
    };
  }, []);

  // Modify the message rendering to highlight mentions
  const renderMessageContent = (content) => {
    if (!content) return null;
    
    // Split by @mentions
    const parts = content.split(/(@\w+)/g);
    
    return (
      <p className="break-words text-gray-300">
        {parts.map((part, index) => {
          // Check if this part is a mention
          if (part.startsWith('@')) {
            const mentionedUser = part.substring(1);
            const isSelfMention = mentionedUser.toLowerCase() === username?.toLowerCase();
            
            // Highlight mentions differently
            return (
              <span 
                key={index} 
                className={`font-medium ${isSelfMention ? 'bg-blue-900/50 text-blue-300 px-1 rounded' : 'text-blue-400'}`}
              >
                {part}
              </span>
            );
          }
          
          // Regular text
          return <span key={index}>{part}</span>;
        })}
      </p>
    );
  };

  // UserProfileCard component
  const UserProfileCard = ({ user, position, loading, onClose }) => {
    return (
      <div 
        className="fixed z-50 shadow-xl profile-card animate-fadeIn" 
        style={{ 
          top: position.top + 'px', 
          left: position.left + 'px',
          maxHeight: '80vh'
        }}
        onClick={(e) => e.stopPropagation()} // Prevent clicks from propagating
      >
        <div className="bg-neutral-800 border border-neutral-700 rounded-lg w-80 overflow-hidden overflow-y-auto">
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-400 hover:text-white px-1 bg-neutral-900/60 rounded-full z-10"
          >
            <i className="fas fa-times"></i>
          </button>
          
          {/* Profile header */}
          <div className="h-24 bg-gradient-to-r from-blue-900 to-indigo-900"></div>
          
          <div className="px-4 pb-4 relative">
            {/* Profile picture */}
            <img 
              src={user ? getProfilePictureUrl(user) : "https://robohash.org/user.png?set=set1&size=150x150"}
              alt={user?.username || "User"} 
              className="w-20 h-20 rounded-full border-4 bg-neutral-800 border-neutral-800 absolute -top-10 left-4"
            />
            
            {/* Username and role */}
            <div className="mt-12 mb-3">
              <div className="flex items-center">
                <h3 className="text-lg font-bold text-white">
                  {user?.username || "User"}
                </h3>
                {getRoleIcon(user?.role)}
              </div>
              <p className="text-sm text-gray-400">
                {user?.role === 'ADMIN' ? 'Administrator' : 
                 user?.role === 'PRO' ? 'Pro Member' : 'Member'}
              </p>
            </div>
            
            {/* Loading state */}
            {loading && (
              <div className="flex justify-center my-4">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            )}
            
            {/* Bio section */}
            {!loading && (
              <>
                {user?.bio ? (
                  <div className="mb-3 bg-neutral-700/30 rounded-md p-3">
                    <p className="text-sm text-gray-300">{user.bio}</p>
                  </div>
                ) : (
                  <div className="mb-3 bg-neutral-700/30 rounded-md p-3">
                    <p className="text-sm text-gray-400">No bio available</p>
                  </div>
                )}
              </>
            )}
            
            {/* Badges section */}
            {!loading && user?.badges && user.badges.length > 0 && (
              <div className="mb-3">
                <h4 className="text-sm font-semibold text-gray-300 mb-2">Badges</h4>
                <div className="flex flex-wrap gap-2">
                  {user.badges.slice(0, 4).map((badge, index) => (
                    <div key={index} className="flex items-center justify-center w-8 h-8 bg-neutral-700/50 rounded-full" title={badge.badge?.badgeName || 'Badge'}>
                      <i className={`fas fa-award text-${getBadgeColor(badge.badge?.badgeTier)}`}></i>
                    </div>
                  ))}
                  {user.badges.length > 4 && (
                    <div className="flex items-center justify-center w-8 h-8 bg-neutral-700/50 rounded-full">
                      <span className="text-xs text-gray-300">+{user.badges.length - 4}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Stats section */}
            <div className="grid grid-cols-3 gap-2 text-center mb-3">
              <div className="bg-neutral-700/30 rounded-md p-2">
                <div className="text-sm font-semibold text-white">{user?.challengesSolved || "0"}</div>
                <div className="text-xs text-gray-400">Challenges</div>
              </div>
              <div className="bg-neutral-700/30 rounded-md p-2">
                <div className="text-sm font-semibold text-white">{user?.points || "0"}</div>
                <div className="text-xs text-gray-400">Points</div>
              </div>
              <div className="bg-neutral-700/30 rounded-md p-2">
                <div className="text-sm font-semibold text-white">{user?.streak || "0"}</div>
                <div className="text-xs text-gray-400">Streak</div>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex justify-center">
              <Link href={`/profile/${user?.username}`}>
                <div className="text-blue-400 hover:text-blue-300 text-sm flex items-center">
                  <i className="fas fa-user mr-1"></i> View Full Profile
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Helper function to get badge color based on tier
  const getBadgeColor = (tier) => {
    switch (tier) {
      case 'GOLD':
        return 'yellow-400';
      case 'SILVER':
        return 'gray-300';
      case 'BRONZE':
        return 'amber-600';
      default:
        return 'blue-400';
    }
  };
  
  // Add effect to handle clicking outside the profile card
  useEffect(() => {
    const handleOutsideClick = (e) => {
      // If profile card is shown and click is outside the card and not on a trigger
      if (showProfileCard) {
        const profileCard = document.querySelector('.profile-card');
        const isClickInsideCard = profileCard?.contains(e.target);
        const isClickOnTrigger = e.target.closest('[data-profile-trigger]');
        
        if (!isClickInsideCard && !isClickOnTrigger) {
          closeProfileCard();
        }
      }
    };
    
    // Add global click listener when profile card is shown
    if (showProfileCard) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    
    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [showProfileCard]);

  return (
    <>
      <Head>
        <title>Community - CTFGuide</title>
      </Head>
      <StandardNav />
      <main className="h-[calc(100vh-64px)] overflow-hidden bg-neutral-900">
        {connected ? (
        <div className="flex h-full">
          {/* Channels Sidebar */}
          <div className="w-64 flex-none bg-neutral-800 border-r border-neutral-700">
            <div className="p-4 border-b border-neutral-700">
              <h2 className="text-2xl font-bold text-white mb-1">Community</h2>
              <p className="text-xs text-gray-400">Chat with other users</p>
            </div>

            {/* Channels */}
            <div className="p-2">
              <h3 className="text-xs text-gray-400 uppercase font-bold p-2">
                <span>Channels</span>
              </h3>
              <div className="space-y-1">
                  {PREDEFINED_CHANNELS.map(channel => {
                    const isActive = activeChannelId === channel.id;
                    const hasMention = hasChannelMention(channel.id);
                    
                    return (
                  <button
                    key={channel.id}
                        className={`w-full text-left px-2 py-1 flex items-center hover:bg-neutral-700 ${
                          isActive ? 'border-r-2 border-blue-600 bg-neutral-700 text-white' : 'text-gray-300'
                        } relative`}
                    onClick={() => handleChannelSelect(channel.id)}
                  >
                    <i className={`fas ${channel.icon} text-gray-400 mr-2 fa-fw`}></i>
                    {channel.name}
                        
                        {/* Notification indicator */}
                        {hasMention && !isActive && (
                          <div className="absolute right-2 top-1/2 -translate-y-1/2 h-2 w-2 bg-red-500 rounded-full"></div>
                        )}
                  </button>
                    );
                  })}
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-neutral-900 overflow-hidden">
            {/* Chat Header */}
            <div className="h-12 flex-none border-b border-neutral-700 bg-neutral-800 flex items-center px-4">
              <i className={`fas ${activeChannel.icon} text-gray-400 mr-2 fa-fw`}></i>
              <h3 className="font-bold text-white">{activeChannel.name}</h3>
              <span className="mx-2 text-neutral-700">|</span>
              <p className="text-sm text-gray-400">{activeChannel.description}</p>
                
                {/* Connection Status */}
                <div className="ml-2 flex items-center">
                  <div className={`h-2 w-2 rounded-full mr-1 ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-xs text-gray-400">{connected ? 'Connected' : 'Connecting...'}</span>
                  
                  {/* Add debug button */}
                  <button 
                    onClick={() => {
                      // Check auth
                      const token = getCookie('idToken') || localStorage.getItem('idToken');
                      console.log('Token found:', !!token);
                      
                      // Display connection info
                      toast.info(`Connection status: ${connected ? 'Connected' : 'Disconnected'}`);
                      
                      // Try to reconnect if not connected
                      if (!connected) {
                        toast.info('Attempting to reconnect...');
                        connectToChat(
                          handleWebSocketMessage,
                          () => {
                            console.log('[CHAT] Frontend connected via debug button');
                            setConnected(true);
                            setWsError(null);
                            toast.success('Connected!');
                          },
                          () => setConnected(false),
                          (error) => {
                            setWsError(error);
                            setConnected(false);
                            toast.error(`Connection error: ${error}`);
                          }
                        );
                      }
                    }}
                    className="text-xs text-gray-400 ml-2 underline hover:text-blue-400"
                    title="Debug connection"
                  >
                    <i className="fas fa-sync text-xs"></i>
                  </button>
                </div>
              
              {/* Activity Buttons */}
              <div className="ml-auto flex gap-2">
                <button
                  onClick={handleOpenRecruitmentForm}
                  className="px-3 py-1 text-xs bg-blue-900/50 text-blue-400 hover:bg-blue-900 transition rounded flex items-center"
                >
                  <i className="fas fa-users mr-1"></i> Recruit Team
                </button>
                <button
                  onClick={handleJoinChallenge}
                    className="hidden px-3 py-1 text-xs bg-indigo-900/50 text-indigo-400 hover:bg-indigo-900 transition rounded flex items-center"
                >
                  <i className="fas fa-code mr-1"></i> Join Challenge
                </button>
                <button
                  onClick={handleCompleteChallenge}
                    className="hidden px-3 py-1 text-xs bg-green-900/50 text-green-400 hover:bg-green-900 transition rounded flex items-center"
                >
                    <i className=" fas fa-trophy mr-1"></i> Complete Challenge
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto py-4 px-4 space-y-2">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : messages.length > 0 ? (
                <>
                  {messages.map((message) => (
                    <div key={message.id}>
                      {renderMessage(message)}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </>
              ) : (
                <div className="text-center py-10">
                  <div className="inline-flex rounded-full bg-neutral-800 p-5 mb-4">
                    <i className="fas fa-comments text-2xl text-blue-500"></i>
                  </div>
                  <h3 className="text-white text-lg font-medium">No messages yet</h3>
                  <p className="text-gray-400 mt-1">Be the first to start a conversation!</p>
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="h-20 flex-none px-4 py-3 border-t border-neutral-700 bg-neutral-800">
                {activeChannelId === 'announcements' && role !== 'ADMIN' ? (
                  <div className="flex h-full items-center justify-center">
                    <div className="bg-neutral-700/50 text-gray-400 p-3 rounded-md text-sm flex items-center">
                      <i className="fas fa-lock mr-2"></i>
                      Only administrators can post in the announcements channel
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSendMessage} className="flex h-full flex-col">
                <div className="flex-1 flex items-center">
                  <div className="flex-1 relative">
                        <div className="absolute inset-0 overflow-hidden px-4 py-2 pointer-events-none text-white">
                          {processInputForMentions(inputMessage)}
                          {/* Add invisible character to ensure correct height */}
                          {!inputMessage && <span>&#8203;</span>}
                        </div>
                    <textarea
                          className="h-full w-full bg-neutral-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-transparent caret-white"
                      placeholder={`Message #${activeChannel.name}`}
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage(e);
                        }
                            
                            // Add @ symbol when someone presses @ key
                            if (e.key === '@') {
                              console.log('[CHAT] User pressed @ key');
                              // You could open a user autocomplete popup here
                            }
                      }}
                      disabled={sendingMessage}
                      rows="1"
                    />
                  </div>
                  <div className="ml-3 flex items-center space-x-2">
                        {/* File upload button */}
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-gray-400 hover:text-white p-2"
                          disabled={sendingMessage}
                        >
                          <i className="fas fa-paperclip"></i>
                          <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleFileSelect}
                            accept="image/*,application/pdf,video/*,audio/*"
                          />
                        </button>
                        
                    <button 
                      type="submit" 
                      className="text-gray-400 hover:text-white p-2"
                      disabled={sendingMessage}
                    >
                      {sendingMessage ? (
                        <i className="fas fa-circle-notch fa-spin"></i>
                      ) : (
                        <i className="fas fa-paper-plane"></i>
                      )}
                    </button>
                  </div>
                </div>
                    {activeChannelId === 'announcements' && role === 'ADMIN' && (
                      <div className="w-full text-xs text-gray-500 mt-1 flex justify-between items-center">
                        <div>
                          <span className="text-blue-400">Markdown supported:</span> **bold**, *italic*, [links](url), `code`, ~~strikethrough~~, # Heading, {'>'}Quote
            </div>
                <div className="flex items-center">
                          <button
                            type="button"
                            className="text-xs text-blue-400 hover:text-blue-300 mr-2"
                            onClick={() => {
                              // Set message importance selector
                              const importance = prompt('Set message importance (normal, important, critical):', 'normal');
                              if (importance && ['normal', 'important', 'critical'].includes(importance.toLowerCase())) {
                                // Create a styled message template with command
                                const command = importance.toLowerCase() === 'normal' ? '!normal' : 
                                                 importance.toLowerCase() === 'important' ? '!important' : '!critical';
                                
                                const template = `${command} ## ${importance.toUpperCase()} ANNOUNCEMENT\n\nDetails here...\n\n- Point 1\n- Point 2\n\n*Message from CTFGuide Staff*`;
                                setInputMessage(template);
                              }
                            }}
                          >
                            <i className="fas fa-sparkles mr-1"></i> Add Template
                          </button>
                          <button
                            type="button"
                            className="text-xs text-yellow-400 hover:text-yellow-300"
                            onClick={() => {
                              // Create a pinned announcement template
                              const template = `!pin # PINNED ANNOUNCEMENT\n\nThis important announcement will be pinned at the top of the channel.\n\n- Write key information here\n- Use markdown to format your message\n\n*This message is pinned to the top of the channel*`;
                              setInputMessage(template);
                            }}
                          >
                            <i className="fas fa-thumbtack mr-1"></i> Pinned Template
                          </button>
                </div>
                </div>
                    )}
                  </form>
                )}
                </div>
              </div>
            </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="inline-flex rounded-full bg-neutral-800 p-5 mb-4">
                <i className="fas fa-plug text-2xl text-red-500"></i>
              </div>
              <h3 className="text-white text-lg font-medium">Connecting to Chat Server</h3>
              <p className="text-gray-400 mt-1">Please wait while we connect you to the community...</p>
              {wsError && (
                <p className="text-red-400 mt-4">{wsError}</p>
              )}
              <button
                onClick={() => {
                  setWsError(null);
                  connectToChat(
                    handleWebSocketMessage,
                    () => setConnected(true),
                    () => setConnected(false),
                    (error) => {
                      setWsError(error);
                      setConnected(false);
                    }
                  );
                }}
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
        
        {/* User Profile Card */}
        {showProfileCard && profileUser && (
          <UserProfileCard 
            user={profileUser}
            position={profileCardPosition}
            loading={loadingProfile}
            onClose={closeProfileCard}
          />
        )}
      </main>
      
      {/* Recruitment Modal */}
      {showRecruitmentForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Recruit Team Members</h3>
              <button 
                onClick={handleCloseRecruitmentForm}
                className="text-gray-400 hover:text-white"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <form onSubmit={handleRecruitmentSubmit}>
              <div className="mb-4">
                <label className="block text-gray-300 text-sm mb-1">Challenge Name</label>
                <input
                  type="text"
                  name="challengeName"
                  value={recruitmentData.challengeName}
                  onChange={handleRecruitmentInputChange}
                  className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 text-white rounded focus:outline-none focus:border-blue-500"
                  placeholder="e.g. Web Exploitation Challenge"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-300 text-sm mb-1">Challenge ID (optional)</label>
                <input
                  type="text"
                  name="challengeId"
                  value={recruitmentData.challengeId}
                  onChange={handleRecruitmentInputChange}
                  className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 text-white rounded focus:outline-none focus:border-blue-500"
                  placeholder="e.g. web-exploitation-101"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-1">Team Slots</label>
                  <select
                    name="slots"
                    value={recruitmentData.slots}
                    onChange={handleRecruitmentInputChange}
                    className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 text-white rounded focus:outline-none focus:border-blue-500"
                  >
                    <option value="1">1 person</option>
                    <option value="2">2 people</option>
                    <option value="3">3 people</option>
                    <option value="4">4 people</option>
                    <option value="5">5 people</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm mb-1">Difficulty</label>
                  <select
                    name="difficulty"
                    value={recruitmentData.difficulty}
                    onChange={handleRecruitmentInputChange}
                    className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 text-white rounded focus:outline-none focus:border-blue-500"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-300 text-sm mb-1">Description (optional)</label>
                <textarea
                  name="description"
                  value={recruitmentData.description}
                  onChange={handleRecruitmentInputChange}
                  className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 text-white rounded focus:outline-none focus:border-blue-500"
                  rows="3"
                  placeholder="Describe what kind of teammates you're looking for..."
                ></textarea>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleCloseRecruitmentForm}
                  className="px-4 py-2 text-sm text-gray-300 hover:text-white mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded"
                >
                  Post Recruitment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* File Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Upload File</h3>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="mb-4">
              <div className="bg-neutral-700 p-4 rounded flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center mr-3 flex-shrink-0">
                  <i className={`fas ${fileToUpload?.type.startsWith('image/') ? 'fa-image' : 'fa-file'} text-white`}></i>
                </div>
                <div className="overflow-hidden">
                  <div className="font-medium text-sm text-white truncate">{fileToUpload?.name}</div>
                  <div className="text-xs text-gray-400">{fileToUpload?.size ? `${Math.round(fileToUpload.size / 1024)} KB` : ''}</div>
                </div>
              </div>
              
              <label className="block text-sm font-medium text-gray-300 mb-1">Caption (Optional)</label>
              <textarea
                value={uploadCaption}
                onChange={(e) => setUploadCaption(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 text-white rounded focus:outline-none focus:border-blue-500"
                placeholder="Add a caption to your file..."
                rows="3"
              ></textarea>
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 text-sm text-gray-300 hover:text-white mr-2"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleFileUpload}
                className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center"
                disabled={uploadingFile}
              >
                {uploadingFile ? (
                  <>
                    <i className="fas fa-circle-notch fa-spin mr-2"></i>
                    Uploading...
                  </>
                ) : (
                  <>
                    <i className="fas fa-upload mr-2"></i>
                    Upload
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
      <ToastContainer position="bottom-right" theme="dark" />
    </>
  );
}
