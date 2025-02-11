'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ProductForm } from '@/components/forms/product-form';
import type { Product } from '@/lib/db/types';

interface ProductDialogProps {
  product?: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function ProductDialog({
  product,
  open,
  onOpenChange,
  onSuccess,
}: ProductDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>
            {product ? 'Edit Product' : 'Create Product'}
          </DialogTitle>
          <DialogDescription>
            {product
              ? 'Make changes to your product here.'
              : 'Add a new product to your catalog.'}
          </DialogDescription>
        </DialogHeader>
        <ProductForm
          product={product}
          onSuccess={() => {
            onOpenChange(false);
            onSuccess?.();
          }}
        />
      </DialogContent>
    </Dialog>
  );
} 