import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useServices } from '../hooks/useServices';
import { formatCurrency } from '../utils/formatters';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowPathIcon, ExclamationCircleIcon, StarIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../../../contexts/ThemeContext';

export default function ServiceSelection() {
  const navigate = useNavigate();
  const { services, isLoading, error } = useServices();
  const { isDarkMode } = useTheme();

  const handleServiceSelect = (serviceId: number) => {
    navigate('/hiring/request/new', {
      state: { serviceId }
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.5,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40, rotate: -2 },
    visible: {
      opacity: 1,
      y: 0,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 150,
        damping: 15,
      },
    },
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen py-24 px-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="space-y-8">
              <div className="animate-pulse">
                <div className={`h-12 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-lg w-1/3 mx-auto`}></div>
                <div className={`h-6 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded w-2/3 mx-auto mt-4`}></div>
              </div>
              <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 mt-16">
                {[1, 2, 3].map((i) => (
                  <div key={i} className={`${isDarkMode ? 'bg-gray-800/50' : 'bg-white/70'} backdrop-blur-xl rounded-3xl shadow-lg p-8 border ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                    <div className={`h-8 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded w-3/5 mb-4`}></div>
                    <div className={`h-16 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded mb-4`}></div>
                    <div className={`h-6 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded w-1/3`}></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen py-24 px-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center">
            <motion.div 
              initial={{ scale: 0, rotate: 180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <ExclamationCircleIcon className={`h-20 w-20 ${isDarkMode ? 'text-red-400' : 'text-red-500'} mx-auto`} />
            </motion.div>
            <motion.h2 
              className={`mt-6 text-4xl sm:text-5xl font-extrabold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}
              variants={fadeIn}
              initial="hidden"
              animate="visible"
            >
              Something Went Wrong
            </motion.h2>
            <motion.p 
              className={`mt-4 text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} max-w-md mx-auto leading-relaxed`}
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
            >
              We couldn't load the services. Please refresh to try again.
            </motion.p>
            <motion.button
              onClick={() => window.location.reload()}
              className={`mt-8 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl ${isDarkMode ? 'bg-indigo-500 hover:bg-indigo-600' : 'bg-indigo-600 hover:bg-indigo-700'} text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-xl ${isDarkMode ? 'shadow-indigo-500/20' : ''}`}
              whileHover={{ scale: 1.05, boxShadow: isDarkMode ? "0 10px 20px rgba(99, 102, 241, 0.3)" : "0 10px 20px rgba(79, 70, 229, 0.2)" }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, type: "spring" }}
            >
              <ArrowPathIcon className="h-5 w-5 mr-2" />
              Refresh Page
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-24 px-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-500`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div className="text-center flex-1">
            <motion.h2 
              className={`text-4xl sm:text-5xl font-extrabold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} tracking-tight`}
              variants={fadeIn}
              initial="hidden"
              animate="visible"
            >
              Tailored Services for You
            </motion.h2>
            <motion.p 
              className={`mt-4 text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} max-w-xl mx-auto leading-relaxed`}
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
            >
              Discover our curated services, designed to bring your vision to life.
            </motion.p>
          </div>
        </div>

        <motion.div
          className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {services.map((service) => (
            <motion.div
              key={service.id}
              className={`relative group ${isDarkMode ? 'bg-gray-800/50' : 'bg-white/70'} backdrop-blur-xl rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-700 border ${isDarkMode ? 'border-gray-700' : 'border-gray-100'} overflow-hidden`}
              variants={cardVariants}
              whileHover={{ y: -10, rotate: 0, scale: 1.03 }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="p-8 relative">
                <div className="flex items-center justify-between">
                  <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{service.name}</h3>
                  <motion.div
                    className="flex items-center space-x-1"
                    whileHover={{ scale: 1.15 }}
                  >
                    <StarIcon className={`h-5 w-5 ${isDarkMode ? 'text-yellow-300' : 'text-yellow-400'}`} />
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>4.9</span>
                  </motion.div>
                </div>
                <p className={`mt-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} leading-relaxed line-clamp-3`}>
                  {service.description}
                </p>
                <div className="mt-6 flex items-baseline">
                  <div className={`text-3xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} animate-pulse-price`}>
                    {formatCurrency(service.base_price)}
                  </div>
                  <p className={`ml-2 text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'} uppercase tracking-wider`}>Starting</p>
                </div>
                <motion.button
                  onClick={() => handleServiceSelect(service.id)}
                  className={`mt-6 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl ${isDarkMode ? 'bg-indigo-500 hover:bg-indigo-600' : 'bg-indigo-600 hover:bg-indigo-700'} text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 shadow-md ${isDarkMode ? 'shadow-indigo-500/20' : ''}`}
                  whileHover={{ scale: 1.05, boxShadow: isDarkMode ? "0 8px 16px rgba(99, 102, 241, 0.3)" : "0 8px 16px rgba(79, 70, 229, 0.2)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Select Service
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}