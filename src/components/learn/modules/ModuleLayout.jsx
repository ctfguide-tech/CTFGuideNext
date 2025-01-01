import { motion } from 'framer-motion';
import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const ModuleCard = ({ title, description, progress, status, lessons, onClick }) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="group relative p-6 rounded-2xl bg-[#1c1c1c] border border-[#2b2b2b] hover:border-[#3d3d3d] transition-all duration-300 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex flex-col h-full">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
          <p className="text-gray-400">{description}</p>
        </div>
        
        {/* Lessons List */}
        <div className="space-y-2 mb-6">
          {lessons?.map((lesson, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-2 rounded-lg bg-[#2b2b2b]/50 hover:bg-[#2b2b2b] transition-colors"
            >
              <div className="flex items-center space-x-2">
                <span className={`w-2 h-2 rounded-full ${
                  lesson.completed ? 'bg-green-500' : 
                  lesson.inProgress ? 'bg-blue-500' : 'bg-gray-500'
                }`} />
                <span className="text-sm text-gray-300">{lesson.title}</span>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-[#3d3d3d] text-gray-400">
                {lesson.type}
              </span>
            </div>
          ))}
        </div>
        
        <div className="mt-auto space-y-4">
          <div className="w-full bg-[#2b2b2b] rounded-full h-1.5 overflow-hidden">
            <motion.div 
              className="h-full bg-green-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">{progress}% Complete</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium 
              ${status === 'In Progress' ? 'bg-blue-500/20 text-blue-400' : 
                status === 'Not Started' ? 'bg-gray-500/20 text-gray-400' : 
                'bg-green-500/20 text-green-400'}`}>
              {status}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ModuleSlideOver = ({ module, open, setOpen }) => {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-[#1c1c1c] shadow-xl">
                    <div className="px-6 pt-6 pb-4">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-2xl font-bold text-white">
                          {module?.title}
                        </Dialog.Title>
                        <button
                          type="button"
                          className="relative rounded-md text-gray-400 hover:text-gray-300"
                          onClick={() => setOpen(false)}
                        >
                          <XMarkIcon className="h-6 w-6" />
                        </button>
                      </div>
                      <p className="mt-4 text-gray-400">{module?.description}</p>
                    </div>
                    <div className="border-t border-[#2b2b2b]">
                      <div className="px-6 py-4">
                        <h3 className="text-lg font-semibold text-white mb-4">Lessons</h3>
                        <div className="space-y-3">
                          {module?.lessons.map((lesson, index) => (
                            <div
                              key={index}
                              className="p-4 rounded-lg bg-[#2b2b2b] hover:bg-[#3d3d3d] transition-colors cursor-pointer"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <span className={`w-2 h-2 rounded-full ${
                                    lesson.completed ? 'bg-green-500' : 
                                    lesson.inProgress ? 'bg-blue-500' : 'bg-gray-500'
                                  }`} />
                                  <span className="text-gray-300">{lesson.title}</span>
                                </div>
                                <span className="text-xs px-2 py-1 rounded-full bg-[#3d3d3d] text-gray-400">
                                  {lesson.type}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

const ModuleLayout = () => {
  const [selectedModule, setSelectedModule] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const modules = [
    {
      title: "Linux Basics",
      description: "Master the fundamentals of Linux operating system",
      progress: 10,
      status: "In Progress",
      lessons: [
        { title: "Introduction to Linux", type: "LAB", completed: true },
        { title: "Basic Commands", type: "LAB", completed: true },
        { title: "File Navigation", type: "LAB", inProgress: true },
        { title: "Mastery Task", type: "TASK", completed: false },
      ]
    },
    {
      title: "Linux Commands",
      description: "Learn essential Linux commands and their usage",
      progress: 0,
      status: "Not Started",
      lessons: [
        { title: "Command Structure", type: "LAB", completed: false },
        { title: "File Operations", type: "LAB", completed: false },
        { title: "Text Processing", type: "LAB", completed: false },
        { title: "Mastery Task", type: "TASK", completed: false },
      ]
    },
    // ... other modules
  ];

  return (
    <div className="mt-10">
      <h2 className="text-3xl font-bold text-white mb-8">Learning Modules</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module, index) => (
          <ModuleCard 
            key={index} 
            {...module} 
            onClick={() => {
              setSelectedModule(module);
              setIsOpen(true);
            }}
          />
        ))}
      </div>
      <ModuleSlideOver 
        module={selectedModule}
        open={isOpen}
        setOpen={setIsOpen}
      />
    </div>
  );
};

export default ModuleLayout;