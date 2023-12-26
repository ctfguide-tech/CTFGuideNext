import { motion } from 'framer-motion';

export default function StudentGradeCard({ student }) {
    console.log(student);
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  //first collum be the student name, all the others be grades of assignments, with their current grade and the total points of the assignement displayed, an their percentage of the grade displayed 
  return (
    <>
      <div style={{color: "white"}}>
        {student.firstName} {student.lastName} | grade1 | grade2 | totalGrade </div>
          </> 
  );
};

/* 

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
    
*/