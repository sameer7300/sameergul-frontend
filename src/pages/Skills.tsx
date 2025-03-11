import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SkillCard from '../components/SkillCard';
import SkillFilter from '../components/SkillFilter';
import { skillsApi, Skill } from '../services/skillsapi';

gsap.registerPlugin(ScrollTrigger);

const staggerDelay = 0.1;

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [filteredSkills, setFilteredSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');

  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.95, 0.9]);

  const smoothY = useSpring(y, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const smoothOpacity = useSpring(opacity, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const smoothScale = useSpring(scale, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    fetchSkills();
  }, []);

  useEffect(() => {
    if (skills.length > 0) {
      filterSkills(activeCategory);
    }
  }, [activeCategory, skills]);

  useEffect(() => {
    if (!loading && skillsRef.current) {
      const cards = skillsRef.current.querySelectorAll('.skill-card');
      
      gsap.fromTo(cards, 
        { 
          opacity: 0,
          y: 50,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: staggerDelay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: skillsRef.current,
            start: "top center+=100",
            toggleActions: "play none none reverse",
          }
        }
      );
    }
  }, [loading, filteredSkills]);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await skillsApi.getSkills();
      const skillsData = Array.isArray(response) ? response : response?.results || [];
      setSkills(skillsData);
      setFilteredSkills(skillsData);
    } catch (err) {
      setError('Failed to fetch skills. Please try again later.');
      console.error('Error fetching skills:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterSkills = (category: string) => {
    if (category === 'all') {
      setFilteredSkills(skills);
    } else {
      setFilteredSkills(skills.filter(skill => skill.category === category));
    }
  };

  const uniqueCategories = Array.from(new Set(skills.map(skill => skill.category)));

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="relative py-20">
        {/* Parallax Header */}
        <motion.div
          ref={headerRef}
          style={{
            y: smoothY,
            opacity: smoothOpacity,
            scale: smoothScale,
          }}
          className="text-center mb-16 px-4"
        >
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6"
          >
            My Skills
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            A showcase of my technical expertise and professional capabilities
          </motion.p>
        </motion.div>

        <div className="container mx-auto px-4">
          {/* Category Filter */}
          <SkillFilter
            categories={uniqueCategories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-red-500 mb-8 px-4"
            >
              {error}
            </motion.div>
          )}

          {/* Loading State */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center items-center py-12 sm:py-20"
            >
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            </motion.div>
          )}

          {/* Skills Grid */}
          {!loading && !error && (
            <motion.div
              ref={skillsRef}
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 px-4 sm:px-6"
            >
              {filteredSkills.map((skill, index) => (
                <motion.div
                  key={skill.id}
                  className="skill-card"
                  initial={{ opacity: 0, y: 50 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.5, delay: index * staggerDelay }}
                >
                  <SkillCard {...skill} />
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredSkills.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-600 dark:text-gray-300 py-12 sm:py-20 px-4"
            >
              No skills found for this category.
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
