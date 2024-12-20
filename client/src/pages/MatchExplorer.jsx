import React, { useState, useEffect } from 'react';
import ProfileCard from '../components/profilecard';
import { MessageCircle, Search , User  } from "lucide-react";
import api from '../utils/axios_instance';

const MatchExplorer = () => {
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('friends');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [profileContext, setProfileContext] = useState(''); // "search", "friends", "pending"

  // Fetch friends and pending requests from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const friendsResponse = await api.get('/api/match/friends', {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const pendingResponse = await api.get('/api/match/received', {
            headers: {
              'Content-Type': 'application/json'
            }
        })
        
        setFriends(friendsResponse.data);
        setPendingRequests(pendingResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Search users in the backend with pagination
  const fetchSearchResults = async (page = 1) => {
    if (!searchTerm) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await api.get(`/api/user/search?query=${encodeURIComponent(searchTerm)}&page=${page}&limit=10`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = response.data;
      setSearchResults(data.users);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  // Fetch data when searchTerm or currentPage changes
  useEffect(() => {
    if (searchTerm) {
      fetchSearchResults(currentPage);
    }
  }, [searchTerm, currentPage]);

  // Handle pagination controls
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Handle decision to accept or reject a pending request
  const handleDecision = async (isLike) => {
    try {
      if (selectedProfile.matchId) {
        // Update existing match
        await api.put(
          `/api/match/${selectedProfile.matchId}`,
          { status: isLike ? "accepted" : "rejected" },
          { headers: { 'Content-Type': 'application/json' } }
        );
      } else {
        // Create new match
        await api.post(
          '/api/match',
          { receiverId: selectedProfile.id },
          { headers: { 'Content-Type': 'application/json' } }
        );
      }

      if (isLike && profileContext === 'pending') {
        setFriends([...friends, selectedProfile]);
        setPendingRequests(pendingRequests.filter(request => request.email !== selectedProfile.email));
      } else if (!isLike && profileContext === 'friends') {
        setFriends(friends.filter(friend => friend.email !== selectedProfile.email));
      } else if (!isLike && profileContext === 'pending') {
        setPendingRequests(pendingRequests.filter(request => request.email !== selectedProfile.email));
      }

      setSelectedProfile(null);
      setProfileContext('');
    } catch (error) {
      console.error(`Error handling decision for ${selectedProfile.name}:`, error);
    }
  };

  const handleProfileSelect = (profile, context) => {
    setSelectedProfile(profile);
    setProfileContext(context);
  };

  return (
    <div className="flex-1 grid grid-cols-[320px_1fr] gap-4 p-4">
      {/* Left Panel */}
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700">
        {/* Search */}
        <div className="p-4">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-700 text-white px-4 py-2 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
          </div>

          {/* Tabs - Only show if not searching */}
          {!searchTerm && (
            <div className="flex border-b border-gray-700 mb-4">
              <button
                className={`flex-1 py-3 text-center ${activeTab === 'friends' ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-400'}`}
                onClick={() => setActiveTab('friends')}
              >
                Friends
              </button>
              <button
                className={`flex-1 py-3 text-center ${activeTab === 'pending' ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-400'}`}
                onClick={() => setActiveTab('pending')}
              >
                Pending
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="h-[calc(100vh-200px)] overflow-y-auto p-4">
          {searchTerm ? (
            // Search results
            searchResults.map((profile) => (
              <div
                key={profile.email}
                className="mb-4 p-3 hover:bg-gray-700 rounded-lg border border-gray-700 cursor-pointer"
                onClick={() => handleProfileSelect(profile, 'search')}
              >
                <div className="flex items-center">
                  <img src={profile.avatar} alt={profile.name} className="w-10 h-10 rounded-full mr-3" />
                  <div>
                    <p className="font-semibold text-white">{profile.name}</p>
                    <p className="text-sm text-gray-400">{profile.email}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            // Regular tabs content
            activeTab === 'friends' ? (
              friends.map((friend) => (
                <div
                  key={friend.email}
                  className="mb-4 p-3 hover:bg-gray-700 rounded-lg border border-gray-700 cursor-pointer"
                  onClick={() => handleProfileSelect(friend, 'friends')}
                >
                  <div className="flex items-center">
                    <img src={friend.avatar} alt={friend.name} className="w-10 h-10 rounded-full mr-3" />
                    <div>
                      <p className="font-semibold text-white">{friend.name}</p>
                      <p className="text-sm text-gray-400">{friend.email}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              pendingRequests.map((request) => (
                <div
                  key={request.email}
                  className="mb-4 p-3 hover:bg-gray-700 rounded-lg border border-gray-700"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center cursor-pointer" onClick={() => handleProfileSelect(request, 'pending')}>
                      <img src={request.avatar} alt={request.name} className="w-10 h-10 rounded-full mr-3" />
                      <div>
                        <p className="font-semibold text-white">{request.name}</p>
                        <p className="text-sm text-gray-400">{request.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )
          )}
          {/* Pagination Controls */}
          {searchTerm && (
            <div className="flex justify-between items-center mt-4">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="px-4 py-2 bg-gray-600 text-white rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-gray-400">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-4 py-2 bg-gray-600 text-white rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Profile Card */}
      <div className="flex items-center justify-center">
        {/* Right Side - Profile Card */}
        <div className="flex items-center justify-center">
          {selectedProfile ? (
            <ProfileCard
              profile={selectedProfile}
              onDecision={handleDecision}
              context={profileContext} // Pass the context directly: "search", "friends", or "pending"
              className="w-[400px]"
            />
          ) : (
            <div className="text-center text-gray-400">
              <User className="w-16 h-16 mx-auto mb-4" />
              <p>Select a user to view their profile</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default MatchExplorer;
