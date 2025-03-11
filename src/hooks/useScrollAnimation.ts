import { useEffect } from 'react';
import { useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export function useScrollAnimation() {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return {
    ref,
    controls,
    variants: {
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.6,
        },
      },
      hidden: {
        opacity: 0,
        y: 20,
      },
    },
  };
}
