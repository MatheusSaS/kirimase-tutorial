import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getTesteById } from "@/lib/api/teste/queries";
import OptimisticTeste from "./OptimisticTeste";
import { checkAuth } from "@/lib/auth/utils";


import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";


export const revalidate = 0;

export default async function TestePage({
  params,
}: {
  params: { testeId: string };
}) {

  return (
    <main className="overflow-auto">
      <Teste id={params.testeId} />
    </main>
  );
}

const Teste = async ({ id }: { id: string }) => {
  await checkAuth();

  const { teste } = await getTesteById(id);
  

  if (!teste) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="teste" />
        <OptimisticTeste teste={teste}  />
      </div>
    </Suspense>
  );
};
