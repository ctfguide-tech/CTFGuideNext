import { motion } from 'framer-motion';

const UpNextCard = ({ title, description, type, image, currentPage, totalPages, lastPageTitle }) => {
    if (type === 'lab') {
        return (
            <motion.div 
                whileHover={{ scale: 1.02 }}
                className="relative h-full overflow-hidden rounded-2xl bg-gradient-to-br from-[#2b2b2b] to-[#1c1c1c] shadow-lg border border-[#3d3d3d] cursor-pointer"
            >
                <div className="relative z-10 h-full flex flex-col justify-between">
                    <div className='p-8'>
                        <h3 className="text-3xl font-bold text-white mb-2">{lastPageTitle || title}</h3>
                        <p className='text-xl text-gray-300 mb-3'>{lastPageTitle ? title : description}</p>
                        {lastPageTitle && (
                            <div className="flex flex-col space-y-2">
                                <div className="text-lg text-gray-400">
                                    <span>Page {currentPage + 1} of {totalPages}</span>
                                </div>
                                <div className="w-full h-1.5 bg-[#3d3d3d] rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-blue-500 rounded-full transition-all duration-300"
                                        style={{ width: `${(currentPage + 1) / totalPages * 100}%` }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                    <div className='flex justify-end'>
                        <span className="bg-blue-500/20 text-blue-400 text-lg font-medium px-6 py-2 rounded-tl-2xl">
                            {type.toUpperCase()}
                        </span>
                    </div>
                </div>
                <div className="absolute inset-0 z-0 opacity-20 transition-opacity duration-300 hover:opacity-30">
                    {image && <img src={image} alt={title} className="object-cover w-full h-full" />}
                </div>
            </motion.div>
        );
    }

    if (type === 'task') {
        return (
            <motion.div 
                whileHover={{ scale: 1.02 }}
                className="relative h-full overflow-hidden rounded-2xl bg-gradient-to-br from-[#B45309] to-[#92400E] shadow-lg cursor-pointer"
            >
                <div className="h-full flex flex-col justify-between">
                    <div className='p-8'>
                        <h3 className="text-3xl font-bold text-white mb-2">{title}</h3>
                        <p className='text-xl text-gray-200'>{description}</p>
                    </div>
                    <div className='flex justify-end'>
                        <span className="bg-black/20 text-white text-lg font-medium px-6 py-2 rounded-tl-2xl">
                            {type.toUpperCase()}
                        </span>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <div className='p-4 bg-red-500/10 border border-red-500 rounded-lg'>
            <h1 className='text-red-500 text-left text-xl'>Component failure. You did not specify a valid type for the UpNextCard component.</h1>
        </div>
    );
};

export default UpNextCard;
