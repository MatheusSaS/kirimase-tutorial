"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/teste/useOptimisticTeste";
import { type Teste } from "@/lib/db/schema/teste";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import TesteForm from "@/components/teste/TesteForm";

export default function OptimisticTeste({ teste }: { teste: Teste }) {
  const [open, setOpen] = useState(false);
  const openModal = () => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticTeste, setOptimisticTeste] = useOptimistic(teste);
  const updateTeste: TAddOptimistic = (input) =>
    setOptimisticTeste({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <TesteForm
          teste={optimisticTeste}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateTeste}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{optimisticTeste.name}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticTeste.id === "optimistic" ? "animate-pulse" : ""
        )}
      >
        {JSON.stringify(optimisticTeste, null, 2)}
      </pre>
    </div>
  );
}
