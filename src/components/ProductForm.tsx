import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { iconMap } from '@/lib/icons';

interface ProductFormData {
  title: string;
  description: string;
  price: number;
  features: string[];
  specifications: Record<string, string>;
  benefits: string[];
  icon: keyof typeof iconMap;
  status: string;
}

interface ProductFormProps {
  initialData?: ProductFormData;
  onSubmit: (data: ProductFormData) => Promise<void>;
  isLoading: boolean;
}

const defaultProduct: ProductFormData = {
  title: '',
  description: '',
  price: 0,
  features: [''],
  specifications: { '': '' },
  benefits: [''],
  icon: 'Microscope',
  status: 'active',
};

export default function ProductForm({ initialData, onSubmit, isLoading }: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>(initialData || defaultProduct);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ''] });
  };

  const removeFeature = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  const handleBenefitChange = (index: number, value: string) => {
    const newBenefits = [...formData.benefits];
    newBenefits[index] = value;
    setFormData({ ...formData, benefits: newBenefits });
  };

  const addBenefit = () => {
    setFormData({ ...formData, benefits: [...formData.benefits, ''] });
  };

  const removeBenefit = (index: number) => {
    const newBenefits = formData.benefits.filter((_, i) => i !== index);
    setFormData({ ...formData, benefits: newBenefits });
  };

  const handleSpecificationChange = (key: string, value: string, oldKey?: string) => {
    const newSpecifications = { ...formData.specifications };
    if (oldKey && oldKey !== key) {
      delete newSpecifications[oldKey];
    }
    newSpecifications[key] = value;
    setFormData({ ...formData, specifications: newSpecifications });
  };

  const addSpecification = () => {
    setFormData({
      ...formData,
      specifications: { ...formData.specifications, '': '' }
    });
  };

  const removeSpecification = (key: string) => {
    const newSpecifications = { ...formData.specifications };
    delete newSpecifications[key];
    setFormData({ ...formData, specifications: newSpecifications });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-500">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-neon-magenta mb-2">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 bg-black/30 border border-neon-cyan/20 rounded-lg text-gray-300 focus:border-neon-cyan focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-neon-magenta mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 bg-black/30 border border-neon-cyan/20 rounded-lg text-gray-300 focus:border-neon-cyan focus:outline-none"
            rows={4}
            required
          />
        </div>

        <div>
          <label className="block text-neon-magenta mb-2">Price</label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
            className="w-full px-4 py-2 bg-black/30 border border-neon-cyan/20 rounded-lg text-gray-300 focus:border-neon-cyan focus:outline-none"
            required
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-neon-magenta mb-2">Icon</label>
          <select
            value={formData.icon}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value as keyof typeof iconMap })}
            className="w-full px-4 py-2 bg-black/30 border border-neon-cyan/20 rounded-lg text-gray-300 focus:border-neon-cyan focus:outline-none"
          >
            {Object.keys(iconMap).map((icon) => (
              <option key={icon} value={icon}>
                {icon}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-neon-magenta mb-2">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-4 py-2 bg-black/30 border border-neon-cyan/20 rounded-lg text-gray-300 focus:border-neon-cyan focus:outline-none"
          >
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div>
          <label className="block text-neon-magenta mb-2">Features</label>
          {formData.features.map((feature, index) => (
            <div key={index} className="flex space-x-2 mb-2">
              <input
                type="text"
                value={feature}
                onChange={(e) => handleFeatureChange(index, e.target.value)}
                className="flex-1 px-4 py-2 bg-black/30 border border-neon-cyan/20 rounded-lg text-gray-300 focus:border-neon-cyan focus:outline-none"
                placeholder="Enter a feature"
                required
              />
              <button
                type="button"
                onClick={() => removeFeature(index)}
                className="px-4 py-2 bg-red-500/20 text-red-500 border border-red-500 rounded-lg hover:bg-red-500/30 transition-colors"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addFeature}
            className="px-4 py-2 bg-neon-magenta/20 text-neon-magenta border border-neon-magenta rounded-lg hover:bg-neon-magenta/30 transition-colors"
          >
            Add Feature
          </button>
        </div>

        <div>
          <label className="block text-neon-magenta mb-2">Specifications</label>
          {Object.entries(formData.specifications).map(([key, value], index) => (
            <div key={index} className="flex space-x-2 mb-2">
              <input
                type="text"
                value={key}
                onChange={(e) => handleSpecificationChange(e.target.value, value, key)}
                className="flex-1 px-4 py-2 bg-black/30 border border-neon-cyan/20 rounded-lg text-gray-300 focus:border-neon-cyan focus:outline-none"
                placeholder="Specification name"
                required
              />
              <input
                type="text"
                value={value}
                onChange={(e) => handleSpecificationChange(key, e.target.value)}
                className="flex-1 px-4 py-2 bg-black/30 border border-neon-cyan/20 rounded-lg text-gray-300 focus:border-neon-cyan focus:outline-none"
                placeholder="Specification value"
                required
              />
              <button
                type="button"
                onClick={() => removeSpecification(key)}
                className="px-4 py-2 bg-red-500/20 text-red-500 border border-red-500 rounded-lg hover:bg-red-500/30 transition-colors"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addSpecification}
            className="px-4 py-2 bg-neon-magenta/20 text-neon-magenta border border-neon-magenta rounded-lg hover:bg-neon-magenta/30 transition-colors"
          >
            Add Specification
          </button>
        </div>

        <div>
          <label className="block text-neon-magenta mb-2">Benefits</label>
          {formData.benefits.map((benefit, index) => (
            <div key={index} className="flex space-x-2 mb-2">
              <input
                type="text"
                value={benefit}
                onChange={(e) => handleBenefitChange(index, e.target.value)}
                className="flex-1 px-4 py-2 bg-black/30 border border-neon-cyan/20 rounded-lg text-gray-300 focus:border-neon-cyan focus:outline-none"
                placeholder="Enter a benefit"
                required
              />
              <button
                type="button"
                onClick={() => removeBenefit(index)}
                className="px-4 py-2 bg-red-500/20 text-red-500 border border-red-500 rounded-lg hover:bg-red-500/30 transition-colors"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addBenefit}
            className="px-4 py-2 bg-neon-magenta/20 text-neon-magenta border border-neon-magenta rounded-lg hover:bg-neon-magenta/30 transition-colors"
          >
            Add Benefit
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <motion.button
          type="submit"
          disabled={isLoading}
          className={`px-6 py-3 bg-neon-cyan/20 text-neon-cyan border border-neon-cyan rounded-lg hover:bg-neon-cyan/30 transition-colors ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isLoading ? 'Saving...' : 'Save Product'}
        </motion.button>
      </div>
    </form>
  );
} 