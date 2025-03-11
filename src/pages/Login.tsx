import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';

interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const errorRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  // Parallax background effect
  const { scrollY } = useScroll();
  const backgroundTranslateY = useTransform(scrollY, [0, 500], [0, 100]);
  const backgroundOpacity = useTransform(scrollY, [0, 500], [0.05, 0.15]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      await login(data.email.toLowerCase(), data.password);
      // Get the return URL from location state or default to dashboard
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from);
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  // GSAP animations for form elements
  useEffect(() => {
    if (formRef.current) {
      // Holographic effect on form container
      gsap.to(formRef.current, {
        boxShadow: "0 0 15px rgba(99, 102, 241, 0.3), 0 0 30px rgba(99, 102, 241, 0.2)",
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
      });

      // Background particle animation
      const particleCount = 50;
      const particlesContainer = document.createElement('div');
      particlesContainer.className = 'particles absolute inset-0 pointer-events-none';
      formRef.current.appendChild(particlesContainer);

      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('span');
        particle.className = 'particle';
        particle.style.background = `rgba(99, 102, 241, 0.6)`;
        particle.style.width = `${Math.random() * 3 + 1}px`;
        particle.style.height = particle.style.width;
        particle.style.borderRadius = '50%';
        particlesContainer.appendChild(particle);

        gsap.fromTo(
          particle,
          {
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: 0.6,
            scale: Math.random() * 0.5 + 0.5,
          },
          {
            x: `+=${Math.random() * 200 - 100}`,
            y: `+=${Math.random() * 200 - 100}`,
            opacity: 0,
            scale: 0,
            duration: Math.random() * 5 + 3,
            repeat: -1,
            ease: "power1.inOut",
            delay: Math.random() * 2,
          }
        );
      }
    }
  }, []);

  // GSAP animations for error message
  useEffect(() => {
    if (error && errorRef.current) {
      const errorText = errorRef.current.querySelector('p');
      if (errorText) {
        // Split text into characters
        const chars = errorText.innerText.split('');
        errorText.innerHTML = chars
          .map((char) => `<span class="char">${char}</span>`)
          .join('');

        // Character-by-character animation with wave effect
        gsap.fromTo(
          errorRef.current.querySelectorAll('.char'),
          { opacity: 0, y: 15, scale: 0.7 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: {
              each: 0.03,
              from: "center",
              ease: "power2.out",
            },
            ease: "power4.out",
          }
        );

        // Pulsing glow effect with neon flicker
        gsap.to(errorRef.current, {
          boxShadow: "0 0 20px rgba(239, 68, 68, 0.5), 0 0 40px rgba(239, 68, 68, 0.3)",
          duration: 0.5,
          repeat: 5,
          yoyo: true,
          ease: "power2.inOut",
        });

        // Neon text flicker
        gsap.to(errorText, {
          textShadow: "0 0 10px rgba(239, 68, 68, 0.8), 0 0 20px rgba(239, 68, 68, 0.5)",
          duration: 0.3,
          repeat: 3,
          yoyo: true,
          ease: "power2.inOut",
        });

        // Particle effect for error
        const particleCount = 30;
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles absolute inset-0 pointer-events-none';
        errorRef.current.appendChild(particlesContainer);

        for (let i = 0; i < particleCount; i++) {
          const particle = document.createElement('span');
          particle.className = 'particle';
          particle.style.background = `rgba(239, 68, 68, 0.8)`;
          particlesContainer.appendChild(particle);

          const angle = Math.random() * Math.PI * 2;
          const distance = Math.random() * 50 + 30;
          gsap.fromTo(
            particle,
            {
              opacity: 1,
              x: 0,
              y: 0,
              scale: Math.random() * 0.5 + 0.3,
            },
            {
              opacity: 0,
              x: Math.cos(angle) * distance,
              y: Math.sin(angle) * distance,
              scale: 0,
              duration: 1.5,
              delay: Math.random() * 0.5,
              ease: "power2.out",
            }
          );
        }
      }
    }
  }, [error]);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 1, ease: "easeOut", staggerChildren: 0.2 },
    },
  };

  const formVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut", delay: 0.3 },
    },
  };

  const inputVariants = {
    hidden: { opacity: 0, x: -30, scale: 0.9 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { duration: 0.8, delay: i * 0.3, ease: "easeOut" },
    }),
    focus: {
      scale: 1.03,
      boxShadow: "0 0 15px rgba(99, 102, 241, 0.4), 0 0 25px rgba(99, 102, 241, 0.3)",
      borderColor: "#6366f1",
      transition: { duration: 0.4, ease: "easeInOut" },
    },
    hover: {
      scale: 1.02,
      borderColor: "#a78bfa",
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.1,
      boxShadow: "0 0 20px rgba(99, 102, 241, 0.5), 0 0 30px rgba(99, 102, 241, 0.3)",
      background: "linear-gradient(90deg, #6366f1, #a78bfa)",
      transition: { duration: 0.4, ease: "easeInOut" },
    },
    tap: { scale: 0.95 },
    disabled: { opacity: 0.5, cursor: "not-allowed" },
  };

  const errorVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
    exit: { opacity: 0, y: -20, scale: 0.9, transition: { duration: 0.6, ease: "easeIn" } },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background with Parallax */}
      <motion.div
        className="absolute inset-0 bg-circuit-pattern pointer-events-none"
        style={{ translateY: backgroundTranslateY, opacity: backgroundOpacity }}
      />

      {/* Floating Particles in Background */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-indigo-300 rounded-full"
            style={{
              width: Math.random() * 4 + 2,
              height: Math.random() * 4 + 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              boxShadow: "0 0 10px rgba(99, 102, 241, 0.3)",
            }}
            animate={{
              y: [0, -50 + Math.random() * 100],
              opacity: [0.2, 0.6, 0.2],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        ref={formRef}
        className="relative max-w-md w-full space-y-8 bg-white/95 backdrop-blur-md p-10 rounded-2xl shadow-xl border border-gray-200/50"
      >
        <div>
          <motion.h2
            variants={textVariants}
            className="mt-6 text-center text-4xl font-extrabold text-gray-900"
            style={{ textShadow: "0 0 5px rgba(99, 102, 241, 0.2)" }}
          >
            Sign in to your account
          </motion.h2>
          <motion.p
            variants={textVariants}
            className="mt-3 text-center text-sm text-gray-600"
          >
            Or{' '}
            <Link
              to="/register"
              className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-300"
              style={{ textShadow: "0 0 3px rgba(99, 102, 241, 0.2)" }}
            >
              create a new account
            </Link>
          </motion.p>
        </div>
        <motion.form
          variants={formVariants}
          initial="hidden"
          animate="visible"
          className="mt-8 space-y-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="space-y-6">
            <motion.div custom={0} variants={inputVariants} initial="hidden" animate="visible">
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <motion.input
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                id="email"
                type="email"
                autoComplete="email"
                className="appearance-none relative block w-full px-4 py-3 border border-gray-200 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-0 sm:text-sm bg-white/50 backdrop-blur-sm"
                placeholder="Email address"
                whileFocus="focus"
                whileHover="hover"
                style={{
                  boxShadow: "inset 0 0 8px rgba(99, 102, 241, 0.1)",
                }}
              />
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="mt-2 text-sm text-red-600"
                  style={{ textShadow: "0 0 5px rgba(239, 68, 68, 0.2)" }}
                >
                  {errors.email.message}
                </motion.p>
              )}
            </motion.div>
            <motion.div custom={1} variants={inputVariants} initial="hidden" animate="visible">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <motion.input
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
                id="password"
                type="password"
                autoComplete="current-password"
                className="appearance-none relative block w-full px-4 py-3 border border-gray-200 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-0 sm:text-sm bg-white/50 backdrop-blur-sm"
                placeholder="Password"
                whileFocus="focus"
                whileHover="hover"
                style={{
                  boxShadow: "inset 0 0 8px rgba(99, 102, 241, 0.1)",
                }}
              />
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="mt-2 text-sm text-red-600"
                  style={{ textShadow: "0 0 5px rgba(239, 68, 68, 0.2)" }}
                >
                  {errors.password.message}
                </motion.p>
              )}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
            className="flex items-center justify-between"
          >
            <div className="text-sm">
              <Link
                to="/forgot-password"
                className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-300"
                style={{ textShadow: "0 0 3px rgba(99, 102, 241, 0.2)" }}
              >
                Forgot your password?
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
          >
            <motion.button
              type="submit"
              disabled={isLoading}
              variants={buttonVariants}
              whileHover={isLoading ? {} : "hover"}
              whileTap={isLoading ? {} : "tap"}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white transition-all duration-300 ${
                isLoading
                  ? 'bg-gray-400/70 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600'
              }`}
              style={{
                boxShadow: isLoading ? "none" : "0 0 15px rgba(99, 102, 241, 0.3)",
              }}
            >
              {isLoading && (
                <motion.span
                  className="absolute left-0 inset-y-0 flex items-center pl-3"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <svg
                    className="h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </motion.span>
              )}
              <motion.span
                animate={isLoading ? { opacity: 0.7 } : { opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </motion.span>
            </motion.button>
          </motion.div>

          <AnimatePresence>
            {error && (
              <motion.div
                ref={errorRef}
                variants={errorVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="rounded-xl bg-red-50/90 backdrop-blur-sm p-4 mt-3 relative overflow-hidden border border-red-200/50"
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <motion.svg
                      className="h-5 w-5 text-red-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </motion.svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-700">{error}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default Login;