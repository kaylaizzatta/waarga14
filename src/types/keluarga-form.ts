export interface AnggotaKeluargaForm {
  id: string;

  nama: string;

  tahun_kelahiran: string;

  jenis_kelamin: string;

  agama: string;

  status_perkawinan: string;

  tingkat_pendidikan_terakhir: string;

  jenis_pekerjaan: string;

  status_penerimaan_bantuan: string;

  status_kepemilikan_rumah: string;

  status_dalam_keluarga: string;
}

export interface KeluargaForm {
  rt: string;

  alamat: string;

  catatan: string;

  anggota: AnggotaKeluargaForm[];
}