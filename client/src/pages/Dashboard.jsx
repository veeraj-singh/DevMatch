import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProjectCard from "../components/projectcard";
import api from "../utils/axios_instance";

import { 
  Code, 
  Terminal, 
  GitBranch, 
  PlusCircle,
  Eye,
  Zap
} from "lucide-react";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [project, setProject] = useState({
    title : "" ,
    description : "" ,
    skills : [] ,
    tags : []
  }); 
  const [loading, setLoading] = useState(true);
  const [interestedProjects, setInterestedProjects] = useState(new Set());
  const [isModalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleShowInterest = async (projectId) => {
    try {
      const response = await api.post(`/api/project/${projectId}/interest`, {}, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.status == 201) {
        setInterestedProjects((prev) => new Set(prev).add(projectId));
        console.log("Interest recorded successfully:", response.data.message);
        alert("You've successfully shown interest in this project!");
      } else {
        console.error("Error showing interest:", response.data.message || "Unknown error");
        alert(response.data.message || "Failed to show interest. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again later.");
    }
  };
  

  const handleViewProject = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await api.get("/api/project/bulk");
        setProjects(data || []);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
      
      <main className="flex-1 overflow-y-auto p-8 space-y-6 bg-gray-900">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-green-400 flex items-center">
              <Terminal className="mr-3" /> DevMatch Dashboard
            </h1>
            <p className="text-gray-400 mt-2">
              Create, Connect, Collaborate
            </p>
          </div>
          <button
            onClick={() => navigate("/create-project")}
            className="flex items-center space-x-2 bg-green-600 text-white px-5 py-3 rounded-lg hover:bg-green-700 transition"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Create Project</span>
          </button>
        </header>

        {/* Projects Section */}
        <section className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-green-400 flex items-center">
              <GitBranch className="mr-2" /> Active Projects
            </h2>
            <div className="flex items-center space-x-2 text-gray-400">
              <Zap className="w-4 h-4" />
              <span>{projects.length} Active Projects</span>
            </div>
          </div>

          {loading ? (
            <div className="text-gray-400 font-mono text-center py-8">
              <span className="animate-pulse">Loading projects...</span>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-8 bg-gray-700 rounded-lg">
              <p className="text-gray-400 mb-4">No active projects yet</p>
              <button
                onClick={() => navigate("/create-project")}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Start Your First Project
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-gray-700 p-5 rounded-lg border border-gray-600 hover:border-green-500 transition transform hover:-translate-y-1 flex flex-col min-h-[200px]"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-green-400 font-bold text-lg">
                    {project.title}
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setProject({
                          title: project.title,
                          description: project.description,
                          skills: project.skills,
                          tags: project.tags
                        })
                        handleViewProject()
                      }}
                      className="text-blue-400 hover:text-blue-300 transition"
                      title="View Project"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-300 text-sm mb-3">
                  {project.description.substring(0, 112)}...
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {project.skills.slice(0, 3).map((skill) => (
                    <span
                      key={skill}
                      className="bg-gray-600 text-gray-200 px-2 py-1 rounded-full text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="mt-auto flex justify-between items-center">
                  <button
                    onClick={() => {
                      handleShowInterest(project.id)
                    }}
                    disabled={interestedProjects.has(project.id)}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg text-xs hover:bg-green-700 transition disabled:opacity-75 disabled:cursor-not-allowed"
                  >
                    {interestedProjects.has(project.id) ? "Interest Shown" : "Show Interest"}
                  </button>
                  <span className="text-xs text-gray-400">
                    {project.skills.length} Skills Required
                  </span>
                </div>
              </div>
            ))}
          </div>)}

          {/* Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-gray-800 w-full max-w-2xl p-8 rounded-lg text-white shadow-lg">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-green-400">{project.title}</h2>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-400 hover:text-gray-200 transition"
                  >
                    ✖
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Project Description */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-300 mb-2">Description</h3>
                    <p className="text-gray-400">{project.description}</p>
                  </div>

                  {/* Required Skills */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-300 mb-2">Required Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.skills.map((skill) => (
                        <span
                          key={skill}
                          className="bg-gray-700 text-gray-200 px-3 py-1 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  {project.tags?.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold text-gray-300 mb-2">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-gray-600 text-gray-200 px-3 py-1 rounded-full text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

  );
};

export default Dashboard;