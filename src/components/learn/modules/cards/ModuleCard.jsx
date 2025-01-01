import { motion } from 'framer-motion';

const ModuleCard = ({ title, description, image, status, type, completed, active }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`rounded-xl overflow-hidden transition-all duration-300 ease-in-out
        ${active 
          ? 'bg-gradient-to-br from-[#2b2b2b] to-green-900/40 border-green-500/50' 
          : 'bg-gradient-to-br from-[#2b2b2b] to-[#1c1c1c] hover:to-yellow-900/40'
        } border border-[#3d3d3d]`}
    >
      <div className='p-6'>
        {image && (
          <div className="mb-4 rounded-lg overflow-hidden">
            <img src={image} alt={title} className='w-full h-48 object-cover' />
          </div>
        )}
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-400 mb-4">{description}</p>

        <div className='flex items-center justify-between'>
          <div className="flex items-center space-x-2">
            {completed && (
              <span className="text-sm text-gray-400">
                {completed}
              </span>
            )}
          </div>
          {status && (
            <span className={`px-3 py-1 rounded-full text-sm font-medium
              ${status === 'In Progress' ? 'bg-blue-500/20 text-blue-400' :
                status === 'Completed' ? 'bg-green-500/20 text-green-400' :
                'bg-gray-500/20 text-gray-400'}`}
            >
              {status}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ModuleCard;