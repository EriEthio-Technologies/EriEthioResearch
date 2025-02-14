import { motion, useIsPresent } from 'framer-motion';

const SafeMotionDiv = ({ children, ...props }) => {
  const isPresent = useIsPresent();
  
  return (
    <motion.div
      {...props}
      initial={false}
      animate={isPresent ? 'visible' : 'hidden'}
    >
      {children}
    </motion.div>
  );
}; 