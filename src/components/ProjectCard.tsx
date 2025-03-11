import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Assuming this is the correct Project type (adjust based on your actual api.ts)
interface Project {
  id: number;
  slug: string;
  title: string;
  short_description: string;
  thumbnail?: string;
  technologies?: {
    genres?: string[];
  };
}

interface ProjectCardProps {
  project: Project;
  priority?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, priority = false }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
    >
      <Link to={`/projects/${project.slug}`} className="block">
        <div className="relative overflow-hidden">
          <img
            src={project.thumbnail || `https://picsum.photos/600/400?random=${project.id}`}
            alt={project.title}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
            loading={priority ? 'eager' : 'lazy'}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
            <div className="space-x-4">
              <span className="inline-block px-4 py-2 bg-primary text-white rounded-lg">
                View Details
              </span>
            </div>
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{project.short_description}</p>
          <div className="flex flex-wrap gap-2">
            {project.technologies?.genres?.map((tech: string, index: number) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProjectCard;