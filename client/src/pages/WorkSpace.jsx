import React, { useState, useEffect } from "react";
import api from "../utils/axios_instance";
import {
  MessageCircle,
  Users,
  CheckCircle,
  XCircle,
  UserX,
  X,
  Send,
  PlusCircle,
  Search,
  Settings,
  Bell,
  FolderOpen,
} from "lucide-react";

const Workspaces = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [requests, setRequests] = useState([]);
  const [members, setMembers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [interestId, setInterestId] = useState(null);

  // Fetch all workspaces on component mount
  useEffect(() => {
    api.get('/api/project/myworkspaces', {
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(response => {
      setWorkspaces(response.data);
    })
    .catch(error => {
      console.error('Error fetching workspaces:', error);
    });
  }, []);

  // Fetch workspace details and messages
  const handleWorkspaceClick = (workspace) => {
    setSelectedWorkspace(workspace);

    // Fetch messages for the selected workspace
    // fetch(`/api/workspaces/${workspace.id}/messages`)
    //   .then((res) => res.json())
    //   .then((data) => setMessages(data))
    //   .catch((err) => console.error("Error fetching messages:", err));

    // Fetch members for the selected workspace
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

  const handleMessageChange = (e) => setMessage(e.target.value);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        text: message,
        sender: "User",
        timestamp: new Date().toISOString(),
      };

      fetch(`/api/workspaces/${selectedWorkspace.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMessage),
      })
        .then((res) => res.json())
        .then((data) => {
          setMessages((prevMessages) => [...prevMessages, data]);
          setMessage("");
        })
        .catch((err) => console.error("Error sending message:", err));
    }
  };

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
      const response = await api.put(
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
      const response = await api.put(
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

  const handleKickUser = () => {
    fetch(`/api/workspaces/${selectedWorkspace.id}/members/${selectedUser.id}`, {
      method: "DELETE",
    })
      .then(() => {
        setMembers((prevMembers) =>
          prevMembers.filter((user) => user.id !== selectedUser.id)
        );
        closeModal();
      })
      .catch((err) => console.error("Error kicking user:", err));
  };

  return (
    <>
      <main className="flex-1 overflow-hidden bg-gray-900">
        <header className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-8">
          <h1 className="text-xl font-bold text-green-400 flex items-center">
            <Users className="mr-3" /> Workspaces
          </h1>
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-700 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-gray-700 rounded-full transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="flex h-[calc(100vh-4rem)]">
          <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
            <div className="p-4">
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Search workspaces..."
                  className="w-full bg-gray-700 text-white px-4 py-2 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
              </div>

              <div className="space-y-2">
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
                      {workspace.unreadCount > 0 && (
                        <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                          {workspace.unreadCount}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-sm text-gray-400 truncate">
                        {workspace.lastMessage}
                      </span>
                      <span className="text-xs text-gray-500">
                        {workspace.lastActivity}
                      </span>
                    </div>
                    {workspace.role === "OWNER" ? (
                      <span className="text-green-400 text-xs mt-1">Owner</span>
                    ) : (
                      <span className="text-green-400 text-xs mt-1">Member</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

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

                {/* Messages Panel */}
                <div className="flex-1 overflow-y-auto bg-gray-900">
                  <div className="p-6 space-y-4">
                    {messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex ${
                          msg.sender === "User" ? "justify-end" : ""
                        }`}
                      >
                        <div
                          className={`rounded-lg px-4 py-2 max-w-md ${
                            msg.sender === "User"
                              ? "bg-green-500 text-white"
                              : "bg-gray-700 text-gray-200"
                          }`}
                        >
                          <p className="text-sm">{msg.text}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="h-16 bg-gray-800 border-t border-gray-700 px-6 flex items-center">
                  <input
                    type="text"
                    value={message}
                    onChange={handleMessageChange}
                    placeholder="Type a message..."
                    className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="ml-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
                  >
                    <Send className="w-5 h-5" />
                  </button>
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-1/3">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 bg-red-500 p-2 rounded-full"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {modalType === "viewRequests" && (
              <>
                <h2 className="text-xl font-medium mb-4">Pending Requests</h2>
                <div className="space-y-4">
                  {requests.map((user) => (
                    <div
                      key={user.id}
                      className="flex justify-between items-center bg-gray-700 px-4 py-3 rounded-lg"
                    >
                      <p>{user.user.name}</p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>{ 
                            setInterestId(user.id)
                            openModal("acceptUser", user.user)
                          }}
                          className="bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600 transition"
                        >
                          <CheckCircle className="w-4 h-4 text-white" />
                        </button>
                        <button
                          onClick={() =>{ 
                            setInterestId(user.id)
                            openModal("rejectUser", user.user)
                          }}
                          className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition"
                        >
                          <XCircle className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {modalType === "viewMembers" && (
              <>
                <h2 className="text-xl font-medium mb-4">Workspace Members</h2>
                <div className="space-y-4">
                  {members.map((user) => (
                    <div
                      key={user.id}
                      className="flex justify-between items-center bg-gray-700 px-4 py-3 rounded-lg"
                    >
                      <p>{user.user.name}</p>
                      {selectedWorkspace.role === "OWNER" && !(user.role === "OWNER") && (
                        <button
                          onClick={() =>{ 
                            openModal("kickUser", user.user)
                          }}
                          className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition"
                        >
                          <UserX className="w-4 h-4 text-white" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}

            {modalType === "acceptUser" && (
              <>
                <h2 className="text-xl font-medium mb-4">
                  Accept {selectedUser?.name} to Workspace?
                </h2>
                <div className="flex space-x-4">
                  <button
                    onClick={handleAcceptUser}
                    className="flex-1 bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600 transition"
                  >
                    Accept
                  </button>
                  <button
                    onClick={closeModal}
                    className="flex-1 bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}

            {modalType === "rejectUser" && (
              <>
                <h2 className="text-xl font-medium mb-4">
                  Reject {selectedUser?.name}'s Request?
                </h2>
                <div className="flex space-x-4">
                  <button
                    onClick={handleRejectUser}
                    className="flex-1 bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    Reject
                  </button>
                  <button
                    onClick={closeModal}
                    className="flex-1 bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}

            {modalType === "kickUser" && (
              <>
                <h2 className="text-xl font-medium mb-4">
                  Kick {selectedUser?.name} from Workspace?
                </h2>
                <div className="flex space-x-4">
                  <button
                    onClick={handleKickUser}
                    className="flex-1 bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    Kick
                  </button>
                  <button
                    onClick={closeModal}
                    className="flex-1 bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Workspaces;
