import React, { useState } from "react";
import Sidebar from "../components/sidebar";
import { 
  MessageCircle, 
  Send, 
  Search, 
  Phone, 
  Video, 
  MoreHorizontal,
  User,
  Clock,
  CheckCheck 
} from "lucide-react";

const DirectMessages = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  
  // Mock active chats data
  const [activeChats] = useState([
    { 
      id: 1, 
      name: "Alice Cooper", 
      avatar: "/api/placeholder/40/40",
      status: "online",
      lastMessage: "Sure, I'll look into it!",
      timestamp: "2 min ago",
      unread: 2
    },
    { 
      id: 2, 
      name: "Bob Wilson", 
      avatar: "/api/placeholder/40/40",
      status: "offline",
      lastMessage: "The meeting is scheduled for tomorrow",
      timestamp: "1 hour ago",
      unread: 0
    },
    { 
      id: 3, 
      name: "Carol Smith", 
      avatar: "/api/placeholder/40/40",
      status: "online",
      lastMessage: "Thanks for your help!",
      timestamp: "3 hours ago",
      unread: 0
    }
  ]);

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    // Mock messages for selected chat
    setMessages([
      { id: 1, sender: "user", text: "Hey, how's the project going?", time: "10:00 AM" },
      { id: 2, sender: chat.name, text: "It's going well! I've completed the initial design", time: "10:05 AM" },
      { id: 3, sender: "user", text: "That's great! Can you share the updates?", time: "10:07 AM" },
      { id: 4, sender: chat.name, text: "Sure, I'll look into it!", time: "10:10 AM" }
    ]);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([
        ...messages,
        { 
          id: messages.length + 1, 
          sender: "user", 
          text: message,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setMessage("");
    }
  };

  return (
      
      <main className="flex-1 flex">
        {/* Left Panel - Chat List */}
        <div className="w-80 bg-gray-800 border-r border-gray-700">
          <div className="p-4">
            <h1 className="text-xl font-bold text-green-400 flex items-center mb-4">
              <MessageCircle className="mr-2" /> Messages
            </h1>
            
            {/* Search */}
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full bg-gray-700 text-white px-4 py-2 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            </div>

            {/* Active Chats */}
            <div className="space-y-2">
              {activeChats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => handleChatSelect(chat)}
                  className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-700 ${
                    selectedChat?.id === chat.id ? 'bg-gray-700' : ''
                  }`}
                >
                  <div className="relative">
                    <img
                      src={chat.avatar}
                      alt={chat.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-800 ${
                      chat.status === 'online' ? 'bg-green-500' : 'bg-gray-500'
                    }`} />
                  </div>
                  
                  <div className="ml-3 flex-1 min-w-0">
                    <div className="flex justify-between">
                      <span className="font-medium truncate">{chat.name}</span>
                      <span className="text-xs text-gray-400">{chat.timestamp}</span>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm text-gray-400 truncate">{chat.lastMessage}</p>
                      {chat.unread > 0 && (
                        <span className="bg-green-500 text-white text-xs rounded-full px-2 py-0.5">
                          {chat.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Chat Window */}
        <div className="flex-1 flex flex-col bg-gray-900">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="h-16 bg-gray-800 border-b border-gray-700 px-6 flex items-center justify-between">
                <div className="flex items-center">
                  <img
                    src={selectedChat.avatar}
                    alt={selectedChat.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="ml-3">
                    <h2 className="font-medium">{selectedChat.name}</h2>
                    <p className="text-xs text-gray-400">
                      {selectedChat.status === 'online' ? 'Active now' : 'Offline'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button className="p-2 hover:bg-gray-700 rounded-full transition-colors">
                    <Phone className="w-5 h-5" />
                  </button>
                  <button className="p-2 hover:bg-gray-700 rounded-full transition-colors">
                    <Video className="w-5 h-5" />
                  </button>
                  <button className="p-2 hover:bg-gray-700 rounded-full transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[70%] ${
                      msg.sender === 'user' 
                        ? 'bg-green-600 rounded-l-lg rounded-tr-lg' 
                        : 'bg-gray-700 rounded-r-lg rounded-tl-lg'
                    } p-3`}
                    >
                      <div className="flex items-end space-x-2">
                        <p className="text-white">{msg.text}</p>
                        <span className="text-xs text-gray-300 whitespace-nowrap">
                          {msg.time}
                        </span>
                        {msg.sender === 'user' && (
                          <CheckCheck className="w-4 h-4 text-gray-300" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
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
                    disabled={!message.trim()}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center">
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