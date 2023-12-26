import { motion } from 'framer-motion';

export default function StudentGradeCard({ student }) {
    console.log(student);
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className="py-8 text-white"
      // whileHover={{ rotate: 360 }}
    >
     
      <motion.p
        className="mt-4 text-lg px-2 leading-relaxed text-gray-300"
        variants={variants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0 }}
      >
        
      </motion.p>
    </motion.div>
  );
};