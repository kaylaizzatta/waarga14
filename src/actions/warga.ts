'use server';
import { createAuditLog } from '@/lib/audit-service';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { getWargaById } from '@/lib/warga-service';
import { getSession } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// ── Shared state type ─────────────────────────────────────────────

export type WargaFormState =
  | { success: true }
  | { error: string }
  | null;

/** Alias untuk backward-compat dengan TambahWargaForm.tsx */
export type TambahWargaState = WargaFormState;

// ── Helper ────────────────────────────────────────────────────────

function str(fd: FormData, key: string): string {
  return (fd.get(key) as string | null)?.trim() ?? '';
}

function validateWargaFields(
  nama: string,
  asal_rt_domisili: string,
  alamat: string,
  jenis_kelamin: string,
  agama: string,
  tahun_raw: string
): WargaFormState | null {
  if (!nama)             return { error: 'Nama wajib diisi.' };
  if (!asal_rt_domisili) return { error: 'RT Domisili wajib dipilih.' };
  if (!alamat)           return { error: 'Alamat wajib diisi.' };
  if (!jenis_kelamin)    return { error: 'Jenis kelamin wajib dipilih.' };
  if (!agama)            return { error: 'Agama wajib dipilih.' };

  const tahun      = parseInt(tahun_raw, 10);
  const currentYear = new Date().getFullYear();
  if (!tahun_raw || isNaN(tahun) || tahun < 1930 || tahun > currentYear) {
    return { error: `Tahun kelahiran tidak valid (1930–${currentYear}).` };
  }

  return null; // valid
}

// ── Action: Tambah ────────────────────────────────────────────────

export async function tambahWargaAction(
  _prevState: WargaFormState,
  formData: FormData
): Promise<WargaFormState> {

  const session = await getSession();
  if (!session) return { error: 'Sesi tidak valid. Silakan login kembali.' };

  const nama             = str(formData, 'nama');
  const asal_rt_domisili = str(formData, 'asal_rt_domisili');
  const alamat           = str(formData, 'alamat');
  const jenis_kelamin    = str(formData, 'jenis_kelamin');
  const agama            = str(formData, 'agama');
  const tahun_raw        = str(formData, 'tahun_kelahiran');

  const validationError = validateWargaFields(
    nama, asal_rt_domisili, alamat, jenis_kelamin, agama, tahun_raw
  );
  if (validationError) return validationError;

  const supabase = createServerSupabaseClient();

  const payload = {
    nama,
    asal_rt_domisili,
    alamat,
    status_dalam_keluarga: str(formData, 'status_dalam_keluarga'),
    tahun_kelahiran: parseInt(tahun_raw, 10),
    jenis_kelamin,
    tingkat_pendidikan_terakhir: str(formData, 'tingkat_pendidikan_terakhir'),
    jenis_pekerjaan: str(formData, 'jenis_pekerjaan'),
    status_perkawinan: str(formData, 'status_perkawinan'),
    status_kepemilikan_rumah: str(formData, 'status_kepemilikan_rumah'),
    status_penerimaan_bantuan: str(formData, 'status_penerimaan_bantuan'),
    agama,
  };

  const { data, error } = await supabase
    .from('warga-rw14')
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error('[tambahWargaAction]', error.message);
    return { error: 'Gagal menyimpan data warga. Silakan coba lagi.' };
  }

  await createAuditLog({
    akunId: session.id,
    action: 'CREATE',
    entity: 'warga',
    entityId: data.id,
    description: `Menambahkan warga ${data.nama}`,
    newData: data,
  });
  return { success: true };
}

// ── Action: Perbarui ──────────────────────────────────────────────

export async function perbaruiWargaAction(
  _prevState: WargaFormState,
  formData: FormData
): Promise<WargaFormState> {

  const session = await getSession();
  if (!session) return { error: 'Sesi tidak valid. Silakan login kembali.' };

  // id dari hidden field di form
  const idRaw = str(formData, 'id');
  const id    = parseInt(idRaw, 10);
  if (!idRaw || isNaN(id) || id <= 0) {
    return { error: 'ID warga tidak valid.' };
  }

  const nama             = str(formData, 'nama');
  const asal_rt_domisili = str(formData, 'asal_rt_domisili');
  const alamat           = str(formData, 'alamat');
  const jenis_kelamin    = str(formData, 'jenis_kelamin');
  const agama            = str(formData, 'agama');
  const tahun_raw        = str(formData, 'tahun_kelahiran');

  const validationError = validateWargaFields(
    nama, asal_rt_domisili, alamat, jenis_kelamin, agama, tahun_raw
  );
  if (validationError) return validationError;

  // ── 1. Ambil data lama sebelum update ────────────────────────────
  const oldData = await getWargaById(id);
  if (!oldData) {
    return { error: 'Data warga tidak ditemukan.' };
  }

  // ── 2. Bangun payload update ──────────────────────────────────────
  const newData = {
    nama,
    asal_rt_domisili,
    alamat,
    status_dalam_keluarga:       str(formData, 'status_dalam_keluarga'),
    tahun_kelahiran:             parseInt(tahun_raw, 10),
    jenis_kelamin,
    tingkat_pendidikan_terakhir: str(formData, 'tingkat_pendidikan_terakhir'),
    jenis_pekerjaan:             str(formData, 'jenis_pekerjaan'),
    status_perkawinan:           str(formData, 'status_perkawinan'),
    status_kepemilikan_rumah:    str(formData, 'status_kepemilikan_rumah'),
    status_penerimaan_bantuan:   str(formData, 'status_penerimaan_bantuan'),
    agama,
  };

  const supabase = createServerSupabaseClient();

  const { error } = await supabase
    .from('warga-rw14')
    .update(newData)
    .eq('id', id);

  if (error) {
    console.error('[perbaruiWargaAction]', error.message);
    return { error: 'Gagal memperbarui data warga. Silakan coba lagi.' };
  }

  // ── 3. Audit log UPDATE (sebelum redirect) ────────────────────────
  await createAuditLog({
    akunId:      session.id,
    action:      'UPDATE',
    entity:      'warga',
    entityId:    id,
    description: `Memperbarui data warga ${nama}`,
    oldData,
    newData,
  });

  revalidatePath('/dashboard/data-warga');
  revalidatePath(`/dashboard/pencatatan/perbarui/${id}`);

  redirect(`/dashboard/pencatatan/perbarui/${id}?success=1`);
}