'use client';

import SectionCard from '@/components/warga/form/SectionCard';
import Field from '@/components/warga/form/Field';
import Input from '@/components/warga/form/Input';
import Select from '@/components/warga/form/Select';
import Opt from '@/components/warga/form/Opt';

import {
  AGAMA_OPTIONS,
  JENIS_KELAMIN_OPTIONS,
  PEKERJAAN_OPTIONS,
  PENDIDIKAN_OPTIONS,
  STATUS_BANTUAN_OPTIONS,
  STATUS_KEPEMILIKAN_RUMAH_OPTIONS,
  STATUS_PERKAWINAN_OPTIONS,
} from './constants';

import { AnggotaForm } from './types';

interface Props {
  value: AnggotaForm;

  onChange: (
    field: keyof AnggotaForm,
    value: string
  ) => void;
}

export default function HeadOfFamilyCard({
  value,
  onChange,
}: Props) {
  return (
    <SectionCard title="Kepala Keluarga">

      <Field
        label="Nama"
        required
      >
        <Input
          value={value.nama}
          onChange={(e) =>
            onChange("nama", e.target.value)
          }
        />
      </Field>

      <Field
        label="Jenis Kelamin"
        required
      >
        <Select
          value={value.jenisKelamin}
          onChange={(e) =>
            onChange(
              "jenisKelamin",
              e.target.value
            )
          }
        >
          <Opt items={JENIS_KELAMIN_OPTIONS}/>
        </Select>
      </Field>

      <Field
        label="Tahun Lahir"
        required
      >
        <Input
          type="number"
          value={value.tahunKelahiran}
          onChange={(e)=>
            onChange(
              "tahunKelahiran",
              e.target.value
            )
          }
        />
      </Field>

      <Field
        label="Agama"
        required
      >
        <Select
          value={value.agama}
          onChange={(e)=>
            onChange(
              "agama",
              e.target.value
            )
          }
        >
          <Opt items={AGAMA_OPTIONS}/>
        </Select>
      </Field>

      <Field
        label="Status Perkawinan"
        required
      >
        <Select
          value={value.statusPerkawinan}
          onChange={(e)=>
            onChange(
              "statusPerkawinan",
              e.target.value
            )
          }
        >
          <Opt items={STATUS_PERKAWINAN_OPTIONS}/>
        </Select>
      </Field>

      <Field
        label="Pendidikan"
      >
        <Select
          value={value.pendidikan}
          onChange={(e)=>
            onChange(
              "pendidikan",
              e.target.value
            )
          }
        >
          <Opt items={PENDIDIKAN_OPTIONS}/>
        </Select>
      </Field>

      <Field
        label="Pekerjaan"
      >
        <Select
          value={value.pekerjaan}
          onChange={(e)=>
            onChange(
              "pekerjaan",
              e.target.value
            )
          }
        >
          <Opt items={PEKERJAAN_OPTIONS}/>
        </Select>
      </Field>

      <Field
        label="Status Bantuan"
      >
        <Select
          value={value.statusBantuan}
          onChange={(e)=>
            onChange(
              "statusBantuan",
              e.target.value
            )
          }
        >
          <Opt items={STATUS_BANTUAN_OPTIONS}/>
        </Select>
      </Field>

      <Field
        label="Status Kepemilikan Rumah"
      >
        <Select
          value={value.statusKepemilikanRumah}
          onChange={(e)=>
            onChange(
              "statusKepemilikanRumah",
              e.target.value
            )
          }
        >
          <Opt items={STATUS_KEPEMILIKAN_RUMAH_OPTIONS}/>
        </Select>
      </Field>

    </SectionCard>
  );
}