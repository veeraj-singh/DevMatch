import React, { useState, useEffect , useRef , useCallback } from "react";
import api from "../utils/axios_instance";
import ListSkeleton from "../components/listskeleton";
import {
  MessageCircle,
  Users,
  Send,
  PlusCircle,
  Search,
  FolderOpen,
  ClipboardList
} from "lucide-react";
import WorkspaceModal from "../components/workspacemodal";
import MessageArea from "../components/messagearea";
import { io } from 'socket.io-client';

const MESSAGES_PER_PAGE = 20;

const Workspaces = () => {
  const [socket, setSocket] = useState(null);
  const [joinedRooms, setJoinedRooms] = useState([]);
  const [workspaces, setWorkspaces] = useState([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [userId, setUserId] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [requests, setRequests] = useState([]);
  const [members, setMembers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [interestId, setInterestId] = useState(null);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [loadinglists, setLoadinglists] = useState(true);
  const [hasMoreMessagesMap, setHasMoreMessagesMap] = useState(new Map()); // Map to track hasMoreMessages per chat
  const [error, setError] = useState(null);

  const messagesEndRef = useRef(null);
  const messageContainerRef = useRef(null);
  const isLoadingMoreRef = useRef(false);


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

  // Fetch all workspaces on component mount
  useEffect(() => {
    setLoadinglists(true)
    api.get('/api/project/myworkspaces', {
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(response => {
      setWorkspaces(response.data.res);
      setUserId(response.data.userId)
    })
    .catch(error => {
      console.error('Error fetching workspaces:', error);
    }).finally(setLoadinglists(false))
  }, []);

  const loadMessages = async (workspaceId, page) => {
    const currentHasMore = hasMoreMessagesMap.get(workspaceId);
    if (isLoadingMoreRef.current || currentHasMore === false) {
      console.log("No more messages or already loading");
      return;
    }
    isLoadingMoreRef.current = true;
    setLoadingMessages(true);

    try {
      const prevHeight = messageContainerRef.current?.scrollHeight || 0;

      const response = await api.get(`/api/messages/workspace/${workspaceId}?page=${page}&limit=${MESSAGES_PER_PAGE}`);
      const { messages: newMessages, hasMore } = response.data;
      setMessages(prevMessages => {
        const existingIds = new Set(prevMessages.map(msg => msg._id));
        const filteredMessages = newMessages.filter(msg => !existingIds.has(msg._id));
        return [...filteredMessages.reverse(), ...prevMessages];
      });

      setHasMoreMessagesMap((prevMap) => {
        const updatedMap = new Map(prevMap);
        updatedMap.set(workspaceId, hasMore);
        return updatedMap;
      });

      if (messageContainerRef.current && page > 0) {
        const newHeight = messageContainerRef.current.scrollHeight;
        const heightDifference = newHeight - prevHeight;
        messageContainerRef.current.scrollTop = heightDifference;
      }

    } catch (error) {
      console.error("Error fetching messages:", error);
      setError("Failed to load messages. Please try again.");
    } finally {
      setLoadingMessages(false);
      isLoadingMoreRef.current = false;
    }
  };


  useEffect(() => {
      loadMessages(selectedWorkspace?.workspaceId,0) ;
    }, [selectedWorkspace]);


  // Fetch workspace details and messages
  const handleWorkspaceClick = async (workspace) => {
    if (selectedWorkspace?.workspaceId === workspace.workspaceId) return;

    setSelectedWorkspace(workspace);
    setMessages([]);
    setHasMoreMessagesMap((prevMap) => {
      const updatedMap = new Map(prevMap);
      updatedMap.set(workspace.workspaceId, true); 
      return updatedMap;
    });
    isLoadingMoreRef.current = false;

    if (!joinedRooms.includes(workspace.workspaceId)) {
      socket?.emit('join-room', { roomId: `workspace-${workspace.workspaceId}` });
      setJoinedRooms(prev => [...prev, workspace.workspaceId]);
    }
    const currentHasMore = hasMoreMessagesMap.get(workspace.workspaceId);
    if (currentHasMore === undefined || currentHasMore) {
      await loadMessages(workspace.workspaceId, 0);
    }
    setTimeout(() => scrollToBottom(false), 100);

    api.get(`/api/project/${workspace.projectId}/members`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      setMembers(response.data);
    })
    .catch(error => {
      console.error('Error fetching members:', error);
    });
  };


  const handleSendMessage = () => {
    if (!message.trim() || !selectedWorkspace || !socket) return;

    socket.emit('send-message', {
      roomId: `workspace-${selectedWorkspace.workspaceId}`,
      senderId: userId,
      message,
    });

    setMessage("");
    setTimeout(() => scrollToBottom(), 100);
  };

  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
    });
  };
  
  useEffect(() => {
    if (!socket) return;
    const handleReceiveMessage = (messageData) => {
      console.log(messageData)
      if (selectedWorkspace && parseInt(messageData.workspaceId) === selectedWorkspace.workspaceId) {
        setMessages(prev => [...prev, messageData]);
        if (messageContainerRef.current) {
          const { scrollTop, scrollHeight, clientHeight } = messageContainerRef.current;
          const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
          if (isNearBottom) {
            setTimeout(() => scrollToBottom(), 100);
          }
        }
      }
    };
    socket.on("receive-message", handleReceiveMessage);
    return () => {
      socket.off("receive-message", handleReceiveMessage);
    };
  }, [socket, selectedWorkspace]);


  const handleScroll = useCallback((e) => {
    const { scrollTop } = e.target;
    
    if (scrollTop < 100 && !isLoadingMoreRef.current && hasMoreMessagesMap.get(selectedWorkspace.workspaceId)) {
      const nextPage = Math.floor(messages.length / MESSAGES_PER_PAGE);
      loadMessages(selectedWorkspace.workspaceId, nextPage);
    }
  }, [hasMoreMessagesMap, messages.length, selectedWorkspace]);


  // Fetch requests when modal opens
  useEffect(() => {
    if (modalType === "viewRequests" && selectedWorkspace) {
      api.get(`/api/project/${selectedWorkspace.projectId}/interests?status=PENDING`, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        setRequests(response.data);
      })
      .catch(error => {
        console.error('Error fetching requests:', error);
      });
    }
  }, [modalType, selectedWorkspace]);

  const openModal = (type, user = null) => {
    setModalType(type);
    setSelectedUser(user);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const handleAcceptUser = async () => {
    try {
      await api.put(
        `/api/project/${selectedWorkspace.projectId}/interests/${interestId}/respond`,
        { status: "ACCEPTED" },
        { headers: { 'Content-Type': 'application/json' } }
      );
  
      setMembers((prevMembers) => [
        ...prevMembers,
        { user: selectedUser, role: 'MEMBER' },
      ]);
  
      setRequests((prevRequests) =>
        prevRequests.filter((user) => user.user.id !== selectedUser.id)
      );
  
      closeModal();
    } catch (error) {
      console.error("Error accepting user:", error);
    }
  };

  const handleRejectUser = async() => {
    try {
      await api.put(
        `/api/project/${selectedWorkspace.projectId}/interests/${interestId}/respond`,
        { status: "REJECTED" },
        { headers: { 'Content-Type': 'application/json' } }
      );
  
      setRequests((prevRequests) =>
        prevRequests.filter((user) => user.user.id !== selectedUser.id)
      );
  
      closeModal();
    } catch (error) {
      console.error("Error rejecting user:", error);
    }
  };

  return (
    <>
      <main className="flex-1 overflow-hidden bg-gray-900">
        <div className="flex h-full">
          {/* Left Panel - Workspace List */}
          <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
            <div className="p-4">
              <h1 className="text-xl font-bold text-green-400 flex items-center mb-4">
                <Users className="mr-3" /> Workspaces
              </h1>
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Search workspaces..."
                  className="w-full bg-gray-700 text-white px-4 py-2 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
              </div>
                  {error && (
                <div className="mb-4 p-2 bg-red-600 text-white rounded">
                  {error}
                </div>
              )}
              {loadinglists ? (
                  <ListSkeleton />
                ) : ( <div className="space-y-2">
                {workspaces.map((workspace) => (
                  <div
                    key={workspace.workspaceId}
                    onClick={() => handleWorkspaceClick(workspace)}
                    className={`flex flex-col p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-700 ${
                      selectedWorkspace?.workspaceId === workspace.workspaceId
                        ? "bg-gray-700 ring-1 ring-green-500"
                        : ""
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{workspace.projectTitle}</span>
                    </div>
                    {workspace.role === "OWNER" ? (
                      <span className="text-green-400 text-xs mt-1">Owner</span>
                    ) : (
                      <span className="text-green-400 text-xs mt-1">Member</span>
                    )}
                  </div>
                ))}
              </div>
              )}
            </div>
          </div>

          {/* Right Panel - Chat Window */}
          <div className="flex-1 flex flex-col bg-gray-900">
            {selectedWorkspace ? (
              <>
                <div className="h-16 bg-gray-800 border-b border-gray-700 px-6 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <h2 className="font-medium flex items-center">
                      <MessageCircle className="mr-2 text-green-400" />
                      {selectedWorkspace.projectTitle}
                    </h2>
                    <span className="text-sm text-gray-400">
                      {members.length} members
                    </span>
                  </div>

                  {/* Task Board Button (with improved layout) */}
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => openModal("taskBoard")}
                      className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all duration-300 ease-in-out flex items-center gap-2"
                    >
                      <ClipboardList className="w-4 h-4" />
                      Task Board
                    </button>
                    {selectedWorkspace.role === "OWNER" && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openModal("viewRequests")}
                          className="group relative w-8 h-8 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300 ease-in-out flex items-center justify-center"
                          title="Interested Users"
                        >
                          <PlusCircle className="w-4 h-4" />
                          {requests.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                              {requests.length}
                            </span>
                          )}
                        </button>
                        <button
                          onClick={() => openModal("viewMembers")}
                          className="w-8 h-8 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition-all duration-300 ease-in-out flex items-center justify-center"
                          title="View Members"
                        >
                          <Users className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div
                  ref={messageContainerRef}
                  className="flex-1 overflow-auto px-4 py-2"
                  onScroll={handleScroll}
                >
                  {loadingMessages && (
                    <div className="text-center p-2">
                      <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-green-500 border-t-transparent"></div>
                    </div>
                  )}
                  <MessageArea 
                    messages={messages} 
                    userId={userId} 
                    users={members}
                  />
                  <div ref={messagesEndRef} />
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
                      disabled={!message.trim() || loadingMessages}
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
                  <FolderOpen className="w-16 h-16 mx-auto mb-4" />
                  <p>Select a workspace to get started</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>


      {/* Modal Component */}
      <WorkspaceModal
        showModal={showModal}
        modalType={modalType}
        closeModal={closeModal}
        selectedWorkspace={selectedWorkspace}
        selectedUser={selectedUser}
        requests={requests}
        members={members}
        handleAcceptUser={handleAcceptUser}
        handleRejectUser={handleRejectUser}
        setInterestId={setInterestId}
        openModal={openModal}
      />
    </>
  );
};

export default Workspaces;