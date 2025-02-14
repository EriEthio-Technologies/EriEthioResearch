import { useQuery } from '@tanstack/react-query';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const MonitoringDashboard = () => {
  const { data } = useQuery(['metrics'], async () => {
    const { data } = await supabaseAdmin.rpc('get_system_metrics');
    return data;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <MetricCard 
        title="Active Users" 
        value={data?.active_users}
      />
      <MetricCard
        title="API Latency"
        value={`${data?.api_latency}ms`}
      />
      <MetricCard
        title="Error Rate"
        value={`${data?.error_rate}%`}
      />
    </div>
  );
}; 