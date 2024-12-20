import React, { useState, useEffect } from "react";
import api from "../utils/axios_instance";
import { Edit3, User, Trash2 } from "lucide-react";

const Profile = () => {
  // ... existing state declarations remain the same ...
  const [userInfo, setUserInfo] = useState({
    name: "",
    avatarUrl: "",
    bio: "",
    skills: [],
    interests: [],
    experience: null,
    location: "",
  });
  const [projects, setProjects] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ... existing useEffect and handler functions remain the same ...
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setLoading(true);
        const userResponse = await api.get('/api/user', {
          headers: { 'Content-Type': 'application/json' }
        });
        const projectsResponse = await api.get('/api/project', {
          headers: { 'Content-Type': 'application/json' }
        });
        
        const userInfo = userResponse.data;
        const projects = projectsResponse.data;
    
        setUserInfo(userInfo.data);
        setProjects(projects);
      } catch (err) {
        console.error("Error fetching user info and projects:", err);
        setError("Failed to load user information and projects. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  // ... other existing handler functions remain the same ...

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
        <p className="text-lg font-semibold text-red-400">{error}</p>
      </div>
    );
  }

  const TagPill = ({ text }) => (
    <span className="inline-block bg-gray-700 text-green-400 px-3 py-1 rounded-full text-sm mr-2 mb-2">
      {text}
    </span>
  );

  return (
    <main className="flex-1 overflow-y-auto p-8 space-y-6 bg-gray-900">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-green-400 flex items-center">
          <User className="mr-3" /> My Profile
        </h1>
      </header>

      <section className="bg-gray-800 p-6 rounded-lg border border-gray-700 space-y-4">
        <h2 className="text-xl font-bold text-green-400 flex items-center">
          <Edit3 className="mr-2" /> User Information
        </h2>
        {editMode ? (
          <div className="space-y-4">
            <div className="flex items-start space-x-6">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-700">
                <img
                  src={userInfo.avatarUrl || "/api/placeholder/128/128"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 space-y-4">
                {/* Existing edit form fields */}
                <div>
                  <label className="block text-gray-400 mb-1 font-medium">Name</label>
                  <input
                    type="text"
                    value={userInfo.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                {/* ... other form fields remain the same ... */}
              </div>
            </div>
            <button
              onClick={handleSave}
              className="bg-green-600 px-6 py-2 rounded-lg text-white hover:bg-green-700 font-medium"
            >
              Save Changes
            </button>
          </div>
        ) : (
          <div className="flex items-start space-x-6">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-700">
              <img
                src={userInfo.avatarUrl || "/api/placeholder/128/128"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-2">{userInfo.name || "N/A"}</h3>
              <p className="text-gray-400 mb-4">{userInfo.bio || "No bio available"}</p>
              
              <div className="mb-4">
                <h4 className="text-green-400 font-medium mb-2">Skills</h4>
                <div className="flex flex-wrap">
                  {userInfo.skills?.map((skill, index) => (
                    <TagPill key={index} text={skill} />
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-green-400 font-medium mb-2">Interests</h4>
                <div className="flex flex-wrap">
                  {userInfo.interests?.map((interest, index) => (
                    <TagPill key={index} text={interest} />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="text-green-400 font-medium">Experience</h4>
                  <p className="text-white">{userInfo.experience || "0"} years</p>
                </div>
                <div>
                  <h4 className="text-green-400 font-medium">Location</h4>
                  <p className="text-white">{userInfo.location || "Not specified"}</p>
                </div>
              </div>

              <button
                onClick={() => setEditMode(true)}
                className="px-4 py-2 rounded-lg text-green-600 hover:text-green-500 font-medium inline-flex items-center"
              >
                <Edit3 className="mr-2 h-4 w-4" />
                Edit Profile
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="bg-gray-800 p-6 rounded-lg border border-gray-700 space-y-4">
        <h2 className="text-xl font-bold text-green-400">My Projects</h2>
        <div className="space-y-4">
          {projects.map((project, index) => (
            <div key={project.id} className="bg-gray-700 p-6 rounded-lg border border-gray-600">
              {editIndex === index ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={project.title}
                    onChange={(e) => handleProjectEdit(index, "title", e.target.value)}
                    className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg font-medium"
                    placeholder="Project Title"
                  />
                  <textarea
                    value={project.description}
                    onChange={(e) => handleProjectEdit(index, "description", e.target.value)}
                    className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg"
                    rows="3"
                    placeholder="Project Description"
                  />
                  <div>
                    <label className="block text-gray-400 mb-1 font-medium">Skills</label>
                    <input
                      type="text"
                      value={project.skills.join(", ")}
                      onChange={(e) => handleProjectEdit(index, "skills", e.target.value.split(",").map(s => s.trim()))}
                      className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg"
                      placeholder="Separate skills with commas"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1 font-medium">Tags</label>
                    <input
                      type="text"
                      value={project.tags.join(", ")}
                      onChange={(e) => handleProjectEdit(index, "tags", e.target.value.split(",").map(t => t.trim()))}
                      className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg"
                      placeholder="Separate tags with commas"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleSaveProject(project)}
                      className="bg-green-600 px-4 py-2 rounded-lg text-white hover:bg-green-700 font-medium"
                    >
                      Save Project
                    </button>
                    <button
                      onClick={() => setEditIndex(null)}
                      className="bg-gray-600 px-4 py-2 rounded-lg text-white hover:bg-gray-700 font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                  <p className="text-gray-400 mb-4">{project.description}</p>
                  
                  <div className="mb-4">
                    <h4 className="text-green-400 font-medium mb-2">Skills</h4>
                    <div className="flex flex-wrap">
                      {project.skills.map((skill, i) => (
                        <TagPill key={i} text={skill} />
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-green-400 font-medium mb-2">Tags</h4>
                    <div className="flex flex-wrap">
                      {project.tags.map((tag, i) => (
                        <TagPill key={i} text={tag} />
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => setEditIndex(index)}
                      className="px-4 py-2 rounded-lg text-green-600 hover:text-green-500 font-medium inline-flex items-center"
                    >
                      <Edit3 className="mr-2 h-4 w-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      className="px-4 py-2 rounded-lg text-red-600 hover:text-red-500 font-medium inline-flex items-center"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Profile;