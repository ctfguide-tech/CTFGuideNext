import { motion } from 'framer-motion';

const UpNextCard = ({ title, description, type, image }) => {
    if (type === 'lab') {
        return (
            <motion.div 
                whileHover={{ scale: 1.02 }}
                className="relative h-full overflow-hidden rounded-2xl bg-gradient-to-br from-[#2b2b2b] to-[#1c1c1c] shadow-lg border border-[#3d3d3d] cursor-pointer"
            >
                <div className="relative z-10 h-full flex flex-col justify-between">
                    <div className='p-8'>
                        <h3 className="text-3xl font-bold text-white mb-2">{title}</h3>
                        <p className='text-xl text-gray-300'>{description}</p>
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
