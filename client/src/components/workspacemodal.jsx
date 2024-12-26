import React from 'react';
import { X, ClipboardList, CheckCircle, XCircle, UserX } from 'lucide-react';
import TaskBoard from "../components/taskboard";

const WorkspaceModal = ({ 
  showModal, 
  modalType, 
  closeModal, 
  selectedWorkspace,
  selectedUser,
  requests,
  members,
  handleAcceptUser,
  handleRejectUser,
  setInterestId,
  openModal 
}) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-gray-800 p-6 rounded-lg ${
        modalType === "taskBoard" ? "w-3/4 max-w-7xl" : "w-1/3"}`}>
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 bg-red-500 p-2 rounded-full"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {modalType === "taskBoard" && (
          <>
            <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
              <ClipboardList className="w-5 h-5" />
              Task Board - {selectedWorkspace.projectTitle}
            </h2>
            <div className="mt-4 bg-gray-900 rounded-lg">
              <TaskBoard workspaceId={selectedWorkspace.workspaceId}/>
            </div>
          </>
        )}

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
                      onClick={() => openModal("kickUser", user.user)}
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
  );
};

export default WorkspaceModal;