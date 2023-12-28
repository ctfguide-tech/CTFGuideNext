import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function StudentGradeCard({ student, classroomId }) {
  const baseUrl = 'http://localhost:3001';
  const [submissions, setSubmissions] = useState([]);
  const [finalGrade, setFinalGrade] = useState(0.0);

  // console.log(student);
  // console.log(classroomId);

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const getStudentSubmissions = async () => {
    try {
      const url = `${baseUrl}/submission/getStudentSubmissions/${classroomId}/${student.uid}`;
      var requestOptions = {
        method: 'GET',
      };
      const response = await fetch(url, requestOptions);
      const data = await response.json();
      if (data.success) {
        setSubmissions(data.body);
        await getFinalGrade();
      } else {
        console.log('Failed to get the data');
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getStudentSubmissions();
  }, []);

  const getFinalGrade = async () => {
    try {
      const url = `${baseUrl}/submission/getFinalGrade/${classroomId}/${student.uid}`;
      var requestOptions = {
        method: 'GET',
      };
      const response = await fetch(url, requestOptions);
      const data = await response.json();
      if (data.success) {
        setFinalGrade(data.finalGrade);
      } else {
        console.log('Failed to get the data');
      }
    } catch (err) {
      console.log(err);
    }
  };

  // console.log(submissions);
  // console.log('Final Grade: ', finalGrade);

  return (
    <>
      <div style={{ color: 'white' }}>
        {student.firstName} {student.lastName}
        {submissions.map((submission, idx) => {
          return (
            <span key={idx}>
              {submission ? submission.grade + '%' : 'No Submission'}
            </span>
          );
        })}
        Final grade: {finalGrade}%
      </div>
    </>
  );
}

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
