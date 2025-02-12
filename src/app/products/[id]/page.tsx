import ProductDetailClient from './ProductDetailClient';

export async function generateStaticParams() {
  return [{ id: 'placeholder' }];
}

export default function ProductDetailPage() {
  return <ProductDetailClient />;
} 