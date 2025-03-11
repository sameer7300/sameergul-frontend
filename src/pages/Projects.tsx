import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'framer-motion';
import { projectsApi, Project } from '../services/api';
import ProjectCard from '../components/ProjectCard';

export default function Projects() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    { id: 'all', name: 'All Projects' },
    { id: 'web', name: 'Web Apps' },
    { id: 'dashboard', name: 'Dashboards' },
    { id: 'mobile', name: 'Mobile Apps' },
  ];

  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 200], [1, 0]);
  const headerTranslateY = useTransform(scrollY, [0, 200], [0, -50]);
  const springHeaderTranslateY = useSpring(headerTranslateY, { stiffness: 80, damping: 20 });

  useEffect(() => {
    fetchProjects();
  }, [selectedCategory]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = selectedCategory !== 'all' ? { category: selectedCategory } : undefined;
      const response = await projectsApi.getProjects(params);
      console.log('API Response:', response);
      console.log('Projects:', response?.results);
      setProjects(response?.results || []);
    } catch (err) {
      setError('Failed to fetch projects. Please try again later.');
      console.error('Error fetching projects:', err);
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
        staggerChildren: 0.2,
        delayChildren: 0.5,
      },
    },
  };

  const staggerItem = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 80, damping: 15 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 relative overflow-hidden">
      {/* Subtle Leaf Pattern Background */}
      <div className="absolute inset-0 bg-leaf-pattern opacity-10 pointer-events-none"></div>

      <div className="container mx-auto px-6 lg:px-8 py-24">
        {/* Header with Parallax Effect */}
        <motion.div
          className="text-center mb-16 relative z-10"
          style={{ translateY: springHeaderTranslateY, opacity: headerOpacity }}
        >
          <motion.div
            className="inline-block mb-6 px-6 py-2 bg-emerald-100/50 backdrop-blur-sm rounded-full border border-emerald-200/50 shadow-lg shadow-emerald-200/10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-sm font-medium text-gray-900">Explore My Work</span>
          </motion.div>
          <motion.h1
            className="text-5xl sm:text-6xl font-extrabold tracking-tight text-gray-900 mb-6"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
          >
            My Projects
          </motion.h1>
          <motion.p
            className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            A curated collection of my work, showcasing web applications, mobile apps, and other software projects inspired by nature and technology.
          </motion.p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-16"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {categories.map(category => (
            <motion.button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`relative px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 shadow-md ${
                selectedCategory === category.id
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white/80 backdrop-blur-sm text-gray-900 hover:bg-emerald-100/80'
              } border border-emerald-200/50`}
              variants={staggerItem}
              whileHover={{ scale: 1.05, boxShadow: "0 8px 16px rgba(16, 185, 129, 0.2)" }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">{category.name}</span>
              {selectedCategory === category.id && (
                <motion.div
                  className="absolute inset-0 bg-emerald-600 rounded-full border border-emerald-400/50"
                  layoutId="categoryHighlight"
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-red-500 mb-12 text-lg"
          >
            {error}
          </motion.div>
        )}

        {/* No Projects Message */}
        {!loading && !error && (!projects || projects.length === 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-gray-600 py-24 text-lg"
          >
            No projects found.
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center items-center py-24"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-400/30 rounded-full blur-3xl animate-glow-pulse"></div>
              <motion.div
                className="relative animate-spin rounded-full h-16 w-16 border-4 border-emerald-400 border-t-transparent"
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </motion.div>
        )}

        {/* Projects Grid */}
        {!loading && !error && projects && projects.length > 0 && (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence mode='wait'>
              {projects.map((project) => (
                <motion.div
                  key={project.id}
                  variants={staggerItem}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ y: -10, boxShadow: "0 15px 30px rgba(16, 185, 129, 0.2)" }}
                  transition={{ type: "spring", stiffness: 100, damping: 15 }}
                >
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}