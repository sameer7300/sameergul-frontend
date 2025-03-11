import { motion } from 'framer-motion';

interface SkillFilterProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  className?: string;
}

const categoryColors = {
  all: { baseText: 'text-gray-900 dark:text-gray-300', activeText: 'text-white', baseBg: 'bg-white/80 dark:bg-gray-800/50', activeBg: 'bg-indigo-600 dark:bg-indigo-500', border: 'border-indigo-200/50 dark:border-indigo-900/50' },
  frontend: { baseText: 'text-blue-700 dark:text-blue-300', activeText: 'text-white', baseBg: 'bg-blue-50/80 dark:bg-blue-900/50', activeBg: 'bg-blue-600 dark:bg-blue-500', border: 'border-blue-200/50 dark:border-blue-900/50' },
  backend: { baseText: 'text-green-700 dark:text-green-300', activeText: 'text-white', baseBg: 'bg-green-50/80 dark:bg-green-900/50', activeBg: 'bg-green-600 dark:bg-green-500', border: 'border-green-200/50 dark:border-green-900/50' },
  database: { baseText: 'text-yellow-700 dark:text-yellow-300', activeText: 'text-white', baseBg: 'bg-yellow-50/80 dark:bg-yellow-900/50', activeBg: 'bg-yellow-600 dark:bg-yellow-500', border: 'border-yellow-200/50 dark:border-yellow-900/50' },
  devops: { baseText: 'text-purple-700 dark:text-purple-300', activeText: 'text-white', baseBg: 'bg-purple-50/80 dark:bg-purple-900/50', activeBg: 'bg-purple-600 dark:bg-purple-500', border: 'border-purple-200/50 dark:border-purple-900/50' },
  tools: { baseText: 'text-pink-700 dark:text-pink-300', activeText: 'text-white', baseBg: 'bg-pink-50/80 dark:bg-pink-900/50', activeBg: 'bg-pink-600 dark:bg-pink-500', border: 'border-pink-200/50 dark:border-pink-900/50' },
  other: { baseText: 'text-gray-900 dark:text-gray-300', activeText: 'text-white', baseBg: 'bg-white/80 dark:bg-gray-800/50', activeBg: 'bg-indigo-600 dark:bg-indigo-500', border: 'border-indigo-200/50 dark:border-indigo-900/50' },
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

export default function SkillFilter({ categories, activeCategory, onCategoryChange, className }: SkillFilterProps) {
  return (
    <motion.div 
      className={`flex flex-wrap justify-center gap-4 mb-16 ${className}`}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.2,
            delayChildren: 0.5,
          },
        },
      }}
    >
      {['all', ...categories].map((category) => {
        const colors = categoryColors[category as keyof typeof categoryColors] || categoryColors.other;
        const isActive = activeCategory === category;

        return (
          <motion.button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`
              relative px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 shadow-md
              ${isActive ? `${colors.activeBg} ${colors.activeText}` : `${colors.baseBg} ${colors.baseText} hover:${colors.activeBg}/80`}
              backdrop-blur-sm border ${colors.border}
            `}
            variants={staggerItem}
            whileHover={{ scale: 1.05, boxShadow: "0 8px 16px rgba(79, 70, 229, 0.2)" }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </span>
            {isActive && (
              <motion.div
                className={`absolute inset-0 ${colors.activeBg} rounded-full border ${colors.border}`}
                layoutId="categoryHighlight"
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              />
            )}
          </motion.button>
        );
      })}
    </motion.div>
  );
}