import React from 'react';
import { Eye } from 'lucide-react';

const ProjectCard = ({ 
  project, 
  onViewProject, 
  onShowInterest, 
  interestedProjects 
}) => {
  const handleViewClick = () => {
    onViewProject({
      title: project.title,
      description: project.description,
      skills: project.skills,
      tags: project.tags
    });
  };

  return (
    <div className="flex flex-col h-full bg-slate-800 rounded-lg p-4 text-white">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-green-400">{project.title}</h3>
        <button
          onClick={handleViewClick}
          className="text-blue-400 hover:text-blue-300 transition p-1 rounded-full hover:bg-slate-700"
          title="View Project"
        >
          <Eye className="h-5 w-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 mb-4">
        <p className="text-gray-300 mb-4">
          {project.description.substring(0, 100)}...
        </p>
        <div className="flex flex-wrap gap-2">
          {project.skills.slice(0, 3).map((skill, index) => (
            <span 
              key={index} 
              className="px-2 py-1 bg-slate-700 text-gray-200 rounded-md text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto space-y-3">
        <button
          onClick={() => onShowInterest(project.id)}
          disabled={interestedProjects.has(project.id)}
          className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg text-sm
                     disabled:bg-green-800 disabled:opacity-80 disabled:cursor-not-allowed transition"
        >
          {interestedProjects.has(project.id) ? "Interest Shown" : "Show Interest"}
        </button>
        <div className="text-sm text-gray-400 text-center">
          {project.skills.length} Skills Required
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;