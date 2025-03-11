import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';

export default function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const { requestId, amount } = location.state || {};
  const containerRef = useRef<HTMLDivElement>(null);
  const amountRef = useRef<HTMLDivElement>(null);
  const successMessageRef = useRef<HTMLDivElement>(null);

  // Parallax background effect
  const { scrollY } = useScroll();
  const backgroundTranslateY = useTransform(scrollY, [0, 500], [0, 100]);
  const backgroundOpacity = useTransform(scrollY, [0, 500], [0.05, 0.15]);

  // GSAP animations for the container and particle effects
  useEffect(() => {
    if (containerRef.current && typeof window !== 'undefined') {
      const particlesContainer = document.createElement('div');
      particlesContainer.id = 'tsparticles';
      containerRef.current.appendChild(particlesContainer);

      // Initialize particles
      // ... rest of particles initialization ...
    }
  }, []);

  useEffect(() => {
    if (amountRef.current) {
      const amountText = amountRef.current;
      const chars = amountText.textContent?.split('') || [];
      const html = chars
        .map((char: string) => `<span class="char">${char}</span>`)
        .join('');
      amountText.innerHTML = html;
    }
  }, []);

  // GSAP animations for success message
  useEffect(() => {
    if (successMessageRef.current) {
      const successText = successMessageRef.current.querySelector('p');
      const amountText = successMessageRef.current.querySelector('.amount-text');
      if (successText) {
        const chars = successText.textContent?.split('') || [];
        successText.innerHTML = chars
          .map((char: string) => `<span class="char">${char}</span>`)
          .join('');

        // Character-by-character animation with wave effect
        gsap.fromTo(
          successMessageRef.current.querySelectorAll('.char'),
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
        gsap.to(successMessageRef.current, {
          boxShadow: "0 0 20px rgba(74, 222, 128, 0.5), 0 0 40px rgba(74, 222, 128, 0.3)",
          duration: 0.5,
          repeat: 5,
          yoyo: true,
          ease: "power2.inOut",
        });

        // Neon text flicker
        gsap.to(successText, {
          textShadow: "0 0 10px rgba(74, 222, 128, 0.8), 0 0 20px rgba(74, 222, 128, 0.5)",
          duration: 0.3,
          repeat: 3,
          yoyo: true,
          ease: "power2.inOut",
        });

        // Particle effect for success message
        const particleCount = 30;
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles absolute inset-0 pointer-events-none';
        successMessageRef.current.appendChild(particlesContainer);

        for (let i = 0; i < particleCount; i++) {
          const particle = document.createElement('span');
          particle.className = 'particle';
          particle.style.background = `rgba(74, 222, 128, 0.8)`;
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

      if (amountText) {
        const chars = amountText.textContent?.split('') || [];
        amountText.innerHTML = chars
          .map((char: string) => `<span class="char">${char}</span>`)
          .join('');

        // Character-by-character animation for amount
        gsap.fromTo(
          successMessageRef.current.querySelectorAll('.char'),
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
            delay: 0.3,
          }
        );
      }
    }
  }, []);

  if (!requestId || !amount) {
    // If no state is present, redirect to requests page
    React.useEffect(() => {
      navigate('/hiring/requests', { replace: true });
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
    hidden: { scale: 0, rotate: 45 },
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
              <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500" />
            </motion.div>
            <motion.h2
              variants={textVariants}
              custom={1}
              initial="hidden"
              animate="visible"
              className="mt-6 text-center text-4xl font-extrabold text-gray-900"
              style={{ textShadow: "0 0 5px rgba(74, 222, 128, 0.2)" }}
            >
              Payment Successful!
            </motion.h2>
            <motion.div
              ref={successMessageRef}
              className="mt-2 rounded-xl p-4 bg-green-50/90 backdrop-blur-sm border border-green-200/50"
            >
              <motion.p
                variants={textVariants}
                custom={2}
                initial="hidden"
                animate="visible"
                className="text-center text-sm font-medium text-green-700"
              >
                Thank you for your payment. Your request is now being processed.
              </motion.p>
              <motion.p
                variants={textVariants}
                custom={3}
                initial="hidden"
                animate="visible"
                className="mt-2 text-center text-lg font-medium text-gray-900 amount-text"
              >
                Amount paid: ${(amount / 100).toFixed(2)}
              </motion.p>
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
                View Request Details
              </motion.button>
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => navigate('/hiring/requests', { replace: true })}
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