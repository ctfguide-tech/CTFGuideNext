import { motion } from 'framer-motion';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';

const UpNext = ({ className, nextLesson }) => {
  const router = useRouter();

  if (!nextLesson) {
    return null;
  }

  // Parse content to get the last accessed page info
  let parsedContent = [];
  let lastAccessedPage = null;
  try {
    parsedContent = Array.isArray(nextLesson.content) ? nextLesson.content : [];
    lastAccessedPage = parsedContent[nextLesson.currentPage];
  } catch (error) {
    console.warn('Failed to parse content for next lesson', error);
  }

  const totalPages = parsedContent.length || 1; // Fallback to 1 if length is undefined
  const currentPage = nextLesson.currentPage || 0;
  const progressPercentage = (currentPage + 1) / totalPages * 100;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <div className="flex items-center justify-between mb-8 hidden">
        <h1 className='text-3xl font-bold text-white'>Continue Learning</h1>
      </div>
      
      <div className='grid grid-cols-1 md:grid-cols-1 gap-8'>
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="group relative h-[280px] overflow-hidden cursor-pointer"
          onClick={() => router.push(`/learn/${nextLesson.id}?page=${nextLesson.currentPage + 1}`)}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 to-blue-900/30 z-10" />
        
          <div className="relative z-20 h-full p-8 flex flex-col justify-between">
            <div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500/30 text-blue-400 backdrop-blur-sm">
                CONTINUE MODULE
              </span>
              <h2 className="text-3xl font-bold text-white mt-4 mb-2">
                {lastAccessedPage ? lastAccessedPage.title : nextLesson.title}
              </h2>
              {lastAccessedPage && (
                <div className="flex flex-col space-y-2">
                  <p className="text-gray-300 text-lg">{nextLesson.title}</p>
                  <div className="flex items-center text-sm text-gray-400">
                    <span>Page {nextLesson.currentPage + 1} of {parsedContent.length}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between text-white/80 text-sm">
              <span className="flex items-center">
                Continue Learning <ArrowRightIcon className="w-4 h-4 ml-2" />
              </span>
              <div className="w-24 h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default UpNext;
