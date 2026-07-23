import { createServerSupabaseClient } from "@/lib/supabase-server";

export interface CreateKeluargaPayload {
  family: any;
  head: any;
  members: any[];
}

export async function createKeluargaWithMembers(
  payload: CreateKeluargaPayload
) {
  const supabase = createServerSupabaseClient();

  const { family, head } = payload;

  console.log("========== PAYLOAD BACKEND ==========");
  console.dir(payload, { depth: null });

  console.log("========== MEMBERS BACKEND ==========");
  console.dir(payload.members, { depth: null });

  console.log("JUMLAH MEMBERS:", payload.members.length);

  // ======================================================
  // 1. INSERT KELUARGA
  // ======================================================

  const {
    data: keluarga,
    error: keluargaError,
  } = await supabase
    .from("keluarga")
    .insert({
      nama_keluarga: head.nama,
      alamat: family.alamat,
      rt: family.rt,
      status_keluarga: "Aktif",
    })
    .select()
    .single();

  if (keluargaError || !keluarga) {
    console.error(keluargaError);

    return {
      success: false,
      error: keluargaError?.message,
    };
  }

  // ======================================================
  // 2. INSERT KEPALA KELUARGA
  // ======================================================

  const {
    data: kepala,
    error: kepalaError,
  } = await supabase
    .from("warga-rw14")
    .insert({
      nama: head.nama,
      asal_rt_domisili: family.rt,
      alamat: family.alamat,
      status_dalam_keluarga: "Kepala Keluarga",
      tahun_kelahiran: Number(head.tahunKelahiran),
      jenis_kelamin: head.jenisKelamin,
      tingkat_pendidikan_terakhir: head.pendidikan,
      jenis_pekerjaan: head.pekerjaan,
      status_perkawinan: head.statusPerkawinan,
      status_kepemilikan_rumah: head.statusKepemilikanRumah,
      status_penerimaan_bantuan: head.statusBantuan,
      agama: head.agama,
      keluarga_id: keluarga.id,
      status_warga: "Aktif",
      is_deleted: false,
    })
    .select()
    .single();

  if (kepalaError || !kepala) {
    console.error(kepalaError);

    return {
      success: false,
      error: kepalaError?.message,
    };
  }

  // ======================================================
  // 3. UPDATE kepala_keluarga_id
  // ======================================================

  const { error: updateError } = await supabase
    .from("keluarga")
    .update({
      kepala_keluarga_id: kepala.id,
    })
    .eq("id", keluarga.id);

  if (updateError) {
    console.error(updateError);

    return {
      success: false,
      error: updateError.message,
    };
  }

  // ======================================================
  // 4. INSERT SELURUH ANGGOTA KELUARGA
  // ======================================================

  for (const member of payload.members) {
    console.log("AKAN INSERT MEMBER:");
    console.dir(member, { depth: null });

    const { error: anggotaError } = await supabase
      .from("warga-rw14")
      .insert({
        nama: member.nama,
        asal_rt_domisili: family.rt,
        alamat: family.alamat,
        status_dalam_keluarga: member.statusDalamKeluarga,
        tahun_kelahiran: Number(member.tahunKelahiran),
        jenis_kelamin: member.jenisKelamin,
        tingkat_pendidikan_terakhir: member.pendidikan,
        jenis_pekerjaan: member.pekerjaan,
        status_perkawinan: member.statusPerkawinan,
        status_kepemilikan_rumah: member.statusKepemilikanRumah,
        status_penerimaan_bantuan: member.statusBantuan,
        agama: member.agama,
        keluarga_id: keluarga.id,
        status_warga: "Aktif",
        is_deleted: false,
      });

    if (anggotaError) {
      console.error(anggotaError);

      return {
        success: false,
        error: anggotaError.message,
      };
    }
  }

  return {
    success: true,
    keluargaId: keluarga.id,
  };
}