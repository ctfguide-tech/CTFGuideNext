import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    XMarkIcon, 
    MagnifyingGlassIcon, 
    DocumentTextIcon, 
    CodeBracketIcon,
    FlagIcon,
    GiftIcon 
} from '@heroicons/react/24/outline';

const tutorialSteps = [
    {
        icon: MagnifyingGlassIcon,
        title: "Discover Bounties",
        description: "Browse a live feed of bug bounties from top companies and innovative startups."
    },
    {
        icon: DocumentTextIcon,
        title: "Review the Scope",
        description: "Click on any bounty to see the details, including target assets, accepted vulnerabilities, and reward tiers."
    },
    {
        icon: CodeBracketIcon,
        title: "Start Hacking",
        description: "Use the 'Start Hacking' button to get a dedicated attack environment. No setup required!"
    },
    {
        icon: FlagIcon,
        title: "Submit Your Findings",
        description: "Found a valid bug? Submit a clear, detailed report directly through our platform."
    },
    {
        icon: GiftIcon,
        title: "Get Rewarded",
        description: "Once your submission is verified, you'll receive your bounty payout. Happy hacking!"
    }
];

const variants = {
  enter: (direction) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};


export function WelcomeModal({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  
  const paginate = (newDirection) => {
    setDirection(newDirection);
    setCurrentStep(prev => prev + newDirection);
  };

  if (!isOpen) return null;
  
  const step = tutorialSteps[currentStep];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4 transition-opacity duration-300" onClick={onClose}>
      <div 
        className="bg-neutral-900 border border-neutral-700/50 text-white w-full max-w-lg shadow-2xl flex flex-col relative overflow-hidden rounded-lg"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-neutral-800 z-10">
            <h2 className="text-2xl font-bold text-white">How Bounties Work</h2>
            <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors">
                <XMarkIcon className="h-7 w-7" />
            </button>
        </div>
        
        <div className="relative flex-grow flex items-center justify-center overflow-hidden min-h-[350px]">
            <AnimatePresence initial={false} custom={direction}>
                <motion.div
                    key={currentStep}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 }
                    }}
                    className="absolute w-full h-full flex flex-col items-center justify-center text-center p-8"
                >
                    <step.icon className="h-20 w-20 text-blue-400 mb-6"/>
                    <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
                    <p className="text-neutral-300 text-lg">{step.description}</p>
                </motion.div>
            </AnimatePresence>
        </div>

        <div className="p-6 border-t border-neutral-800 bg-neutral-900/50 z-10">
            <div className="flex items-center justify-between">
                <div className="flex-1 text-left">
                    {currentStep > 0 && (
                        <button 
                            onClick={() => paginate(-1)}
                            className="text-neutral-300 font-semibold py-2 px-4 rounded-md"
                        >
                            Previous
                        </button>
                    )}
                </div>

                <div className="flex items-center space-x-2">
                    {tutorialSteps.map((_, i) => (
                        <div 
                            key={i} 
                            className={`h-2 w-2 rounded-full transition-colors ${currentStep === i ? 'bg-blue-500' : 'bg-neutral-600'}`}
                        />
                    ))}
                </div>

                <div className="flex-1 text-right">
                    {currentStep < tutorialSteps.length - 1 ? (
                        <button 
                            onClick={() => paginate(1)} 
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md transition-colors"
                        >
                            Next
                        </button>
                    ) : (
                        <button 
                            onClick={onClose} 
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-md transition-colors"
                        >
                            Start Hacking!
                        </button>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
} 