import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => {
  return (
    <motion.div
      className="group relative p-6 rounded-xl shadow-lg transition-all duration-300 cursor-pointer
                 bg-gradient-to-br from-blue-500 to-blue-700 dark:from-gray-800 dark:to-gray-900
                 text-white hover:scale-105 hover:shadow-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      {/* Glow Effect on Hover */}
      <div className="absolute inset-0 bg-white opacity-10 rounded-xl blur-md hidden group-hover:block"></div>

      {/* Icon with Animated Glow */}
      <motion.div
        className="text-4xl"
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      >
        {icon}
      </motion.div>

      <div className="mt-3">
        <h3 className="text-lg font-semibold opacity-90">{title}</h3>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </div>
    </motion.div>
  );
};

export default StatCard;
