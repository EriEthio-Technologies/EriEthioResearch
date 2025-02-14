import { motion } from 'framer-motion';
import { Pencil, Trash2, Eye, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { Product } from '@/types/product';

export default function ProductRow({
  product,
  onDelete,
  actionLoading
}: {
  product: Product;
  onDelete: () => void;
  actionLoading: boolean;
}) {
  const router = useRouter();
  const Icon = iconMap[product.icon];

  return (
    <motion.tr
      variants={item}
      className="border-b border-neon-cyan/10 hover:bg-black/20"
    >
      <td className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-full bg-neon-magenta/20">
            <Icon className="w-5 h-5 text-neon-magenta" />
          </div>
          <span className="text-gray-300">{product.title}</span>
        </div>
      </td>
      <td className="px-6 py-4 text-neon-cyan">${product.price}</td>
      <td className="px-6 py-4">
        <span className="px-3 py-1 text-sm rounded-full bg-neon-cyan/20 text-neon-cyan">
          {product.status}
        </span>
      </td>
      <td className="px-6 py-4 text-gray-300">
        {new Date(product.created_at).toLocaleDateString()}
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center justify-end space-x-3">
          <button
            onClick={() => router.push(`/products/${product.id}`)}
            className="p-2 text-gray-400 hover:text-neon-cyan transition-colors"
            title="View"
          >
            <Eye className="w-5 h-5" />
          </button>
          <button
            onClick={() => router.push(`/admin/products/${product.id}/edit`)}
            className="p-2 text-gray-400 hover:text-neon-magenta transition-colors"
            title="Edit"
          >
            <Pencil className="w-5 h-5" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            title="Delete"
            disabled={actionLoading}
          >
            {actionLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Trash2 className="w-5 h-5" />
            )}
          </button>
        </div>
      </td>
    </motion.tr>
  );
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}; 