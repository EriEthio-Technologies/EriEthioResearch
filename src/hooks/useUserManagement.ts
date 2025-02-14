import { useQuery } from '@tanstack/react-query';

export const useUserManagement = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw new Error(error.message);
      return data;
    },
    staleTime: 5 * 60 * 1000 // 5 minute cache
  });

  return {
    users: data || [],
    loading: isLoading,
    error: error?.message
  };
}; 