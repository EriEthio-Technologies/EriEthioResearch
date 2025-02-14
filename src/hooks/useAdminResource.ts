import { useState, useCallback, useEffect } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';

export const useAdminResource = <T extends unknown>(
  supabase: SupabaseClient,
  tableName: string,
  defaultSort = 'created_at',
  queryOptions = '*'
) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const { data: resData, error } = await supabase
        .from(tableName)
        .select(queryOptions)
        .order(defaultSort, { ascending: false });

      if (error) throw error;
      setData(resData as T[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [supabase, tableName, defaultSort, queryOptions]);

  const handleDelete = useCallback(async (id: string, activityLog: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    setActionLoading(true);
    try {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);

      if (error) throw error;

      await supabase.from('admin_activity').insert({
        type: 'deletion',
        description: activityLog,
      });

      setData(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Deletion failed');
    } finally {
      setActionLoading(false);
    }
  }, [supabase, tableName]);

  useEffect(() => {
    const channel = supabase
      .channel('realtime-content')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'content'
      }, () => fetchData())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchData, supabase]);

  return {
    data,
    loading,
    error,
    actionLoading,
    fetchData,
    handleDelete,
    setData,
  };
}; 