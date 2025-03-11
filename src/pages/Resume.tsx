import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from 'framer-motion';
import ReactConfetti from 'react-confetti';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import meImage from '../assets/images/me.png';

export default function Resume() {
  const resumeRef = useRef<HTMLDivElement>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [contactFormData, setContactFormData] = useState({ name: '', email: '', message: '' });
  const [formSuccess, setFormSuccess] = useState(false);

  const { scrollY } = useScroll();
  // Parallax for hero section
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroTranslateY = useTransform(scrollY, [0, 400], [0, -150]);
  const springHeroTranslateY = useSpring(heroTranslateY, { stiffness: 80, damping: 20 });

  // Parallax for profile image
  const profileTranslateY = useTransform(scrollY, [0, 600], [0, 50]);
  const springProfileTranslateY = useSpring(profileTranslateY, { stiffness: 60, damping: 15 });

  // Parallax for additional elements
  const leafOpacity = useTransform(scrollY, [0, 1000], [0.1, 0.3]);
  const leafTranslateY = useTransform(scrollY, [0, 1000], [0, 200]);
  const springLeafTranslateY = useSpring(leafTranslateY, { stiffness: 50, damping: 25 });

  const aboutRef = useRef(null);
  const skillsRef = useRef(null);
  const experienceRef = useRef(null);
  const educationRef = useRef(null);
  const certificationsRef = useRef(null);
  const achievementsRef = useRef(null);
  const contactRef = useRef(null);

  const isAboutInView = useInView(aboutRef, { once: true, margin: "0px 0px -200px 0px" });
  const isSkillsInView = useInView(skillsRef, { once: true, margin: "0px 0px -200px 0px" });
  const isExperienceInView = useInView(experienceRef, { once: true, margin: "0px 0px -200px 0px" });
  const isEducationInView = useInView(educationRef, { once: true, margin: "0px 0px -200px 0px" });
  const isCertificationsInView = useInView(certificationsRef, { once: true, margin: "0px 0px -200px 0px" });
  const isAchievementsInView = useInView(achievementsRef, { once: true, margin: "0px 0px -200px 0px" });
  const isContactInView = useInView(contactRef, { once: true, margin: "0px 0px -200px 0px" });

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => {
        setShowConfetti(false);
        setShowSuccess(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  const handleDownload = async () => {
    if (!resumeRef.current || downloading) return;
    try {
      setDownloading(true);
      const content = resumeRef.current;

      const canvas = await html2canvas(content, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, Math.min(imgHeight, 297));

      if (imgHeight > 297) {
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, -297, imgWidth, imgHeight);
      }

      pdf.save('sameer-resume.pdf');
      setShowConfetti(true);
      setShowSuccess(true);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setDownloading(false);
    }
  };

  const handleContactSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Simulate form submission (e.g., send email via API)
    setTimeout(() => {
      setFormSuccess(true);
      setContactFormData({ name: '', email: '', message: '' });
      setTimeout(() => setFormSuccess(false), 3000);
    }, 1000);
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.5,
      },
    },
  };

  const staggerItem = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 90, damping: 15 },
    },
  };

  return (
    <div className="min-h-screen bg-[#fafafa] relative overflow-hidden">
      {/* Nature-Inspired Leaf Pattern with Parallax */}
      <motion.div
        className="absolute inset-0 bg-leaf-pattern pointer-events-none"
        style={{ opacity: leafOpacity, translateY: springLeafTranslateY }}
      />

      {/* Confetti for Download Celebration */}
      {showConfetti && (
        <ReactConfetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={400}
          gravity={0.2}
          colors={['#34D399', '#10B981', '#059669', '#FFFFFF', '#E5E7EB']}
        />
      )}

      <div ref={resumeRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Header Section with Parallax */}
        <motion.div
          className="text-center mb-16 relative z-10"
          style={{ translateY: springHeroTranslateY, opacity: heroOpacity }}
        >
          <motion.div
            className="inline-block mb-6 px-6 py-2 bg-emerald-100/50 backdrop-blur-sm rounded-full border border-emerald-200/50 shadow-lg shadow-emerald-200/10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-sm font-medium text-gray-900">About Me</span>
          </motion.div>
          <motion.h1
            className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
          >
            Sameer
          </motion.h1>
          <motion.p
            className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            Full Stack Developer passionate about creating beautiful and functional web experiences, inspired by the harmony of nature and technology.
          </motion.p>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column - Profile */}
          <motion.div
            className="lg:col-span-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="sticky top-8">
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-md p-8 border border-emerald-200/30">
                <motion.div
                  className="aspect-square rounded-2xl overflow-hidden mb-6 shadow-lg"
                  style={{ translateY: springProfileTranslateY }}
                >
                  <img src={meImage} alt="Profile" className="w-full h-full object-cover" />
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Sameer</h2>
                <p className="text-gray-600 mb-6">Full Stack Developer</p>
                <div className="space-y-4">
                  <a
                    href="mailto:sameergul321@gmail.com"
                    className="flex items-center text-gray-600 hover:text-emerald-500 transition-colors"
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    sameergul321@gmail.com
                  </a>
                  <a
                    href="https://github.com/sameer7300?tab=repositories"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-gray-600 hover:text-emerald-500 transition-colors"
                  >
                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                    GitHub
                  </a>
                  <a
                    href="https://www.linkedin.com/in/sameer-gul-aa5310210"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-gray-600 hover:text-emerald-500 transition-colors"
                  >
                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Content */}
          <div className="lg:col-span-8 space-y-8">
            {/* About Section */}
            <motion.div
              ref={aboutRef}
              className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-md p-8 border border-emerald-200/30"
              initial={{ opacity: 0, y: 50 }}
              animate={isAboutInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">About</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                I'm a passionate Full Stack Developer with a strong foundation in modern web technologies.
                My journey in software development started with a deep curiosity about how things work on the web,
                and has evolved into a professional career building robust and scalable applications.
                I enjoy tackling complex problems and turning them into simple and beautiful interface designs,
                often drawing inspiration from the elegance of nature.
              </p>
            </motion.div>

            {/* Skills Section */}
            <motion.div
              ref={skillsRef}
              className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-md p-8 border border-emerald-200/30"
              initial={{ opacity: 0, y: 50 }}
              animate={isSkillsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Skills</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  'React', 'TypeScript', 'Node.js',
                  'Python', 'Django', 'PostgreSQL',
                  'Docker', 'AWS', 'Git', 'GraphQL',
                  'Next.js', 'Tailwind CSS'
                ].map((skill) => (
                  <motion.div
                    key={skill}
                    whileHover={{ scale: 1.05, boxShadow: "0 8px 16px rgba(16, 185, 129, 0.2)" }}
                    className="bg-emerald-50/50 backdrop-blur-sm rounded-xl p-4 text-center border border-emerald-200/40 flex items-center justify-center"
                  >
                    <span className="text-gray-900">{skill}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Experience Section */}
            <motion.div
              ref={experienceRef}
              className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-md p-8 border border-emerald-200/30"
              initial={{ opacity: 0, y: 50 }}
              animate={isExperienceInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Experience</h3>
              <div className="space-y-8">
                <div className="relative pl-8 border-l-2 border-emerald-200">
                  <div className="absolute -left-2.5 top-0 w-5 h-5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-400/30" />
                  <div className="mb-4">
                    <h4 className="text-xl font-semibold text-gray-900">Full Stack Developer</h4>
                    <p className="text-gray-500">2022 - Present</p>
                    <div className="mt-2 text-gray-600 leading-relaxed">
                      <ul className="list-disc list-inside space-y-2">
                        <li>Developed and maintained web applications using React and Django</li>
                        <li>Implemented responsive designs and improved user experience</li>
                        <li>Collaborated with cross-functional teams to deliver projects</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="relative pl-8 border-l-2 border-emerald-200">
                  <div className="absolute -left-2.5 top-0 w-5 h-5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-400/30" />
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900">Frontend Developer (Intern)</h4>
                    <p className="text-gray-500">2021 - 2022</p>
                    <div className="mt-2 text-gray-600 leading-relaxed">
                      <ul className="list-disc list-inside space-y-2">
                        <li>Built responsive UI components using React and Tailwind CSS</li>
                        <li>Optimized web performance and ensured cross-browser compatibility</li>
                        <li>Assisted in integrating REST APIs into frontend applications</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Education Section */}
            <motion.div
              ref={educationRef}
              className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-md p-8 border border-emerald-200/30"
              initial={{ opacity: 0, y: 50 }}
              animate={isEducationInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Education</h3>
              <div className="space-y-8">
                <div className="relative pl-8 border-l-2 border-emerald-200">
                  <div className="absolute -left-2.5 top-0 w-5 h-5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-400/30" />
                  <div className="mb-4">
                    <h4 className="text-xl font-semibold text-gray-900">Diploma in Information Technology</h4>
                    <p className="text-gray-500">2021 - 2024</p>
                  </div>
                </div>
                <div className="relative pl-8 border-l-2 border-emerald-200">
                  <div className="absolute -left-2.5 top-0 w-5 h-5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-400/30" />
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900">BS Software Engineering</h4>
                    <p className="text-gray-500">2020 - 2022 (Discontinued)</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Certifications Section (New) */}
            <motion.div
              ref={certificationsRef}
              className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-md p-8 border border-emerald-200/30"
              initial={{ opacity: 0, y: 50 }}
              animate={isCertificationsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Certifications</h3>
              <div className="space-y-6">
                <div className="relative pl-8 border-l-2 border-emerald-200">
                  <div className="absolute -left-2.5 top-0 w-5 h-5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-400/30" />
                  <div className="mb-4">
                    <h4 className="text-xl font-semibold text-gray-900">AWS Certified Solutions Architect</h4>
                    <p className="text-gray-500">2023</p>
                    <p className="text-gray-600 leading-relaxed mt-2">
                      Demonstrated expertise in designing and deploying scalable systems on AWS.
                    </p>
                  </div>
                </div>
                <div className="relative pl-8 border-l-2 border-emerald-200">
                  <div className="absolute -left-2.5 top-0 w-5 h-5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-400/30" />
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900">Google Cloud Professional Developer</h4>
                    <p className="text-gray-500">2022</p>
                    <p className="text-gray-600 leading-relaxed mt-2">
                      Certified in building and deploying applications on Google Cloud Platform.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Achievements Section (New) */}
            <motion.div
              ref={achievementsRef}
              className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-md p-8 border border-emerald-200/30"
              initial={{ opacity: 0, y: 50 }}
              animate={isAchievementsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Achievements</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: "Best Developer Award", year: "2023", desc: "Recognized for outstanding contributions to web development projects." },
                  { title: "Hackathon Winner", year: "2022", desc: "Led a team to victory in a national coding hackathon." },
                ].map((achievement) => (
                  <motion.div
                    key={achievement.title}
                    whileHover={{ scale: 1.02, boxShadow: "0 8px 16px rgba(16, 185, 129, 0.2)" }}
                    className="bg-emerald-50/50 backdrop-blur-sm rounded-xl p-4 border border-emerald-200/40"
                  >
                    <h4 className="text-lg font-semibold text-gray-900">{achievement.title}</h4>
                    <p className="text-gray-500">{achievement.year}</p>
                    <p className="text-gray-600 leading-relaxed mt-2">{achievement.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>


      {/* Download Button Section */}
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pb-16 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
      >
        <motion.button
          onClick={handleDownload}
          disabled={downloading}
          className={`
            inline-flex items-center px-8 py-4 rounded-full
            bg-emerald-500 hover:bg-emerald-600 
            text-white font-semibold transition-all duration-300
            shadow-lg hover:shadow-xl
            ${downloading ? 'opacity-75 cursor-not-allowed' : ''}
          `}
          whileHover={{ scale: 1.05, boxShadow: "0 12px 24px rgba(16, 185, 129, 0.3)" }}
          whileTap={{ scale: 0.95 }}
        >
          {downloading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Generating PDF...</span>
            </>
          ) : (
            <>
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
              </svg>
              <span>Download Resume</span>
            </>
          )}
        </motion.button>

        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed bottom-8 left-1/2 transform -translate-x-1/2"
            >
              <div className="bg-emerald-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                </svg>
                Resume downloaded successfully!
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}