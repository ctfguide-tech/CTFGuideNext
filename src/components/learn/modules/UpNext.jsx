import { motion } from 'framer-motion';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';

const UpNext = ({ className, nextLesson }) => {
  const router = useRouter();

  if (!nextLesson) {
    return null; // Or show a "All caught up!" message
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <div className="flex items-center justify-between mb-8">
        <h1 className='text-3xl font-bold text-white'>Continue Learning</h1>
      </div>
      
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        {/* Next Lesson Card */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="group relative h-[280px] rounded-2xl overflow-hidden cursor-pointer"
          onClick={() => router.push(`/learn/${nextLesson.id}`)}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 to-blue-900/30 z-10" />
        
          <div className="relative z-20 h-full p-8 flex flex-col justify-between">
            <div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500/30 text-blue-400 backdrop-blur-sm">
                NEXT LESSON
              </span>
              <h2 className="text-3xl font-bold text-white mt-4 mb-2">{nextLesson.title}</h2>
              <p className="text-gray-300 text-lg">{nextLesson.description}</p>
            </div>
            <div className="flex items-center text-white/80 text-sm">
              <span className="flex items-center">
                Continue Learning <ArrowRightIcon className="w-4 h-4 ml-2" />
              </span>
            </div>
          </div>
        </motion.div>

        {/* Mastery Task Card - Keep this if you want to show related tasks */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="relative h-[280px] rounded-2xl overflow-hidden cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-orange-900 to-yellow-700" />
          <div className="relative h-full p-8 flex flex-col justify-between">
            <div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-black/20 text-white backdrop-blur-sm">
                TASK
              </span>
              <h2 className="text-3xl font-bold text-white mt-4 mb-2">Practice Task</h2>
              <p className="text-gray-100 text-lg">Related to {nextLesson.title}</p>
            </div>
            <div className="flex items-center text-white/90 text-sm">
              <span className="flex items-center">
                Start Task <ArrowRightIcon className="w-4 h-4 ml-2" />
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default UpNext;
