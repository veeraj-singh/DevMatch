import React, { useState, useEffect, useRef } from "react";
import MessageArea from "../components/messagearea";
import ListSkeleton from "../components/listskeleton";
import { 
  MessageCircle, 
  Send, 
  Search, 
  Phone, 
  Video, 
  MoreHorizontal,
} from "lucide-react";
import api from "../utils/axios_instance";
import { io } from 'socket.io-client';

const MESSAGES_PER_PAGE = 20;

const DirectMessages = () => {
  const [socket, setSocket] = useState(null);
  const [joinedRooms, setJoinedRooms] = useState([]);
  const [activeChats, setActiveChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [userId, setUserId] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loadingChats, setLoadingChats] = useState(true); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  const messagesContainerRef = useRef(null);
  const lastMessageRef = useRef(null);
  const isInitialLoad = useRef(true);
  const prevScrollHeight = useRef(0);

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_BACKEND_URL, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => {
      console.log('Socket connected');
      setSocket(newSocket);
      setError(null);
    });

    newSocket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
      setError('Connection failed. Retrying...');
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchActiveChats = async () => {
      try {
        setLoadingChats(true);
        const response = await api.get('/api/match/activechats');
        setActiveChats(response.data.res);
        setUserId(response.data.userId);
      } catch (error) {
        console.error("Error fetching active chats:", error);
        setError("Failed to load chats. Please try again later.");
      } finally {
        setLoadingChats(false);
      }
    };

    fetchActiveChats();
  }, []);

  const loadMessages = async (initialLoad = false) => {
    if (loading || (!hasMore && !initialLoad)) return;

    setLoading(true);
    try {
      const response = await api.get(
        `/api/messages/match/${selectedChat.id}?page=${initialLoad ? 0 : page}&limit=${MESSAGES_PER_PAGE}`
      );
      
      const { messages: newMessages, hasMore: moreAvailable } = response.data;

      if (initialLoad) {
        setMessages(newMessages.reverse());
        setPage(1);
        isInitialLoad.current = true;
      } else {
        prevScrollHeight.current = messagesContainerRef.current?.scrollHeight || 0;
        setMessages(prev => [...newMessages.reverse(), ...prev]);
        setPage(prev => prev + 1);
      }

      setHasMore(moreAvailable);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setError("Failed to load messages. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container || loading || !hasMore) return;

    // Check if we're near the top to load more messages
    if (container.scrollTop < 100) {
      loadMessages(false);
    }
  };

  useEffect(() => {
    if (messagesContainerRef.current && !isInitialLoad.current) {
      const scrollDifference = messagesContainerRef.current.scrollHeight - prevScrollHeight.current;
      messagesContainerRef.current.scrollTop = scrollDifference;
    }
  }, [messages]);

  useEffect(() => {
    if (selectedChat) {
      setMessages([]);
      setHasMore(true);
      setPage(0);
      loadMessages(true);
    }
  }, [selectedChat]);

  const handleChatSelect = (chat) => {
    if (selectedChat?.id === chat.id) return;
    
    setSelectedChat(chat);
    if (!joinedRooms.includes(chat.id)) {
      socket?.emit('join-room', { roomId: `match-${chat.id}` });
      setJoinedRooms(prev => [...prev, chat.id]);
    }
  };

  const handleSendMessage = () => {
    if (!message.trim() || !selectedChat || !socket) return;

    socket.emit('send-message', {
      roomId: `match-${selectedChat.id}`,
      senderId: userId,
      message,
    });

    setMessage("");
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (messageData) => {
      if (selectedChat && parseInt(messageData.matchId) === selectedChat.id) {
        setMessages(prev => [...prev, messageData]);
        
        // Scroll to bottom for new messages
        setTimeout(() => {
          if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }

      setActiveChats(prev => 
        prev.map(chat => 
          chat.id === parseInt(messageData.matchId)
            ? {
                ...chat,
                lastMessage: messageData.message,
                lastMessageTimestamp: messageData.timestamp
              }
            : chat
        )
      );
    };

    const handleMessageStatus = (data) => {
      setMessages(prev =>
        prev.map(msg =>
          msg._id === data.messageId
            ? { ...msg, status: data.status }
            : msg
        )
      );
    };

    socket.on("receive-message", handleReceiveMessage);
    socket.on("message-status", handleMessageStatus);

    return () => {
      socket.off("receive-message", handleReceiveMessage);
      socket.off("message-status", handleMessageStatus);
    };
  }, [socket, selectedChat]);

  // Scroll to bottom on initial load
  useEffect(() => {
    if (isInitialLoad.current && messages.length > 0) {
      if (lastMessageRef.current) {
        lastMessageRef.current.scrollIntoView();
      }
      isInitialLoad.current = false;
    }
  }, [messages]);

  return (
    <main className="flex-1 flex">
      <div className="w-80 bg-gray-800 border-r border-gray-700">
        <div className="p-4">
          <h1 className="text-xl font-bold text-green-400 flex items-center mb-4">
            <MessageCircle className="mr-2" /> Messages
          </h1>
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full bg-gray-700 text-white px-4 py-2 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
          </div>
          {error && (
            <div className="mb-4 p-2 bg-red-600 text-white rounded">
              {error}
            </div>
          )}
          {loadingChats ? (
            <ListSkeleton />
          ) : (
            <div className="space-y-2">
              {activeChats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => handleChatSelect(chat)}
                  className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-700 ${
                    selectedChat?.id === chat.id ? 'bg-gray-700' : ''
                  }`}
                >
                  <img
                    src={chat.otherUserAvatar || `https://avatar.iran.liara.run/public/2`}
                    alt={chat.otherUserName}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="ml-3 flex-1 min-w-0">
                    <div className="flex justify-between">
                      <span className="font-medium truncate">{chat.otherUserName}</span>
                      <span className="text-xs text-gray-400">
                        {new Date(chat.lastMessageTimestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400 truncate">{chat.lastMessage}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-gray-900">
        {selectedChat ? (
          <>
            <div className="h-16 bg-gray-800 border-b border-gray-700 px-6 flex items-center justify-between">
              <div className="flex items-center">
                <img
                  src={selectedChat.otherUserAvatar || `https://avatar.iran.liara.run/public/2`}
                  alt={selectedChat.otherUserName}
                  className="w-8 h-8 rounded-full"
                />
                <div className="ml-3">
                  <h2 className="font-medium">{selectedChat.otherUserName}</h2>
                  <p className="text-xs text-gray-400">
                    {selectedChat.status === 'online' ? 'Active now' : 'Offline'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Phone className="w-5 h-5 cursor-pointer hover:text-green-400" />
                <Video className="w-5 h-5 cursor-pointer hover:text-green-400" />
                <MoreHorizontal className="w-5 h-5 cursor-pointer hover:text-green-400" />
              </div>
            </div>
            <div
              ref={messagesContainerRef}
              className="flex-1 overflow-auto px-4 py-2"
              onScroll={handleScroll}
            >
              {loading && page === 0 && (
                <div className="text-center p-2">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-green-500 border-t-transparent"></div>
                </div>
              )}
              {messages.length > 0 && (
                <>
                  {loading && page > 0 && (
                    <div className="text-center p-2">
                      <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-green-500 border-t-transparent"></div>
                    </div>
                  )}
                  <MessageArea 
                    messages={messages} 
                    userId={userId} 
                    users={[]}
                  />
                  <div ref={lastMessageRef} />
                </>
              )}
            </div>
            <div className="p-4 bg-gray-800 border-t border-gray-700">
              <div className="relative">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="w-full bg-gray-700 text-white px-4 py-3 pr-12 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || loading}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <p>Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default DirectMessages;