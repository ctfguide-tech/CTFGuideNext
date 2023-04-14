import { motion } from 'framer-motion';

export default function PersonCard({ person }) {
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className="py-8 text-white"
      // whileHover={{ rotate: 360 }}
    >
      <img
        className="mx-auto h-42 w-42 rounded-full border bg-neutral-900"
        src={`https://robohash.org/${person.personName}.png?set=set1&size=150x150`}
        loading="lazy"
        alt=""
      />
      <h1 className="mt-4 text-xl font-bold text-blue-500">{person.personName}</h1>
      <h2>{person.position}</h2>
      <hr className='mt-4 border-gray-500 w-4/5 mx-auto'></hr>
      <motion.p
        className="mt-4 text-lg px-2 leading-relaxed text-gray-300"
        variants={variants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0 }}
      >
        {person.bio}
      </motion.p>
    </motion.div>
  );
};
