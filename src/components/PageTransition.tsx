import React from 'react';
import { motion } from 'motion/react';

interface PageTransitionProps {
  children: React.ReactNode;
  variant?: 'fade' | 'stagger' | 'drift' | 'zoom';
  className?: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  variant = 'fade',
  className = '',
}) => {
  const getVariants = () => {
    switch (variant) {
      case 'drift':
        return {
          initial: { opacity: 0, y: 16, filter: 'blur(4px)' },
          animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
          exit: { opacity: 0, y: -12, filter: 'blur(3px)' },
        };
      case 'zoom':
        return {
          initial: { opacity: 0, scale: 0.96, filter: 'blur(4px)' },
          animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
          exit: { opacity: 0, scale: 1.03, filter: 'blur(3px)' },
        };
      case 'stagger':
      default:
        return {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -8 },
        };
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={getVariants()}
      transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
      className={`w-full min-h-screen ${className}`}
    >
      {children}
    </motion.div>
  );
};
