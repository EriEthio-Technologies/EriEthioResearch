import EditUserClient from './EditUserClient';

export async function generateStaticParams() {
  return [{ id: 'placeholder' }];
}

export default function EditUserPage() {
  return <EditUserClient />;
} 