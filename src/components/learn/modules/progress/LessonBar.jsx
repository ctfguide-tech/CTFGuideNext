import { motion } from 'framer-motion';

const LessonBar = ({ name, progress, type }) => {
    const getTypeStyles = () => {
        switch(type.toLowerCase()) {
            case 'lab':
                return "bg-[#2b2b2b] hover:bg-[#3d3d3d] text-blue-400";
            case 'task':
                return "bg-gradient-to-r from-yellow-600/90 to-yellow-700/80 text-white";
            case 'final':
                return "bg-gradient-to-r from-green-600/90 to-green-700/80 text-white";
            default:
                return "bg-[#2b2b2b]";
        }
    };

    return (
        <motion.div 
            whileHover={{ scale: 1.01 }}
            className={`${getTypeStyles()} rounded-lg transition-all duration-200 cursor-pointer`}
        >
            <div className="px-4 py-3 flex items-center justify-between">
                <h1 className="font-medium">
                    {name}
                </h1>
                <span className="text-sm font-semibold">
                    {type.toUpperCase()}
                </span>
            </div>
        </motion.div>
    );
};

export default LessonBar;
