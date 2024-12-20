import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";
import api from "../utils/axios_instance";

const CreateProject = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const projectData = {
      title,
      description,
      skills: skills.split(",").map((skill) => skill.trim()),
      tags: tags.split(",").map((tag) => tag.trim()),
    };

      try {
        const response = await api.post('/api/project', projectData, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
      
        if (response.status == 201) {
          setSuccess("Project created successfully!");
          setTimeout(() => navigate("/dashboard"), 2000);
        } else {
          const errorData = await response.data;
          setError(errorData.message || "Error creating project.");
        }
      } catch (err) {
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
  };

  return (
    

      <main className="flex-1 overflow-y-auto p-8 space-y-6 bg-gray-900">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-green-400">Create New Project</h1>
            <p className="text-gray-400 mt-2">Bring your ideas to life!</p>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
          >
            Back to Dashboard
          </button>
        </header>

        <section className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Project Title */}
            <div>
              <label htmlFor="title" className="block text-gray-400 font-medium">
                Project Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter project title"
                required
                className="w-full px-4 py-2 mt-2 bg-gray-700 text-gray-300 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Project Description */}
            <div>
              <label htmlFor="description" className="block text-gray-400 font-medium">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write a short description of the project"
                required
                rows="4"
                className="w-full px-4 py-2 mt-2 bg-gray-700 text-gray-300 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Skills Required */}
            <div>
              <label htmlFor="skills" className="block text-gray-400 font-medium">
                Skills Required (comma-separated)
              </label>
              <input
                type="text"
                id="skills"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="e.g., React, Node.js, PostgreSQL"
                required
                className="w-full px-4 py-2 mt-2 bg-gray-700 text-gray-300 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-gray-400 font-medium">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g., Open Source, Hackathon"
                className="w-full px-4 py-2 mt-2 bg-gray-700 text-gray-300 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Submit and Feedback */}
            <div className="flex flex-col space-y-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
              >
                {loading ? "Creating..." : "Create Project"}
              </button>
              {success && <p className="text-green-500 font-medium">{success}</p>}
              {error && <p className="text-red-500 font-medium">{error}</p>}
            </div>
          </form>
        </section>
      </main>
    
  );
};

export default CreateProject;
