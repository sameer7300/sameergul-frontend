import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { XCircleIcon } from "@heroicons/react/24/solid";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";

export default function PaymentFailed() {
  const location = useLocation();
  const navigate = useNavigate();
  const { requestId, error } = location.state || {};
  const containerRef = useRef<HTMLDivElement>(null);
  const errorMessageRef = useRef<HTMLDivElement>(null);

  // Parallax background effect
  const { scrollY } = useScroll();
  const backgroundTranslateY = useTransform(scrollY, [0, 500], [0, 100]);
  const backgroundOpacity = useTransform(scrollY, [0, 500], [0.05, 0.15]);

  // GSAP animations for the container and particle effects
  useEffect(() => {
    if (containerRef.current && typeof window !== 'undefined') {
      // Holographic effect on container
      gsap.to(containerRef.current, {
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
      containerRef.current.appendChild(particlesContainer);

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
    if (errorMessageRef.current) {
      const errorText = errorMessageRef.current.querySelector('p');
      if (errorText) {
        // Split text into characters
        const chars = errorText.innerText.split('');
        errorText.innerHTML = chars
          .map((char) => `<span class="char">${char}</span>`)
          .join('');

        // Character-by-character animation with wave effect
        gsap.fromTo(
          errorMessageRef.current.querySelectorAll('.char'),
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
        gsap.to(errorMessageRef.current, {
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

        // Particle effect for error message
        const particleCount = 30;
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles absolute inset-0 pointer-events-none';
        errorMessageRef.current.appendChild(particlesContainer);

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
  }, []);

  if (!requestId) {
    useEffect(() => {
      navigate("/hiring/requests", { replace: true });
    }, [navigate]);
    return null;
  }

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

  const iconVariants = {
    hidden: { scale: 0, rotate: -45 },
    visible: {
      scale: 1.2,
      rotate: 0,
      transition: { type: "spring", stiffness: 200, delay: 0.2 },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay: i * 0.2, ease: "easeOut" },
    }),
  };

  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: "0 0 15px rgba(99, 102, 241, 0.3)" },
    tap: { scale: 0.95 },
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
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
        ref={containerRef}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-white/95 backdrop-blur-md py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-200/50">
          <div className="text-center">
            <motion.div variants={iconVariants} initial="hidden" animate="visible">
              <XCircleIcon className="mx-auto h-16 w-16 text-red-500" />
            </motion.div>
            <motion.h2
              variants={textVariants}
              custom={1}
              initial="hidden"
              animate="visible"
              className="mt-6 text-4xl font-extrabold text-gray-900"
              style={{ textShadow: "0 0 5px rgba(239, 68, 68, 0.2)" }}
            >
              Payment Failed
            </motion.h2>
            <motion.div
              ref={errorMessageRef}
              variants={textVariants}
              custom={2}
              initial="hidden"
              animate="visible"
              className="mt-2 rounded-xl p-4 bg-red-50/90 backdrop-blur-sm border border-red-200/50"
            >
              <p className="text-sm font-medium text-red-700">
                {error || "There was an error processing your payment. Please try again."}
              </p>
            </motion.div>
            <div className="mt-6 space-y-4">
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => navigate(`/hiring/request/${requestId}`, { replace: true })}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600"
                style={{ boxShadow: "0 0 10px rgba(99, 102, 241, 0.3)" }}
              >
                Try Again
              </motion.button>
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => navigate("/hiring/requests", { replace: true })}
                className="w-full flex justify-center py-3 px-4 border border-gray-200 rounded-xl shadow-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                View All Requests
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}