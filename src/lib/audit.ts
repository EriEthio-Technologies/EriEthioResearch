export const logAdminAction = async (
  action: string,
  target: string,
  user_id: string
) => {
  await supabaseAdmin.from('audit_logs').insert({
    action,
    target,
    user_id,
    ip_address: '', // Get from request context
    user_agent: navigator.userAgent
  });
}; 