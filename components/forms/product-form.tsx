'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FileUpload } from '@/components/ui/file-upload';
import type { Product } from '@/lib/db/types';
import { create, update } from '@/lib/db';

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  features: z.array(z.object({
    title: z.string(),
    description: z.string(),
  })).optional(),
  images: z.array(z.string()).optional(),
  status: z.enum(['draft', 'active', 'archived']),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: Product;
  onSuccess?: () => void;
}

export function ProductForm({ product, onSuccess }: ProductFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [features, setFeatures] = useState<{ title: string; description: string; }[]>(
    product?.features as { title: string; description: string; }[] || []
  );
  const [images, setImages] = useState<string[]>(product?.images || []);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product ? {
      ...product,
      price: product.price?.toString(),
      features: product.features as { title: string; description: string; }[],
      images: product.images || [],
    } : {
      status: 'draft',
      features: [],
      images: [],
    },
  });

  async function onSubmit(data: ProductFormData) {
    setIsLoading(true);
    try {
      const submitData = {
        ...data,
        price: data.price ? parseFloat(data.price) : null,
        features,
        images,
      };

      if (product) {
        await update('products', product.id, submitData);
      } else {
        await create('products', submitData);
      }
      onSuccess?.();
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const addFeature = () => {
    setFeatures([...features, { title: '', description: '' }]);
  };

  const updateFeature = (index: number, field: 'title' | 'description', value: string) => {
    const newFeatures = [...features];
    newFeatures[index][field] = value;
    setFeatures(newFeatures);
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleImagesUpload = (urls: string[]) => {
    setImages((prev) => [...prev, ...urls]);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  step="0.01"
                  placeholder="Leave empty for 'Contact for pricing'"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="software">Software</SelectItem>
                  <SelectItem value="hardware">Hardware</SelectItem>
                  <SelectItem value="services">Services</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <FormLabel>Features</FormLabel>
            <Button type="button" variant="outline" onClick={addFeature}>
              Add Feature
            </Button>
          </div>
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <Input
                    placeholder="Feature title"
                    value={feature.title}
                    onChange={(e) => updateFeature(index, 'title', e.target.value)}
                  />
                  <Input
                    placeholder="Feature description"
                    value={feature.description}
                    onChange={(e) => updateFeature(index, 'description', e.target.value)}
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => removeFeature(index)}
                >
                  ×
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <FormLabel>Product Images</FormLabel>
          <FileUpload
            bucket="product-images"
            path={`products/${product?.id || 'new'}`}
            accept={{
              'image/*': ['.png', '.jpg', '.jpeg'],
            }}
            multiple
            onUploadComplete={handleImagesUpload}
          />
          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((url, index) => (
                <div key={url} className="relative aspect-square">
                  <img
                    src={url}
                    alt={`Product ${index + 1}`}
                    className="object-cover rounded-lg"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => setImages(images.filter((_, i) => i !== index))}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
        </Button>
      </form>
    </Form>
  );
} 