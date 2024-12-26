import React, { useRef } from "react";
import { CheckCheck, Check } from "lucide-react";

const MessageArea = ({ messages, userId, users }) => {
  const lastMessageRef = useRef(null);
  const chut = users.length 
  // Format timestamp to a readable time
  const formatTime = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "";
    }
  };

  // Message status indicator
  const MessageStatus = ({ status }) => {
    switch (status) {
      case "sending":
        return (
          <div className="w-3 h-3 rounded-full border-2 border-gray-300 border-t-transparent animate-spin" />
        );
      case "sent":
        return <Check className="w-4 h-4 text-gray-300" />;
      case "delivered":
      case "read":
        return <CheckCheck className="w-4 h-4 text-gray-300" />;
      default:
        return <Check className="w-4 h-4 text-gray-300" />;
    }
  };

  // Get sender details
  const getSenderDetails = (senderId) => {
    const sender = users.find((user) => user.user.id === parseInt(senderId));
    return sender?.user || { name: "Unknown User", avatar: "" };
  };

  // Group messages by date
  const groupMessagesByDate = (messages) => {
    const groups = {};
    messages.forEach((msg) => {
      const date = new Date(msg.timestamp).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(msg);
    });
    return groups;
  };

  const messageGroups = groupMessagesByDate(messages);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      {Object.entries(messageGroups).map(([date, msgs]) => (
        <div key={date} className="space-y-4">
          {/* Date separator */}
          <div className="flex justify-center">
            <span className="bg-gray-800 text-gray-400 text-xs px-3 py-1 rounded-full">
              {new Date(date).toLocaleDateString([], {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          {/* Messages for this date */}
          {msgs.map((msg, index) => {
            const isCurrentUser = parseInt(msg.senderId) === userId;
            const isLastMessage = index === msgs.length - 1;
            const senderDetails = getSenderDetails(msg.senderId);

            return (
              <div
                key={msg?._id || Math.random()}
                className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                ref={isLastMessage ? lastMessageRef : null}
              >
                {!isCurrentUser && chut>0 && (
                  <div className="mr-2">
                      <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold">
                        {senderDetails.name.charAt(0).toUpperCase()}
                      </div>
                  </div>
                )}
                <div
                  className={`max-w-[70%] ${
                    isCurrentUser
                      ? "bg-green-600 rounded-l-lg rounded-tr-lg"
                      : "bg-gray-700 rounded-r-lg rounded-tl-lg"
                  } p-3 transition-all duration-200 hover:shadow-lg`}
                >
                  <div className="flex flex-col space-y-1">
                    {!isCurrentUser && chut>0 && (
                      <span className="text-xs text-gray-300 font-medium">
                        {senderDetails.name}
                      </span>
                    )}
                    <p className="text-white break-words">
                      {msg?.message || "Message not available"}
                    </p>
                    <div className="flex items-center justify-end space-x-2">
                      <span className="text-xs text-gray-300 whitespace-nowrap">
                        {formatTime(msg.timestamp)}
                      </span>
                      {/* {isCurrentUser && <MessageStatus status={msg.status} />} */}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default MessageArea;
