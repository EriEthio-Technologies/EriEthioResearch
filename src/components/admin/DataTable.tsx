import { motion } from 'framer-motion';
import { memo } from 'react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const DataTable = memo(({
  headers,
  children,
  emptyMessage = "No data available",
  className = ""
}: {
  headers: string[];
  children: React.ReactNode;
  emptyMessage?: string;
  className?: string;
}) => (
  <motion.div
    variants={container}
    initial="hidden"
    animate="show"
    className={className}
  >
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-neon-cyan/20">
            {headers.map((header, index) => (
              <th key={index} className="px-6 py-4 text-left text-neon-magenta">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {children || (
            <tr>
              <td colSpan={headers.length} className="py-8 text-center text-gray-400">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </motion.div>
));

DataTable.displayName = 'DataTable'; 