export const logAdminAction = async (
  user: User,
  action: string,
  metadata: Record<string, unknown>
) => {
  await supabaseAdmin.from('admin_audit').insert({
    user_id: user.id,
    action,
    metadata,
    ip_address: '', // Get from request context
    user_agent: '' // Get from request context
  });
}; 