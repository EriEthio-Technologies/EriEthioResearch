import EditProductClient from './EditProductClient'

export async function generateStaticParams() {
  return [{ id: 'placeholder' }]
}

export default function EditProductPage() {
  return <EditProductClient />
} 