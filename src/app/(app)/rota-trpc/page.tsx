import RotaTrpcList from "@/components/rotaTrpc/RotaTrpcList";
import NewRotaTrpcModal from "@/components/rotaTrpc/RotaTrpcModal";
import { api } from "@/lib/trpc/api";
import { checkAuth } from "@/lib/auth/utils";

export default async function RotaTrpc() {
  await checkAuth();
  const { rotaTrpc } = await api.rotaTrpc.getRotaTrpc.query();  

  return (
    <main>
      <div className="flex justify-between">
        <h1 className="font-semibold text-2xl my-2">Rota Trpc</h1>
        <NewRotaTrpcModal />
      </div>
      <RotaTrpcList rotaTrpc={rotaTrpc} />
    </main>
  );
}
