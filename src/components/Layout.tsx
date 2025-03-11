import React, { useState, useEffect, useRef } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, ArrowUpCircle } from 'lucide-react';
import { motion, useScroll, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { NotificationBell } from './NotificationBell';
import { useTheme } from '../contexts/ThemeContext';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

gsap.registerPlugin(ScrollTrigger);

export default function Layout() {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSubscribeSuccess, setShowSubscribeSuccess] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const successMessageRef = useRef<HTMLDivElement>(null);

  // Parallax and Scroll Effects
  const { scrollY } = useScroll();
  const headerTranslateY = useTransform(scrollY, [0, 100], [0, -20]);
  const headerOpacity = useTransform(scrollY, [0, 100], [1, 0.9]);
  const springHeaderTranslateY = useSpring(headerTranslateY, { stiffness: 100, damping: 30 });
  const springHeaderOpacity = useSpring(headerOpacity, { stiffness: 100, damping: 30 });

  // Background pattern parallax
  const patternOpacity = useTransform(scrollY, [0, 1000], [0.1, 0.5]);
  const patternTranslateY = useTransform(scrollY, [0, 1000], [0, 200]);
  const springPatternTranslateY = useSpring(patternTranslateY, { stiffness: 50, damping: 25 });

  // Show Back to Top button after scrolling
  const [showBackToTop, setShowBackToTop] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // GSAP animations for mobile menu
  useEffect(() => {
    if (mobileMenuOpen) {
      gsap.fromTo(
        mobileMenuRef.current,
        { y: -50, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: "power3.out" }
      );
    }
  }, [mobileMenuOpen]);

  // GSAP animations for the logo
  useEffect(() => {
    const logoElement = logoRef.current;
    if (!logoElement) return;

    const logoText = logoElement.querySelectorAll('.logo-char');
    const logoUnderline = logoElement.querySelector('.logo-underline');

    if (logoText.length > 0) {
      // Initial animation for each character
      gsap.fromTo(
        logoText,
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.05,
          ease: "power4.out",
          onStart: () => {
            // Subtle neon glow pulse on the entire logo
            gsap.to(logoElement, {
              textShadow: "0 0 5px rgba(99, 102, 241, 0.6), 0 0 10px rgba(99, 102, 241, 0.4)",
              duration: 1.2,
              repeat: -1,
              yoyo: true,
              ease: "power2.inOut",
            });
          },
        }
      );

      // Animate the underline
      if (logoUnderline) {
        gsap.fromTo(
          logoUnderline,
          { width: '0%' },
          {
            width: '100%',
            duration: 1.5,
            ease: "power3.out",
            delay: 0.5,
          }
        );
      }

      // Hover animation for the logo
      logoElement.addEventListener('mouseenter', () => {
        gsap.to(logoText, {
          scale: 1.05,
          color: "#a78bfa",
          textShadow: "0 0 8px rgba(167, 139, 250, 0.8)",
          duration: 0.4,
          stagger: 0.03,
          ease: "power2.out",
        });
        if (logoUnderline) {
          gsap.to(logoUnderline, {
            background: "linear-gradient(90deg, #a78bfa, #ec4899)",
            duration: 0.4,
            ease: "power2.out",
          });
        }
      });

      logoElement.addEventListener('mouseleave', () => {
        gsap.to(logoText, {
          scale: 1,
          color: "#c4b5fd",
          textShadow: "0 0 5px rgba(99, 102, 241, 0.6)",
          duration: 0.4,
          stagger: 0.03,
          ease: "power2.out",
        });
        if (logoUnderline) {
          gsap.to(logoUnderline, {
            background: "linear-gradient(90deg, #6366f1, #a78bfa)",
            duration: 0.4,
            ease: "power2.out",
          });
        }
      });
    }
  }, []);

  // GSAP animations for the success message
  useEffect(() => {
    const successElement = successMessageRef.current;
    if (!successElement || !showSubscribeSuccess) return;

    const successText = successElement.querySelector('span');
    if (successText) {
      // Split text into characters
      const chars = successText.innerText.split('');
      successText.innerHTML = chars
        .map((char) => `<span class="char">${char}</span>`)
        .join('');

      // Character-by-character animation with wave effect
      gsap.fromTo(
        successElement.querySelectorAll('.char'),
        { opacity: 0, y: 20, scale: 0.5 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: {
            each: 0.05,
            from: "center",
            ease: "power2.out",
          },
          ease: "power4.out",
          onStart: () => {
            // Pulsing glow effect
            gsap.to(successElement, {
              boxShadow: "0 0 20px rgba(107, 70, 193, 0.7)",
              duration: 0.8,
              repeat: 3,
              yoyo: true,
              ease: "power2.inOut",
            });
          },
        }
      );

      // Particle-like effect (simulated with small spans)
      const particleCount = 30;
      const particlesContainer = document.createElement('div');
      particlesContainer.className = 'particles';
      successElement.appendChild(particlesContainer);

      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('span');
        particle.className = 'particle';
        particlesContainer.appendChild(particle);

        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 60 + 30;
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
            duration: Math.random() * 0.8 + 0.4,
            ease: "power2.out",
          }
        );
      }

      // Auto-hide success message after animation
      setTimeout(() => {
        setShowSubscribeSuccess(false);
      }, 5000);
    }
  }, [showSubscribeSuccess]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle newsletter subscription
  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Simulate subscription process
    setShowSubscribeSuccess(true);
  };

  const isActive = (path: string): boolean => {
    return location.pathname === path;
  };

  // Animation Variants
  const logoContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const logoCharVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
    hover: {
      scale: 1.05,
      color: "#a78bfa",
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  const underlineVariants = {
    hidden: { width: '0%' },
    visible: {
      width: '100%',
      transition: { duration: 1.5, ease: "easeOut", delay: 0.5 },
    },
  };

  const staggerContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const navLinkVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" },
    }),
    hover: {
      scale: 1.1,
      color: "#6B46C1",
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  const footerSectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay: i * 0.2, ease: "easeOut" },
    }),
  };

  const socialIconVariants = {
    hover: {
      scale: 1.3,
      rotate: 360,
      transition: { duration: 0.6, ease: "easeInOut" },
    },
    tap: { scale: 0.9 },
  };

  const buttonVariants = {
    hover: { scale: 1.1, boxShadow: "0 8px 16px rgba(107, 70, 193, 0.3)", rotate: 2 },
    tap: { scale: 0.9, rotate: -2 },
  };

  const successMessageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.5, ease: "easeIn" } },
  };

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Subtle Pattern Background with Parallax */}
      <motion.div
        className="absolute inset-0 bg-leaf-pattern pointer-events-none"
        style={{ opacity: patternOpacity, translateY: springPatternTranslateY }}
      />

      {/* Enhanced Header */}
      <motion.nav
        style={{ translateY: springHeaderTranslateY, opacity: springHeaderOpacity }}
        className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-20 items-center">
          {/* Animated Logo ("Sameer Gul" Text) */}
          <motion.div
            ref={logoRef}
            initial="hidden"
            animate="visible"
            variants={logoContainerVariants}
            className="text-xl font-bold tracking-wide flex items-center relative"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            <Link to="/">
              <div className="flex">
                {"Sameer Gul".split('').map((char, i) => (
                  <motion.span
                    key={i}
                    variants={logoCharVariants}
                    className="logo-char text-[#6B46C1]"
                    style={{ display: 'inline-block', color: '#c4b5fd' }}
                  >
                    {char}
                  </motion.span>
                ))}
              </div>
              <motion.div
                className="logo-underline absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500"
                variants={underlineVariants}
                style={{ width: '0%' }}
              />
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.div
            className="hidden md:flex space-x-8"
            initial="hidden"
            animate="visible"
            variants={staggerContainerVariants}
          >
            {['/', '/skills', '/resume', '/projects', '/contact'].map((path, i) => (
              <motion.div key={path} custom={i} variants={navLinkVariants} whileHover="hover">
                <Link
                  to={path}
                  className={`
                    ${isActive(path) ? 'text-[#6B46C1] border-[#6B46C1]' : 'text-gray-600 border-transparent'}
                    inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-300
                  `}
                >
                  {path === '/' ? 'Home' : path.substring(1).charAt(0).toUpperCase() + path.substring(2)}
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Right Side Actions */}
          <motion.div
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
          >
            <motion.button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-200 text-gray-600 shadow-md transition-all duration-300"
              whileHover={{ scale: 1.2, rotate: 15, boxShadow: "0 8px 16px rgba(107, 70, 193, 0.3)" }}
              whileTap={{ scale: 0.9, rotate: -15 }}
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </motion.button>
            <motion.div whileHover="hover" whileTap="tap" variants={buttonVariants}>
              <Link
                to="/hiring"
                className="px-4 py-2 text-sm font-medium rounded-full bg-[#6B46C1] text-white shadow-lg transition-all duration-300"
              >
                Hire Me
              </Link>
            </motion.div>
            {user && <NotificationBell />}
            {user ? (
              <div className="relative">
                <motion.button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="rounded-full flex items-center focus:ring-2 focus:ring-offset-2 focus:ring-[#6B46C1]"
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  whileTap={{ scale: 0.85 }}
                >
                  {user.avatar ? (
                    <img className="h-10 w-10 rounded-full shadow-md" src={user.avatar} alt="Avatar" />
                  ) : (
                    <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 shadow-md">
                      {user.first_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                    </div>
                  )}
                </motion.button>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -10 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="absolute right-0 mt-2 w-48 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg z-50 border border-purple-200/30"
                  >
                    <motion.p
                      className="px-4 py-3 text-sm text-gray-900 border-b border-gray-200"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      {user.email}
                    </motion.p>
                    {['/profile', '/dashboard', '/hiring/requests'].map((path, i) => (
                      <motion.div
                        key={path}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
                        whileHover={{ x: 5, backgroundColor: "rgba(107, 70, 193, 0.1)" }}
                      >
                        <Link
                          to={path}
                          className="block px-4 py-3 text-sm text-gray-700 transition-colors duration-200"
                        >
                          {path.substring(1).charAt(0).toUpperCase() + path.substring(2)}
                        </Link>
                      </motion.div>
                    ))}
                    <motion.button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-3 text-sm text-red-600 transition-colors duration-200"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
                      whileHover={{ x: 5, backgroundColor: "rgba(239, 68, 68, 0.1)" }}
                    >
                      Sign out
                    </motion.button>
                  </motion.div>
                )}
              </div>
            ) : (
              <div className="flex space-x-3">
                <motion.div whileHover="hover" whileTap="tap" variants={buttonVariants}>
                  <Link
                    to="/login"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#6B46C1] transition-colors duration-300"
                  >
                    Login
                  </Link>
                </motion.div>
                <motion.div whileHover="hover" whileTap="tap" variants={buttonVariants}>
                  <Link
                    to="/register"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-full bg-[#6B46C1] text-white shadow-lg transition-all duration-300"
                  >
                    Register
                  </Link>
                </motion.div>
              </div>
            )}
            <motion.button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              whileHover={{ scale: 1.2, rotate: 10 }}
              whileTap={{ scale: 0.9, rotate: -10 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-600" />
              ) : (
                <Menu className="h-6 w-6 text-gray-600" />
              )}
            </motion.button>
          </motion.div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            ref={mobileMenuRef}
            className="md:hidden flex flex-col items-center py-6 space-y-6 bg-white/90 backdrop-blur-md border-t border-gray-200 shadow-lg"
          >
            {['/', '/skills', '/resume', '/projects', '/contact', '/hiring'].map((path, i) => (
              <motion.div
                key={path}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
                whileHover={{ scale: 1.05, color: "#6B46C1" }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={path}
                  className="text-gray-600 text-lg font-medium transition-colors duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {path === '/' ? 'Home' : path.substring(1).charAt(0).toUpperCase() + path.substring(2)}
                </Link>
              </motion.div>
            ))}
            {!user && (
              <motion.div
                className="flex flex-col space-y-4 w-full items-center pt-6 border-t border-gray-200"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5, ease: "easeOut" }}
              >
                <motion.div whileHover="hover" whileTap="tap" variants={buttonVariants}>
                  <Link
                    to="/login"
                    className="w-3/4 text-center px-4 py-3 text-sm font-medium text-gray-700 hover:text-[#6B46C1] transition-colors duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                </motion.div>
                <motion.div whileHover="hover" whileTap="tap" variants={buttonVariants}>
                  <Link
                    to="/register"
                    className="w-3/4 text-center px-4 py-3 text-sm font-medium rounded-full bg-[#6B46C1] text-white shadow-lg transition-all duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        )}
      </motion.nav>

      <main>
        <Outlet />
      </main>

      {/* Enhanced Footer */}
      <footer className="bg-white/90 backdrop-blur-md border-t border-gray-200 shadow-lg relative">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {/* About Me */}
            <motion.div
              className="col-span-2"
              variants={footerSectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0}
            >
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">About Me</h3>
              <p className="mt-4 text-base text-gray-600 leading-relaxed">
                I'm Sameer Gul, a full-stack developer passionate about creating beautiful and functional web applications.
                With a focus on modern technologies, I bring ideas to life through elegant and scalable solutions.
              </p>
              <div className="mt-6 flex space-x-4">
                {[
                  { href: "https://github.com/yourusername", icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" /></svg> },
                  { href: "https://linkedin.com/in/yourusername", icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg> },
                  { href: "https://twitter.com/yourusername", icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124-4.09-.205-7.719-2.165-10.148-5.144-.422.722-.666 1.561-.666 2.475 0 1.708.87 3.215 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63.961-.689 1.8-1.56 2.46-2.548l-.047-.02z"/></svg> },
                ].map((social, i) => (
                  <motion.a
                    key={social.href}
                    href={social.href}
                    className="text-gray-600 hover:text-[#6B46C1] transition-colors duration-200"
                    variants={socialIconVariants}
                    whileHover="hover"
                    whileTap="tap"
                    transition={{ duration: 0.6, ease: "easeInOut", delay: i * 0.1 }}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              variants={footerSectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={1}
            >
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Quick Links</h3>
              <ul className="mt-4 space-y-4">
                {['/skills', '/resume', '/projects', '/hiring', '/contact'].map((path) => (
                  <motion.li
                    key={path}
                    whileHover={{ x: 5, color: "#6B46C1" }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    <Link to={path} className="text-base text-gray-600 transition-colors duration-200">
                      {path.substring(1).charAt(0).toUpperCase() + path.substring(2)}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Social Media Stats */}
            <motion.div
              variants={footerSectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={2}
            >
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Social Stats</h3>
              <ul className="mt-4 space-y-4">
                {[
                  { icon: <svg className="w-5 h-5 text-[#6B46C1]" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" /></svg>, stat: "GitHub Followers: 1.2K" },
                  { icon: <svg className="w-5 h-5 text-[#6B46C1]" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>, stat: "LinkedIn Connections: 850+" },
                  { icon: <svg className="w-5 h-5 text-[#6B46C1]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124-4.09-.205-7.719-2.165-10.148-5.144-.422.722-.666 1.561-.666 2.475 0 1.708.87 3.215 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63.961-.689 1.8-1.56 2.46-2.548l-.047-.02z"/></svg>, stat: "Twitter Followers: 2.5K" },
                ].map((item, i) => (
                  <motion.li
                    key={item.stat}
                    className="flex items-center space-x-2"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.2, duration: 0.6, ease: "easeOut" }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {item.icon}
                    <span className="text-base text-gray-600">{item.stat}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Newsletter Subscription */}
            <motion.div
              variants={footerSectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={3}
            >
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Stay Updated</h3>
              <p className="mt-4 text-base text-gray-600 leading-relaxed">
                Subscribe to my newsletter for updates on my latest projects and tech insights.
              </p>
              <form onSubmit={handleSubscribe} className="mt-4 flex flex-col space-y-4">
                <motion.input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-2 bg-purple-50/50 backdrop-blur-sm rounded-xl border border-purple-200/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6B46C1] text-gray-900"
                  required
                  whileFocus={{ scale: 1.02, boxShadow: "0 4px 12px rgba(107, 70, 193, 0.2)" }}
                  transition={{ duration: 0.3 }}
                />
                <motion.button
                  type="submit"
                  className="px-4 py-2 bg-[#6B46C1] text-white rounded-xl shadow-lg transition-all duration-300"
                  whileHover={{ scale: 1.1, boxShadow: "0 8px 16px rgba(107, 70, 193, 0.3)", rotate: 2 }}
                  whileTap={{ scale: 0.9, rotate: -2 }}
                >
                  Subscribe
                </motion.button>
              </form>
              <AnimatePresence>
                {showSubscribeSuccess && (
                  <motion.div
                    ref={successMessageRef}
                    variants={successMessageVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="mt-4 text-center text-[#6B46C1] font-medium relative overflow-hidden glow-effect"
                  >
                    <span className="text-glow relative z-10">Subscribed successfully! Thank you!</span>
                    <div className="particles absolute inset-0 pointer-events-none"></div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Sticky Social Bar */}
            <motion.div
              className="absolute right-0 top-0 h-full flex flex-col justify-center items-center space-y-4 pr-4"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
            >
              {[
                { href: "https://github.com/yourusername", icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" /></svg> },
                { href: "https://linkedin.com/in/yourusername", icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg> },
                { href: "https://twitter.com/yourusername", icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124-4.09-.205-7.719-2.165-10.148-5.144-.422.722-.666 1.561-.666 2.475 0 1.708.87 3.215 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63.961-.689 1.8-1.56 2.46-2.548l-.047-.02z"/></svg> },
              ].map((social, i) => (
                <motion.a
                  key={social.href}
                  href={social.href}
                  className="text-gray-600 hover:text-[#6B46C1] transition-colors duration-200"
                  variants={socialIconVariants}
                  whileHover="hover"
                  whileTap="tap"
                  transition={{ duration: 0.6, ease: "easeInOut", delay: i * 0.1 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* Footer Bottom */}
          <motion.div
            className="mt-12 border-t border-gray-200 pt-8 flex justify-between items-center"
            variants={footerSectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={4}
          >
            <p className="text-base text-gray-600">
              &copy; {new Date().getFullYear()} Sameer Gul. All rights reserved.
            </p>
            {showBackToTop && (
              <motion.button
                onClick={handleBackToTop}
                className="flex items-center text-[#6B46C1] hover:text-[#5A41A8] transition-colors duration-200"
                whileHover={{ scale: 1.2, rotate: 360 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                <ArrowUpCircle className="w-6 h-6 mr-2" />
                Back to Top
              </motion.button>
            )}
          </motion.div>
        </div>
      </footer>
    </div>
  );
}