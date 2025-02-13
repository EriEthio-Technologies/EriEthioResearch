import { supabase } from '@/lib/supabase';
import type { 
  UserProfile, 
  BlogPost, 
  ResearchProject, 
  ResearchProjectMember, 
  Product 
} from './types';

export { supabase };

// User Profiles
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) throw error;
  return data as UserProfile;
}

// Blog Posts
export async function getBlogPosts(page = 1, limit = 10) {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabase
    .from('blog_posts')
    .select('*', { count: 'exact' })
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .range(from, to);

  if (error) throw error;
  return { posts: data as BlogPost[], count };
}

// Research Projects
export async function getResearchProjects(status?: string) {
  const query = supabase
    .from('research_projects')
    .select(`
      *,
      research_project_members (
        user_id,
        role
      )
    `);

  if (status) {
    query.eq('status', status);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as (ResearchProject & { research_project_members: ResearchProjectMember[] })[];
}

// Products
export async function getProducts(category?: string) {
  const query = supabase
    .from('products')
    .select('*')
    .eq('status', 'active');

  if (category) {
    query.eq('category', category);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Product[];
}

// Generic CRUD operations
export async function create<T extends { id: string }>(
  table: string,
  data: Omit<T, 'id' | 'created_at' | 'updated_at'>
) {
  const { data: result, error } = await supabase
    .from(table)
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return result as T;
}

export async function update<T extends { id: string }>(
  table: string,
  id: string,
  data: Partial<T>
) {
  const { data: result, error } = await supabase
    .from(table)
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return result as T;
}

export async function remove(table: string, id: string) {
  const { error } = await supabase
    .from(table)
    .delete()
    .eq('id', id);

  if (error) throw error;
} 