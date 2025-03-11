import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface SkillProps {
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'tools' | 'other';
  icon: string;
  proficiency: number;
  description?: string;
  years_experience: number;
}

const categoryColors = {
  frontend: { 
    bg: 'bg-blue-50/80 dark:bg-blue-900/30', 
    text: 'text-blue-600 dark:text-blue-300', 
    border: 'border-blue-200/50 dark:border-blue-800/50', 
    gradient: 'from-blue-500 to-indigo-500' 
  },
  backend: { 
    bg: 'bg-green-50/80 dark:bg-green-900/30', 
    text: 'text-green-600 dark:text-green-300', 
    border: 'border-green-200/50 dark:border-green-800/50', 
    gradient: 'from-green-500 to-teal-500' 
  },
  database: { 
    bg: 'bg-yellow-50/80 dark:bg-yellow-900/30', 
    text: 'text-yellow-600 dark:text-yellow-300', 
    border: 'border-yellow-200/50 dark:border-yellow-800/50', 
    gradient: 'from-yellow-500 to-amber-500' 
  },
  devops: { 
    bg: 'bg-purple-50/80 dark:bg-purple-900/30', 
    text: 'text-purple-600 dark:text-purple-300', 
    border: 'border-purple-200/50 dark:border-purple-800/50', 
    gradient: 'from-purple-500 to-violet-500' 
  },
  tools: { 
    bg: 'bg-pink-50/80 dark:bg-pink-900/30', 
    text: 'text-pink-600 dark:text-pink-300', 
    border: 'border-pink-200/50 dark:border-pink-800/50', 
    gradient: 'from-pink-500 to-rose-500' 
  },
  other: { 
    bg: 'bg-gray-50/80 dark:bg-gray-900/30', 
    text: 'text-gray-600 dark:text-gray-300', 
    border: 'border-gray-200/50 dark:border-gray-800/50', 
    gradient: 'from-gray-500 to-slate-500' 
  },
};

export default function SkillCard({ name, category, icon, proficiency, description, years_experience }: SkillProps) {
  const colors = categoryColors[category];
  const cardRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const rotateX = (e.clientY - centerY) / 25;
    const rotateY = (centerX - e.clientX) / 25;
    
    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 30 }}
        animate={{ 
          opacity: 1,
          y: 0,
          rotateX: rotation.x,
          rotateY: rotation.y,
        }}
        transition={{ 
          opacity: { duration: 0.6, ease: "easeOut" },
          y: { duration: 0.6, ease: "easeOut" },
          rotateX: { duration: 0.2, type: "spring", stiffness: 300 },
          rotateY: { duration: 0.2, type: "spring", stiffness: 300 },
        }}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        className={`
          relative overflow-hidden rounded-3xl border ${colors.border} ${colors.bg}
          p-6 shadow-lg transition-all duration-500 transform-gpu cursor-pointer
          backdrop-blur-xl group
          ${isHovered ? 'shadow-2xl scale-[1.02]' : ''}
          ${isOpen ? 'ring-2 ring-offset-2 ring-indigo-500 dark:ring-indigo-400' : ''}
        `}
        style={{
          perspective: "1200px",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Animated Background Gradient */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
          initial={false}
          animate={{
            scale: isHovered ? 1.15 : 1,
          }}
          transition={{ duration: 0.4 }}
        />

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ rotate: 360, scale: 1.2 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className={`p-2 rounded-xl ${colors.bg} ${colors.border} border backdrop-blur-sm shadow-sm`}
              >
                <img 
                  src={icon || `/icons/${name.toLowerCase()}.svg`} 
                  alt={name} 
                  className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                  onError={(e) => {
                    e.currentTarget.src = '/icons/default-skill.svg';
                  }}
                />
              </motion.div>
              <div>
                <motion.h3 
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100"
                >
                  {name}
                </motion.h3>
                <motion.span 
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text} mt-2 backdrop-blur-sm shadow-sm`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </motion.span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-400 font-medium">Proficiency</span>
                <motion.span
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className={`font-semibold ${colors.text}`}
                >
                  {proficiency}%
                </motion.span>
              </div>
              <div className={`h-2 w-full ${isHovered ? 'bg-gray-300 dark:bg-gray-600' : 'bg-gray-200 dark:bg-gray-700'} rounded-full overflow-hidden shadow-inner`}>
                <motion.div
                  ref={progressRef}
                  initial={{ width: "0%" }}
                  animate={{ width: `${proficiency}%` }}
                  transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
                  className={`h-full rounded-full bg-gradient-to-r ${colors.gradient} shadow-md`}
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.5, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 0.5 }}
                    className="h-full w-full bg-white opacity-30 rounded-full"
                  />
                </motion.div>
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2">
                <svg className={`w-4 h-4 ${colors.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-600 dark:text-gray-400">
                  {years_experience} {years_experience === 1 ? 'year' : 'years'} experience
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Detailed Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 200, damping: 20 }}
            className={`
              fixed sm:absolute z-50 p-6 rounded-2xl shadow-2xl backdrop-blur-xl
              border ${colors.border} bg-white/90 dark:bg-gray-900/90
              w-[90vw] sm:w-full sm:max-w-lg mx-auto sm:mx-0 mt-4
              left-[50%] transform -translate-x-1/2
              sm:left-[50%] sm:-translate-x-1/2
              top-[50%] sm:top-[100%] -translate-y-1/2 sm:translate-y-0
            `}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.2 }}
                  transition={{ duration: 0.6 }}
                  className={`p-2 rounded-xl ${colors.bg} ${colors.border} border backdrop-blur-sm shadow-sm`}
                >
                  <img 
                    src={icon || `/icons/${name.toLowerCase()}.svg`}
                    alt={name}
                    className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
                  />
                </motion.div>
                <h4 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">{name}</h4>
              </div>
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                }}
                className={`p-2 rounded-full ${colors.bg} ${colors.text} hover:opacity-80 shadow-sm`}
                whileHover={{ rotate: 90, scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>

            <div className="space-y-5">
              <div>
                <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2 text-sm sm:text-base">Description</h5>
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed">
                  {description || `Experienced in ${name} with ${years_experience} years of practical application.`}
                </p>
              </div>

              <div>
                <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2 text-sm sm:text-base">Proficiency Level</h5>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${proficiency}%` }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                      className={`h-full rounded-full bg-gradient-to-r ${colors.gradient} shadow-md`}
                    />
                  </div>
                  <span className={`font-medium ${colors.text} text-sm sm:text-base`}>{proficiency}%</span>
                </div>
              </div>

              <div>
                <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2 text-sm sm:text-base">Experience</h5>
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                  {years_experience} {years_experience === 1 ? 'year' : 'years'} of professional experience
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}