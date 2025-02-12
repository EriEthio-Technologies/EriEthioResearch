import EditResearchProjectClient from './EditResearchProjectClient'

export async function generateStaticParams() {
  return [{ id: 'placeholder' }]
}

export default function EditResearchProjectPage() {
  return <EditResearchProjectClient />
} 