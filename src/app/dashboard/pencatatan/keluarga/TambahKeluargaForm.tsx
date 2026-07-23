'use client';

import { useState } from 'react';

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import FamilyInformation from "@/components/keluarga/form/FamilyInformation";
import HeadOfFamilyCard from "@/components/keluarga/form/HeadOfFamilyCard";
import MemberList from "@/components/keluarga/form/MemberList";
import AddMemberButton from "@/components/keluarga/form/AddMemberButton";
import ActionButtons from "@/components/keluarga/form/ActionButtons";

import {
  AnggotaForm,
  InformasiKeluargaForm,
} from '@/components/keluarga/form/types';

interface Props {
  role: 'RW' | 'RT';
  rtDikelola: string | null;
}

export default function TambahKeluargaForm({
  role,
  rtDikelola,
}: Props) {

  const router = useRouter();

  const [family, setFamily] =
    useState<InformasiKeluargaForm>({
      rt: '',
      alamat: '',
    });

  const [head, setHead] = useState<AnggotaForm>({
    id: "head",

    nama: "",

    statusDalamKeluarga: "Kepala Keluarga",

    tahunKelahiran: "",

    jenisKelamin: "",

    agama: "",

    statusPerkawinan: "",

    pendidikan: "",

    pekerjaan: "",

    statusBantuan: "",

    statusKepemilikanRumah: "",
  });

  const [members, setMembers] = useState<AnggotaForm[]>([]);
  const [loading,setLoading]=useState(false);

  function updateHead(
      field: keyof AnggotaForm,
      value: string
  ){
      setHead((prev)=>({
          ...prev,
          [field]:value,
      }));
  }

  function updateMember(
    id: string,
    field: keyof AnggotaForm,
    value: string
  ){
      setMembers((prev)=>
          prev.map((item)=>
              item.id===id
                  ? {
                      ...item,
                      [field]:value,
                    }
                  : item
          )
      );
  }

  function deleteMember(id:string){

    setMembers((prev)=>
        prev.filter((x)=>x.id!==id)
    );
  }

  function addMember(){

      setMembers((prev)=>[
          ...prev,

          {
              id:crypto.randomUUID(),

              nama:"",

              jenisKelamin:"",

              tahunKelahiran:"",

              agama:"",

              statusPerkawinan:"",

              pendidikan:"",

              pekerjaan:"",

              statusBantuan:"",

              statusKepemilikanRumah:"",

              statusDalamKeluarga:"Anak",
          },
      ]);

  }

  async function handleSubmit(
        e:React.FormEvent<HTMLFormElement>
    ){

        e.preventDefault();

        setLoading(true);

        try{

            const payload = {
                family,
                head,
                members,
                };

                console.log("========== PAYLOAD FRONTEND ==========");
                console.dir(payload, { depth: null });

                const response = await fetch("/api/keluarga", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (result.success) {

              toast.success("Keluarga berhasil didaftarkan.");

              setTimeout(() => {
                router.push("/dashboard/data-keluarga");
              }, 1200);

            } else {

              toast.error(result.error ?? "Gagal menyimpan keluarga.");

            }

            }finally{

            setLoading(false);

        }

    }


  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
      >

      <FamilyInformation
          value={family}
          onChange={setFamily}
          role={role}
          rtDikelola={rtDikelola}
      />

      <HeadOfFamilyCard
          value={head}
          onChange={updateHead}
      />

      <MemberList
          members={members}
          onChange={updateMember}
          onDelete={deleteMember}
      />

    <AddMemberButton
        onClick={addMember}
    />

      <ActionButtons
        loading={loading}
      />

    </form>
  );
}