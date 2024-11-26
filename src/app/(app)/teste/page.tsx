import { Suspense } from "react";

import Loading from "@/app/loading";
import TesteList from "@/components/teste/TesteList";
import { getTestes } from "@/lib/api/teste/queries";

import { checkAuth } from "@/lib/auth/utils";

export const revalidate = 0;

export default async function TestePage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Teste</h1>
        </div>
        <Teste />
      </div>
    </main>
  );
}

const Teste = async () => {
  await checkAuth();

  const { teste } = await getTestes();

  return (
    <Suspense fallback={<Loading />}>
      <TesteList teste={teste} />
    </Suspense>
  );
};
