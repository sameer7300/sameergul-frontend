import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { contactApi } from '../services/api';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Fix Leaflet default marker icon issue
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

gsap.registerPlugin(ScrollTrigger);

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>();

  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const contactInfoRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const successMessageRef = useRef<HTMLDivElement>(null);

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage(null);

    try {
      await contactApi.createContact(data);
      setSubmitStatus('success');
      reset();
    } catch (error: any) {
      setSubmitStatus('error');
      setErrorMessage(
        error.response?.data?.message ||
        'Something went wrong. Please try again later.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const position: [number, number] = [34.0151, 71.5249]; // Peshawar, Pakistan coordinates

  // Framer Motion Variants
  const fadeIn = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } },
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
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 120, damping: 15 } },
  };

  const pulseGlow = {
    hidden: { opacity: 0, scale: 1 },
    visible: {
      opacity: [0, 0.5, 0],
      scale: [1, 1.1, 1],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  // Success Message Animation with Framer Motion
  const successMessageAnimation = {
    hidden: { opacity: 0, y: -20, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.8,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
  };

  // GSAP Animations with ScrollTrigger and Enhanced Success Message Effects
  useEffect(() => {
    // Header Animation
    gsap.fromTo(
      headerRef.current,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power4.out",
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Form Card Animation with Glow Effect
    gsap.fromTo(
      formRef.current,
      { opacity: 0, y: 60, scale: 0.96 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.4,
        ease: "power4.out",
        scrollTrigger: {
          trigger: formRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
          onEnter: () => {
            gsap.to(formRef.current, {
              boxShadow: "0 0 20px rgba(99, 102, 241, 0.5)",
              duration: 1,
              repeat: -1,
              yoyo: true,
              ease: "power2.inOut",
            });
          },
        },
      }
    );

    // Contact Info Card Animation with Glow Effect
    const contactItems = contactInfoRef.current?.querySelectorAll('.contact-item');
    if (contactItems) {
      gsap.fromTo(
        contactItems,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.2,
          ease: "power4.out",
          scrollTrigger: {
            trigger: contactInfoRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
            onEnter: () => {
              gsap.to(contactInfoRef.current, {
                boxShadow: "0 0 20px rgba(236, 72, 153, 0.5)",
                duration: 1,
                repeat: -1,
                yoyo: true,
                ease: "power2.inOut",
              });
            },
          },
        }
      );
    }

    // Map Animation with Glow Effect
    gsap.fromTo(
      mapRef.current,
      { opacity: 0, y: 60, scale: 0.96 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.4,
        ease: "power4.out",
        scrollTrigger: {
          trigger: mapRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
          onEnter: () => {
            gsap.to(mapRef.current, {
              boxShadow: "0 0 20px rgba(236, 72, 153, 0.5)",
              duration: 1,
              repeat: -1,
              yoyo: true,
              ease: "power2.inOut",
            });
          },
        },
      }
    );

    // Form Inputs Animation on Scroll with Glow
    const inputs = formRef.current?.querySelectorAll('input, textarea');
    if (inputs) {
      inputs.forEach((input) => {
        gsap.fromTo(
          input,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power4.out",
            scrollTrigger: {
              trigger: input,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
        input.addEventListener('focus', () => {
          gsap.to(input, {
            boxShadow: "0 0 10px rgba(99, 102, 241, 0.5)",
            duration: 0.5,
            ease: "power2.out",
          });
        });
        input.addEventListener('blur', () => {
          gsap.to(input, {
            boxShadow: "0 0 0 rgba(99, 102, 241, 0)",
            duration: 0.5,
            ease: "power2.out",
          });
        });
      });
    }

    // Contact Info Links Hover with Neon Glow
    const links = contactInfoRef.current?.querySelectorAll('a');
    links?.forEach((link) => {
      link.addEventListener('mouseenter', () => {
        gsap.to(link, {
          scale: 1.05,
          color: "#a78bfa",
          textShadow: "0 0 10px rgba(167, 139, 250, 0.8)",
          duration: 0.3,
          ease: "power2.out",
        });
      });
      link.addEventListener('mouseleave', () => {
        gsap.to(link, {
          scale: 1,
          color: "#c4b5fd",
          textShadow: "0 0 0 rgba(167, 139, 250, 0)",
          duration: 0.3,
          ease: "power2.out",
        });
      });
    });

    // Button Hover Glow
    const button = formRef.current?.querySelector('button');
    if (button) {
      button.addEventListener('mouseenter', () => {
        gsap.to(button, {
          boxShadow: "0 0 20px rgba(99, 102, 241, 0.7)",
          duration: 0.5,
          ease: "power2.out",
        });
      });
      button.addEventListener('mouseleave', () => {
        gsap.to(button, {
          boxShadow: "0 0 10px rgba(99, 102, 241, 0.3)",
          duration: 0.5,
          ease: "power2.out",
        });
      });
    }

    // Enhanced Success Message Animation with GSAP
    if (submitStatus === 'success' && successMessageRef.current) {
      const successText = successMessageRef.current.querySelector('span');
      if (successText) {
        // Split text into characters
        const chars = successText.innerText.split('');
        successText.innerHTML = chars
          .map((char) => `<span class="char">${char}</span>`)
          .join('');

        // Character-by-character animation with wave effect
        gsap.fromTo(
          successMessageRef.current.querySelectorAll('.char'),
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
              gsap.to(successMessageRef.current, {
                boxShadow: "0 0 20px rgba(34, 197, 94, 0.7)",
                duration: 0.8,
                repeat: 3,
                yoyo: true,
                ease: "power2.inOut",
              });
            },
          }
        );

        // Particle-like effect (simulated with small spans)
        const particleCount = 20;
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles';
        successMessageRef.current.appendChild(particlesContainer);

        for (let i = 0; i < particleCount; i++) {
          const particle = document.createElement('span');
          particle.className = 'particle';
          particlesContainer.appendChild(particle);

          const angle = Math.random() * Math.PI * 2;
          const distance = Math.random() * 50 + 20;
          gsap.fromTo(
            particle,
            {
              opacity: 1,
              x: 0,
              y: 0,
              scale: Math.random() * 0.5 + 0.2,
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

        // Neon glow pulse on text
        gsap.to(successText, {
          textShadow: "0 0 10px rgba(34, 197, 94, 0.8), 0 0 20px rgba(34, 197, 94, 0.6)",
          duration: 0.8,
          repeat: -1,
          yoyo: true,
          ease: "power2.inOut",
        });

        // Background sparkle effect
        gsap.to(successMessageRef.current, {
          background: "radial-gradient(circle, rgba(34, 197, 94, 0.3) 0%, rgba(17, 24, 39, 0.8) 70%)",
          duration: 1,
          repeat: -1,
          yoyo: true,
          ease: "power2.inOut",
        });
      }
    }
  }, [submitStatus]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-700 to-indigo-800 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Neon Background Glow Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-indigo-400/30 via-purple-400/30 to-pink-400/30 opacity-30 pointer-events-none"
        variants={pulseGlow}
        initial="hidden"
        animate="visible"
      />

      <div ref={containerRef} className="container mx-auto relative z-10">
        {/* Header */}
        <motion.div
          ref={headerRef}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-block mb-6 px-6 py-2 bg-indigo-500/20 dark:bg-indigo-600/30 backdrop-blur-lg rounded-full border border-indigo-400/40 shadow-lg shadow-indigo-400/30"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
          >
            <span className="text-sm font-medium text-indigo-200 dark:text-indigo-100">Get in Touch</span>
          </motion.div>
          <motion.h1
            className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-300"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
          >
            Contact Me
          </motion.h1>
          <motion.p
            className="text-lg sm:text-xl text-gray-200 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            Have a project idea or just want to say hello? Let’s connect and create something extraordinary.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form Section */}
          <motion.div
            ref={formRef}
            className="bg-gray-800/80 dark:bg-gray-900/80 backdrop-blur-2xl rounded-3xl p-8 border border-indigo-400/40 shadow-xl shadow-indigo-400/20 card-hover"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-300">
              Send a Message
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Status Messages */}
              <AnimatePresence>
                {submitStatus === 'success' && (
                  <motion.div
                    ref={successMessageRef}
                    variants={successMessageAnimation}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="p-4 bg-green-400/20 dark:bg-green-500/30 text-green-200 rounded-lg shadow-md border border-green-400/40 glow-effect text-center relative overflow-hidden"
                  >
                    <span className="text-glow relative z-10">Thank you for your message! I’ll get back to you soon.</span>
                    <div className="particles absolute inset-0 pointer-events-none"></div>
                  </motion.div>
                )}
                {submitStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                    className="p-4 bg-red-400/20 dark:bg-red-500/30 text-red-200 rounded-lg shadow-md border border-red-400/40 glow-effect"
                  >
                    {errorMessage}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-200 mb-2"
                  >
                    Name
                  </label>
                  <motion.input
                    type="text"
                    id="name"
                    {...register('name', { required: 'Name is required' })}
                    className={`
                      w-full px-4 py-2.5 rounded-lg border border-indigo-400/40
                      focus:outline-none focus:ring-2 focus:ring-indigo-400/60
                      bg-gray-700/50 dark:bg-gray-800/50 text-gray-100
                      placeholder-gray-400
                      ${errors.name ? 'border-red-400 focus:ring-red-400' : ''}
                    `}
                    placeholder="Your Name"
                    whileHover={{ scale: 1.02, borderColor: "rgba(99, 102, 241, 0.8)" }}
                    whileFocus={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  />
                  <AnimatePresence>
                    {errors.name && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="mt-1 text-sm text-red-400"
                      >
                        {errors.name.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-200 mb-2"
                  >
                    Email
                  </label>
                  <motion.input
                    type="email"
                    id="email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    })}
                    className={`
                      w-full px-4 py-2.5 rounded-lg border border-indigo-400/40
                      focus:outline-none focus:ring-2 focus:ring-indigo-400/60
                      bg-gray-700/50 dark:bg-gray-800/50 text-gray-100
                      placeholder-gray-400
                      ${errors.email ? 'border-red-400 focus:ring-red-400' : ''}
                    `}
                    placeholder="Your Email"
                    whileHover={{ scale: 1.02, borderColor: "rgba(99, 102, 241, 0.8)" }}
                    whileFocus={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  />
                  <AnimatePresence>
                    {errors.email && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="mt-1 text-sm text-red-400"
                      >
                        {errors.email.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-200 mb-2"
                >
                  Subject
                </label>
                <motion.input
                  type="text"
                  id="subject"
                  {...register('subject', { required: 'Subject is required' })}
                  className={`
                    w-full px-4 py-2.5 rounded-lg border border-indigo-400/40
                    focus:outline-none focus:ring-2 focus:ring-indigo-400/60
                    bg-gray-700/50 dark:bg-gray-800/50 text-gray-100
                    placeholder-gray-400
                    ${errors.subject ? 'border-red-400 focus:ring-red-400' : ''}
                  `}
                  placeholder="Your Subject"
                  whileHover={{ scale: 1.02, borderColor: "rgba(99, 102, 241, 0.8)" }}
                  whileFocus={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
                <AnimatePresence>
                  {errors.subject && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="mt-1 text-sm text-red-400"
                    >
                      {errors.subject.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-200 mb-2"
                >
                  Message
                </label>
                <motion.textarea
                  id="message"
                  rows={4}
                  {...register('message', {
                    required: 'Message is required',
                    minLength: {
                      value: 10,
                      message: 'Message must be at least 10 characters',
                    },
                  })}
                  className={`
                    w-full px-4 py-2.5 rounded-lg border border-indigo-400/40
                    focus:outline-none focus:ring-2 focus:ring-indigo-400/60
                    bg-gray-700/50 dark:bg-gray-800/50 text-gray-100
                    placeholder-gray-400
                    ${errors.message ? 'border-red-400 focus:ring-red-400' : ''}
                  `}
                  placeholder="Your Message"
                  whileHover={{ scale: 1.02, borderColor: "rgba(99, 102, 241, 0.8)" }}
                  whileFocus={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
                <AnimatePresence>
                  {errors.message && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="mt-1 text-sm text-red-400"
                    >
                      {errors.message.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(99, 102, 241, 0.7)" }}
                whileTap={{ scale: 0.95 }}
                className={`
                  w-full py-3 px-4 rounded-xl font-medium text-white
                  bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400
                  disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-300 shadow-lg
                  border border-indigo-400/50
                `}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Sending...
                  </span>
                ) : (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    Send Message
                  </motion.span>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Right Section: Contact Info and Map */}
          <div className="space-y-12">
            {/* Contact Information (Vertical Layout) */}
            <motion.div
              ref={contactInfoRef}
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="bg-gray-800/80 dark:bg-gray-900/80 backdrop-blur-2xl rounded-3xl p-8 border border-purple-400/40 shadow-xl shadow-purple-400/20 card-hover"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-300">
                Contact Information
              </h2>
              <div className="space-y-6">
                <motion.div variants={staggerItem} className="flex items-start contact-item">
                  <svg
                    className="w-6 h-6 text-purple-300 mt-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-white">Address</h3>
                    <p className="text-gray-300">
                      Peshawar, Pakistan
                    </p>
                  </div>
                </motion.div>

                <motion.div variants={staggerItem} className="flex items-start contact-item">
                  <svg
                    className="w-6 h-6 text-purple-300 mt-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-white">Email</h3>
                    <a
                      href="mailto:sameergul321@gmail.com"
                      className="text-purple-300 hover:text-purple-200 transition-colors duration-300"
                    >
                      sameergul321@gmail.com
                    </a>
                  </div>
                </motion.div>

                <motion.div variants={staggerItem} className="flex items-start contact-item">
                  <svg
                    className="w-6 h-6 text-purple-300 mt-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-white">Phone</h3>
                    <a
                      href="tel:+923440599187"
                      className="text-purple-300 hover:text-purple-200 transition-colors duration-300"
                    >
                      +92 344 0599187
                    </a>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Map Section */}
            <motion.div
              ref={mapRef}
              className="h-[400px] rounded-3xl overflow-hidden shadow-2xl border border-purple-400/40 shadow-pink-400/20"
            >
              <MapContainer
                center={position}
                zoom={13}
                scrollWheelZoom={false}
                className="h-full w-full"
              >
                <TileLayer
                  attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position}>
                  <Popup>
                    <div className="text-center">
                      <h3 className="font-semibold text-white">My Location</h3>
                      <p className="text-gray-200">Peshawar, Pakistan</p>
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}