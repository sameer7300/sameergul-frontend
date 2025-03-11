import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';

export default function NotFound() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const spaceshipRef = useRef<SVGSVGElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);

  // Parallax background effect
  const { scrollY } = useScroll();
  const backgroundTranslateY = useTransform(scrollY, [0, 500], [0, 100]);
  const backgroundOpacity = useTransform(scrollY, [0, 500], [0.1, 0.3]);

  // GSAP animations for the background, spaceship, and particles
  useEffect(() => {
    // Starfield background animation
    gsap.to('.starfield-layer', {
      backgroundPosition: "50% 100%",
      duration: 20,
      repeat: -1,
      ease: "linear",
      onUpdate: function () {
        gsap.set('.starfield-layer', {
          backgroundPosition: `50% ${this.progress() * 100}%`,
        });
      },
    });

    // Floating space particles
    const particleCount = 60;
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles absolute inset-0 pointer-events-none';
    document.querySelector('.not-found-container')?.appendChild(particlesContainer);

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('span');
      particle.className = 'particle';
      particle.style.background = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.3})`;
      particle.style.width = `${Math.random() * 3 + 1}px`;
      particle.style.height = particle.style.width;
      particle.style.borderRadius = '50%';
      particle.style.boxShadow = `0 0 8px rgba(255, 255, 255, 0.5)`;
      particlesContainer.appendChild(particle);

      gsap.fromTo(
        particle,
        {
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          opacity: Math.random() * 0.5 + 0.3,
          scale: Math.random() * 0.6 + 0.4,
        },
        {
          x: `+=${Math.random() * 300 - 150}`,
          y: `+=${Math.random() * 300 - 150}`,
          opacity: 0,
          scale: 0,
          duration: Math.random() * 6 + 3,
          repeat: -1,
          ease: "sine.inOut",
          delay: Math.random() * 2,
        }
      );
    }
  }, []);

  // GSAP animations for the spaceship
  useEffect(() => {
    if (spaceshipRef.current) {
      const spaceship = spaceshipRef.current.querySelector('.spaceship');
      const exhaust = spaceshipRef.current.querySelector('.exhaust');

      // Animate spaceship with a floating motion
      gsap.to(spaceship, {
        y: 20,
        rotation: 5,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        onStart: () => {
          // Glow effect on spaceship
          gsap.to(spaceship, {
            filter: "drop-shadow(0 0 10px rgba(99, 102, 241, 0.7))",
            duration: 1.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        },
      });

      // Animate exhaust with a flickering effect
      gsap.to(exhaust, {
        scaleY: 0.8,
        opacity: 0.6,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
    }
  }, []);

  // GSAP animations for the message with a playful reveal
  useEffect(() => {
    if (messageRef.current) {
      const title = messageRef.current.querySelector('h2');
      const subtitle = messageRef.current.querySelector('.subtitle');
      const buttons = messageRef.current.querySelectorAll('.button');

      // Animate title with a playful bounce
      gsap.fromTo(
        title,
        { opacity: 0, y: 30, scale: 0.8 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "elastic.out(1, 0.5)",
          delay: 0.5,
        }
      );

      // Animate subtitle with a smooth fade-in
      gsap.fromTo(
        subtitle,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          delay: 1,
        }
      );

      // Animate buttons with a staggered pop-in effect
      gsap.fromTo(
        buttons,
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "back.out(1.7)",
          delay: 1.5,
        }
      );
    }
  }, []);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 1, ease: "easeOut", staggerChildren: 0.3 },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0 0 15px rgba(99, 102, 241, 0.3), 0 0 25px rgba(99, 102, 241, 0.15)",
      transition: { duration: 0.4, ease: "easeInOut" },
    },
    tap: { scale: 0.95 },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden not-found-container">
      {/* Starfield Background */}
      <motion.div
        className="absolute inset-0 starfield-layer pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 2%)",
          backgroundSize: "4px 4px",
          backgroundPosition: "50% 0%",
        }}
      />

      {/* Floating Space Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(60)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              boxShadow: "0 0 8px rgba(255, 255, 255, 0.5)",
            }}
            animate={{
              y: [0, -50 + Math.random() * 100],
              opacity: [0.3, 0.7, 0.3],
              scale: [0.4, 1, 0.4],
            }}
            transition={{
              duration: Math.random() * 6 + 3,
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
        className="max-w-md w-full space-y-8 text-center bg-white/95 backdrop-blur-md p-10 rounded-2xl shadow-xl border border-gray-200/50"
      >
        <div>
          {/* Playful Spaceship SVG */}
          <motion.svg
            ref={spaceshipRef}
            className="mx-auto h-32 w-32"
            fill="none"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Spaceship Body */}
            <g className="spaceship">
              <motion.path
                d="M50 20 L70 50 L50 70 L30 50 Z"
                fill="#6366f1"
                stroke="#a78bfa"
                strokeWidth="2"
              />
              {/* Cockpit */}
              <motion.circle cx="50" cy="35" r="8" fill="#a78bfa" />
              {/* Exhaust */}
              <motion.path
                className="exhaust"
                d="M50 70 Q45 80 50 90 Q55 80 50 70"
                fill="#dc2626"
                opacity="0.8"
              />
            </g>
          </motion.svg>
          <div ref={messageRef}>
            <motion.h2
              className="mt-6 text-center text-4xl font-extrabold text-gray-900"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Oops! Page Not Found
            </motion.h2>
            <motion.p
              className="subtitle mt-4 text-center text-base font-medium text-gray-600"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Looks like you took a wrong turn on the internet.
            </motion.p>
          </div>
        </div>
        <div className="mt-8 space-y-4">
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => navigate(-1)}
            className="button w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-base font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600"
            style={{ boxShadow: "0 0 10px rgba(99, 102, 241, 0.2)" }}
          >
            Go Back
          </motion.button>
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            className="button"
          >
            <Link
              to="/"
              className="w-full flex justify-center py-3 px-4 border border-gray-200 rounded-xl shadow-md text-base font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Return Home
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}