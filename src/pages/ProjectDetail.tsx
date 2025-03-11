import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { projectsApi, Project } from '../services/api';
import { ArrowTopRightOnSquareIcon, CodeBracketIcon, ArrowLeftIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { ExclamationCircleIcon } from '@heroicons/react/24/solid';

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0]);
  const heroTranslateY = useTransform(scrollY, [0, 600], [0, -200]);
  const springHeroTranslateY = useSpring(heroTranslateY, { stiffness: 80, damping: 20 });

  const detailsRef = useRef(null);
  const isDetailsInView = useInView(detailsRef, { once: true, margin: "0px 0px -200px 0px" });

  useEffect(() => {
    fetchProject();
  }, [slug]);

  const fetchProject = async () => {
    if (!slug) return;
    try {
      setLoading(true);
      setError(null);
      const data = await projectsApi.getProject(slug);
      setProject(data);
    } catch (err) {
      setError('Failed to fetch project details. Please try again later.');
      console.error('Error fetching project:', err);
    } finally {
      setLoading(false);
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: "easeOut" },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.4,
        delayChildren: 0.5,
      },
    },
  };

  const staggerItem = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex justify-center items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-starry-night opacity-50"></div>
        <motion.div
          className="relative"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <div className="absolute inset-0 bg-indigo-400/20 rounded-full blur-3xl animate-pulse"></div>
          <motion.div
            className="relative animate-spin rounded-full h-24 w-24 border-4 border-indigo-400 border-t-transparent"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col justify-center items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-starry-night opacity-50"></div>
        <motion.div
          initial={{ scale: 0, rotate: 360 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 150, damping: 15 }}
        >
          <ExclamationCircleIcon className="h-28 w-28 text-red-400 mx-auto" />
        </motion.div>
        <motion.p
          className="mt-8 text-xl text-gray-300 max-w-md mx-auto text-center"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
        >
          {error || 'Project not found'}
        </motion.p>
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
        >
          <Link
            to="/projects"
            className="mt-6 inline-flex items-center px-6 py-3 border border-gray-700/30 bg-gray-800/20 backdrop-blur-md text-gray-200 rounded-xl hover:bg-gray-700/40 transition-all duration-300 shadow-lg shadow-indigo-400/10"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Projects
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 relative overflow-x-hidden">
      {/* Starry Night Background */}
      <div className="absolute inset-0 bg-starry-night opacity-50 pointer-events-none"></div>

      {/* Hero Section */}
      <div className="relative min-h-screen flex flex-col justify-center items-center px-6 lg:px-8">
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-black/70 to-transparent z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        />
        <motion.div
          className="absolute inset-0 z-0"
          style={{ translateY: springHeroTranslateY, opacity: heroOpacity }}
        >
          <img
            src={project.thumbnail}
            alt={project.title}
            className="w-full h-screen object-cover opacity-30 rounded-b-3xl"
          />
        </motion.div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-5xl mx-auto">
          <motion.h1
            className="text-5xl sm:text-7xl font-extrabold tracking-tight text-gray-100 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-indigo-400"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
          >
            {project.title}
          </motion.h1>
          <motion.p
            className="text-lg text-gray-300 leading-relaxed mb-10 max-w-3xl mx-auto"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            {project.short_description}
          </motion.p>
          <motion.div
            className="flex items-center justify-center space-x-4"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {project.github_url && (
              <motion.a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 border border-gray-700/30 bg-gray-800/20 backdrop-blur-md text-gray-200 rounded-xl hover:bg-gray-900/40 transition-all duration-300 shadow-lg shadow-indigo-400/10"
                variants={staggerItem}
                whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(129, 140, 248, 0.3)" }}
                whileTap={{ scale: 0.95 }}
              >
                <CodeBracketIcon className="w-5 h-5 mr-2" />
                Source Code
              </motion.a>
            )}
            {project.live_url && (
              <motion.a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 border border-indigo-400/50 bg-indigo-500/10 backdrop-blur-md text-indigo-300 rounded-xl hover:bg-indigo-500/20 transition-all duration-300 shadow-lg shadow-indigo-400/20"
                variants={staggerItem}
                whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(129, 140, 248, 0.4)" }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowTopRightOnSquareIcon className="w-5 h-5 mr-2" />
                Live Demo
              </motion.a>
            )}
          </motion.div>
          <motion.div
            className="mt-16"
            animate={{ y: [0, 15, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <ChevronDownIcon className="w-10 h-10 text-gray-400 mx-auto" />
          </motion.div>
        </div>
      </div>

      {/* Project Details Section */}
      <div className="relative container mx-auto px-6 lg:px-8 py-32">
        {/* Project Description (Scroll-Triggered Reveal) */}
        <motion.div
          ref={detailsRef}
          className="mb-20 max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={isDetailsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h2 className="text-3xl font-semibold text-gray-100 mb-6">Project Overview</h2>
          <p className="text-gray-300 leading-relaxed">
            {project.short_description || 'This project showcases innovative solutions, blending cutting-edge technology with creative design to deliver an exceptional user experience.'}
          </p>
        </motion.div>

        {/* Project Info Cards */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-12"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Technologies */}
          <motion.div
            className="relative bg-gray-800/20 backdrop-blur-2xl rounded-3xl p-8 border border-gray-700/30 shadow-xl shadow-indigo-400/5"
            variants={staggerItem}
            whileHover={{ y: -8, boxShadow: "0 15px 30px rgba(129, 140, 248, 0.15)" }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
            <h2 className="text-2xl font-semibold text-gray-100 mb-6">Technologies</h2>
            <div className="flex flex-wrap gap-3">
              {project.technologies?.genres?.map((tech: string, i: number) => (
                <motion.span
                  key={i}
                  className="inline-block px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 rounded-full mr-2 mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  {tech as string}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Status */}
          <motion.div
            className="relative bg-gray-800/20 backdrop-blur-2xl rounded-3xl p-8 border border-gray-700/30 shadow-xl shadow-indigo-400/5"
            variants={staggerItem}
            whileHover={{ y: -8, boxShadow: "0 15px 30px rgba(129, 140, 248, 0.15)" }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
            <h2 className="text-2xl font-semibold text-gray-100 mb-6">Status</h2>
            <motion.span
              className="px-4 py-2 bg-indigo-400/10 backdrop-blur-sm text-indigo-300 text-sm rounded-full border border-indigo-400/30"
              whileHover={{ scale: 1.1, backgroundColor: "#818cf8", color: "#fff", borderColor: "#818cf8" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {project.status}
            </motion.span>
          </motion.div>

          {/* Featured */}
          <motion.div
            className="relative bg-gray-800/20 backdrop-blur-2xl rounded-3xl p-8 border border-gray-700/30 shadow-xl shadow-indigo-400/5"
            variants={staggerItem}
            whileHover={{ y: -8, boxShadow: "0 15px 30px rgba(129, 140, 248, 0.15)" }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
            <h2 className="text-2xl font-semibold text-gray-100 mb-6">Featured</h2>
            <motion.span
              className={`px-4 py-2 ${project.is_featured ? 'bg-green-400/10 text-green-400 border-green-400/30' : 'bg-gray-700/30 text-gray-400 border-gray-600/30'} backdrop-blur-sm text-sm rounded-full border`}
              whileHover={{ scale: 1.1, backgroundColor: project.is_featured ? "#34d399" : "#6b7280", color: "#fff", borderColor: project.is_featured ? "#34d399" : "#6b7280" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {project.is_featured ? 'Yes' : 'No'}
            </motion.span>
          </motion.div>
        </motion.div>

        {/* Back Button */}
        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <Link
            to="/projects"
            className="inline-flex items-center px-6 py-3 border border-gray-700/30 bg-gray-800/20 backdrop-blur-md text-gray-200 rounded-xl hover:bg-gray-900/40 transition-all duration-300 shadow-lg shadow-indigo-400/10"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Projects
          </Link>
        </motion.div>
      </div>
    </div>
  );
}