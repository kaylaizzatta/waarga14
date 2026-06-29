import { createServerSupabaseClient } from './supabase-server';
import type { UserSession } from './types';

interface AuditLogInput {
  akunId: number;
  action: string;
  entity: string;
  entityId: number;
  description?: string;
  oldData?: unknown;
  newData?: unknown;
}

export async function createAuditLog({
  akunId,
  action,
  entity,
  entityId,
  description,
  oldData,
  newData,
}: AuditLogInput) {
  const supabase = createServerSupabaseClient();

  const { error } = await supabase
    .from('audit_logs')
    .insert({
      akun_id: akunId,
      action,
      entity,
      entity_id: entityId,
      description,
      old_data: oldData,
      new_data: newData,
    });

  if (error) {
    console.error('[createAuditLog]', error);
  }
}

export async function getAuditLogs(session: UserSession) {
  const supabase = createServerSupabaseClient();

  let query = supabase
    .from('audit_logs')
    .select(`
      *,
      akun (
        id,
        username,
        role,
        nama,
        rt_dikelola
      )
    `)
    .order('created_at', { ascending: false });

  if (session.role === 'RT') {
    query = query.eq('akun_id', session.id);
  }

  const { data, error } = await query;

  if (error) {
    console.error('[getAuditLogs]', error);
    return [];
  }

  return data;
}

export async function deleteAuditLog(id: number) {
  const supabase = createServerSupabaseClient();

  const { error } = await supabase
    .from('audit_logs')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('[deleteAuditLog]', error);
    throw error;
  }
}
