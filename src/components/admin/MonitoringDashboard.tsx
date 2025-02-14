import { useQuery } from '@tanstack/react-query';
import { supabaseAdmin } from '@/lib/supabase-admin';

const MetricCard = ({ title, value }: { title: string; value: string }) => (
  <div className="bg-black/30 p-4 rounded-lg border border-neon-cyan/20">
    <h3 className="text-neon-magenta mb-2">{title}</h3>
    <div className="text-2xl text-neon-cyan">{value}</div>
  </div>
);

export const MonitoringDashboard = () => {
  const { data } = useQuery(['metrics'], async () => {
    const { data } = await supabaseAdmin.rpc('get_system_metrics');
    return data;
  });

  return (
    <div className="grid grid-cols-3 gap-4">
      <MetricCard title="Active Users" value={data?.active_users || '0'} />
      <MetricCard title="API Latency" value={`${data?.api_latency}ms`} />
      <MetricCard title="Error Rate" value={`${data?.error_rate}%`} />
    </div>
  );
}; 