import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Typed from 'typed.js';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import meImage from '../assets/images/me.png';
import { projectsApi, Project } from '../services/api';
import { skillsApi, Skill } from '../services/skillsapi';
import SkillCard from '../components/SkillCard';

export default function Home() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, 100]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [skillsLoading, setSkillsLoading] = useState(true);
  
  const typedRef = useRef<HTMLSpanElement>(null);
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [skillsRef, skillsInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [projectsRef, projectsInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [ctaRef, ctaInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    if (typedRef.current) {
      const typed = new Typed(typedRef.current, {
        strings: [
          'Full Stack Developer',
          'React Specialist',
          'Python Expert',
          'UI/UX Enthusiast'
        ],
        typeSpeed: 50,
        backSpeed: 30,
        backDelay: 1500,
        loop: true,
      });

      return () => {
        typed.destroy();
      };
    }
  }, []);

  useEffect(() => {
    fetchFeaturedProjects();
    fetchSkills();
  }, []);

  const fetchFeaturedProjects = async () => {
    try {
      const response = await projectsApi.getProjects({
        category: 'featured',
        pageSize: 6
      });
      setFeaturedProjects(response.results || []);
    } catch (error) {
      console.error('Error fetching featured projects:', error);
      setFeaturedProjects([]);
    }
  };

  const fetchSkills = async () => {
    try {
      setSkillsLoading(true);
      const response = await skillsApi.getSkills();
      setSkills(Array.isArray(response) ? response : response?.results || []);
    } catch (err) {
      console.error('Error fetching skills:', err);
    } finally {
      setSkillsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-20 -left-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute -bottom-20 -right-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Hero Section */}
      <div ref={heroRef} className="relative container mx-auto px-4 pt-32 pb-20 sm:pt-40 sm:pb-24">
        <motion.div
          ref={heroRef}
          variants={containerVariants}
          initial="hidden"
          animate={heroInView ? "visible" : "hidden"}
          className="max-w-7xl mx-auto"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Text Content */}
            <motion.div 
              className="flex-1 text-center lg:text-left"
              style={{ y: y1 }}
            >
              <motion.h2 
                variants={itemVariants}
                className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6"
              >
                Hi, I'm Sameer 👋
              </motion.h2>
              
              <motion.div 
                variants={itemVariants}
                className="text-xl sm:text-2xl md:text-3xl text-gray-600 dark:text-gray-300 mb-8"
              >
                I'm a <span ref={typedRef} className="text-blue-600 dark:text-blue-400"></span>
              </motion.div>

              <motion.p 
                variants={itemVariants}
                className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl"
              >
                Passionate about creating beautiful and functional web applications. 
                Let's work together to bring your ideas to life with modern technologies 
                and best practices.
              </motion.p>

              <motion.div 
                variants={itemVariants}
                className="flex flex-wrap gap-4 justify-center lg:justify-start"
              >
                <motion.a
                  href="#contact"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Get in Touch
                </motion.a>
                <motion.a
                  href="#projects"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  View Projects
                </motion.a>
              </motion.div>
            </motion.div>

            {/* Image */}
            <motion.div 
              className="flex-1 relative"
              style={{ y: y2 }}
              variants={itemVariants}
            >
              <motion.div
                className="relative z-10 w-full max-w-lg mx-auto"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative aspect-square overflow-hidden rounded-full border-4 border-white dark:border-gray-800 shadow-2xl">
                  <img
                    src={meImage}
                    alt="Sameer"
                    className="w-full h-full object-cover"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-500/20 to-transparent" />
                </div>
                
                {/* Floating badges */}
                <motion.div
                  className="absolute -right-4 top-10 bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-lg"
                  animate={{
                    y: [0, 10, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM8.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4a1 1 0 00-1.414-1.414L10 10.586l-1.293-1.293z" />
                  </svg>
                </motion.div>

                <motion.div
                  className="absolute -left-4 bottom-10 bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-lg"
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <svg className="w-8 h-8 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
                  </svg>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          style={{ opacity }}
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="w-6 h-10 border-2 border-gray-400 dark:border-gray-600 rounded-full flex justify-center">
            <motion.div
              className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-600 rounded-full mt-2"
              animate={{
                y: [0, 12, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* Skills Section */}
      <motion.section
        ref={skillsRef}
        initial="hidden"
        animate={skillsInView ? "visible" : "hidden"}
        variants={containerVariants}
        className="py-20 bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm"
      >
        <div className="container mx-auto px-4">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Skills & Expertise
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Here are some of the technologies and tools I specialize in.
            </p>
          </motion.div>

          {skillsLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            </div>
          ) : (
            <motion.div 
              variants={containerVariants}
              className="relative"
            >
              <style>
                {`
                  .swiper-button-next, .swiper-button-prev {
                    color: #3B82F6;
                  }
                  .swiper-pagination-bullet-active {
                    background: #3B82F6;
                  }
                  .swiper-container {
                    padding: 20px 0;
                  }
                `}
              </style>
              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={30}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                className="skills-slider"
              >
                {skills.map((skill, index) => (
                  <SwiperSlide key={skill.id}>
                    <motion.div
                      variants={itemVariants}
                      custom={index}
                      className="p-2"
                    >
                      <SkillCard {...skill} />
                    </motion.div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Featured Work Section */}
      <motion.section
        ref={projectsRef}
        initial="hidden"
        animate={projectsInView ? "visible" : "hidden"}
        variants={containerVariants}
        className="py-20"
      >
        <div className="container mx-auto px-4">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Featured Work
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Check out some of my recent projects that showcase my expertise.
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            </div>
          ) : (
            <motion.div 
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {featuredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  className="group relative overflow-hidden rounded-2xl shadow-xl bg-white dark:bg-gray-800"
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={project.thumbnail || `https://picsum.photos/600/400?random=${project.id}`}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {project.short_description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies?.genres?.map((tech: string, i: number) => (
                        <motion.span
                          key={i}
                          className="inline-block px-2 py-1 text-sm bg-gray-100 rounded mr-2 mb-2"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          <motion.div variants={itemVariants} className="text-center mt-12">
            <Link
              to="/projects"
              className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
            >
              View All Projects
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Call to Action Section */}
      <motion.section
        ref={ctaRef}
        initial="hidden"
        animate={ctaInView ? "visible" : "hidden"}
        variants={containerVariants}
        className="py-20 bg-blue-600 dark:bg-blue-700 relative overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-blue-500 to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 relative">
          <motion.div variants={itemVariants} className="text-center text-white">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Let's Create Something Amazing Together
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Have a project in mind? I'm always excited to collaborate on new and innovative ideas.
            </p>
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/contact"
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 hover:bg-blue-50 font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Get in Touch
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}