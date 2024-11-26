"use client";
import { CompleteRotaTrpc } from "@/lib/db/schema/rotaTrpc";
import { trpc } from "@/lib/trpc/client";
import RotaTrpcModal from "./RotaTrpcModal";


export default function RotaTrpcList({ rotaTrpc }: { rotaTrpc: CompleteRotaTrpc[] }) {
  const { data: r } = trpc.rotaTrpc.getRotaTrpc.useQuery(undefined, {
    initialData: { rotaTrpc },
    refetchOnMount: false,
  });

  if (r.rotaTrpc.length === 0) {
    return <EmptyState />;
  }

  return (
    <ul>
      {r.rotaTrpc.map((rotaTrpc) => (
        <RotaTrpc rotaTrpc={rotaTrpc} key={rotaTrpc.id} />
      ))}
    </ul>
  );
}

const RotaTrpc = ({ rotaTrpc }: { rotaTrpc: CompleteRotaTrpc }) => {
  return (
    <li className="flex justify-between my-2">
      <div className="w-full">
        <div>{rotaTrpc.name}</div>
      </div>
      <RotaTrpcModal rotaTrpc={rotaTrpc} />
    </li>
  );
};

const EmptyState = () => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No rota trpc
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new rota trpc.
      </p>
      <div className="mt-6">
        <RotaTrpcModal emptyState={true} />
      </div>
    </div>
  );
};

