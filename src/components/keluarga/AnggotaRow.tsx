'use client';

import { useState } from 'react';

import type {
  KeluargaAnggotaRow,
} from '@/lib/keluarga-service';

import {
  submitUnlinkWargaFromKeluarga,
} from '@/actions/keluarga-actions';

import GenderBadge from './GenderBadge';
import StatusWargaBadge from './StatusWargaBadge';

interface Props {
  person: KeluargaAnggotaRow;
  keluargaId: string;
}

export default function AnggotaRow({
  person,
  keluargaId,
}: Props) {

  const [isPending, setIsPending] = useState(false);

  async function handleUnlink() {

    if (
      !confirm(
        `Lepas ${person.nama} dari keluarga ini?`
      )
    ) {
      return;
    }

    try {

      setIsPending(true);

      const formData = new FormData();

      formData.append(
        'keluargaId',
        keluargaId
      );

      formData.append(
        'wargaId',
        String(person.id)
      );

      const result =
        await submitUnlinkWargaFromKeluarga(
          formData
        );

      if (!result.success) {
        alert(
          result.error ??
            'Gagal melepas warga.'
        );

        return;
      }

      window.location.reload();

    } finally {

      setIsPending(false);

    }

  }

  return (

    <tr className="border-t border-slate-100 text-sm text-slate-700">

      <td className="px-5 py-3 font-medium text-slate-900">
        {person.nama}
      </td>

      <td className="px-5 py-3">
        {person.status_dalam_keluarga ?? '-'}
      </td>

      <td className="px-5 py-3">

        <GenderBadge
          gender={person.jenis_kelamin ?? null}
        />

      </td>

      <td className="px-5 py-3">
        {person.tahun_kelahiran ?? '-'}
      </td>

      <td className="px-5 py-3">

        <StatusWargaBadge
          status={person.status_warga ?? null}
        />

      </td>

      <td className="px-5 py-3">
        {person.asal_rt_domisili ?? '-'}
      </td>

      <td className="px-5 py-3">
        {person.alamat ?? '-'}
      </td>

      <td className="px-5 py-3">

        <button
          type="button"
          onClick={handleUnlink}
          disabled={isPending}
          className="rounded-lg px-2 py-1 text-sm font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-50"
        >

          {isPending
            ? 'Memproses...'
            : 'Lepas'}

        </button>

      </td>

    </tr>

  );

}