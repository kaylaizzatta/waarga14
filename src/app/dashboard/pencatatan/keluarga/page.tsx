import TambahKeluargaForm from "./TambahKeluargaForm";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function PendaftaranKeluargaPage() {

    const session = await getSession();

    if (!session){
        redirect("/login");
    }

    return (

        <main className="space-y-6">

            <div>

                <h1 className="text-3xl font-bold tracking-tight text-slate-900">

                    Pendaftaran Keluarga

                </h1>

                <p className="mt-2 text-base text-slate-600">

                    Daftarkan keluarga baru beserta seluruh anggotanya.

                </p>

            </div>

            <TambahKeluargaForm
                role={session.role}
                rtDikelola={session.rt_dikelola}
            />

        </main>

    );

}