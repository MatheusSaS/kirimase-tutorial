"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { type Teste, CompleteTeste } from "@/lib/db/schema/teste";
import Modal from "@/components/shared/Modal";

import { Button } from "@/components/ui/button";
import TesteForm from "./TesteForm";
import { PlusIcon } from "lucide-react";
import { useOptimisticTestes } from "@/app/(app)/teste/useOptimisticTeste";

type TOpenModal = (teste?: Teste) => void;

export default function TesteList({ teste }: { teste: CompleteTeste[] }) {
  const { optimisticTestes, addOptimisticTeste } = useOptimisticTestes(teste);
  const [open, setOpen] = useState(false);
  const [activeTeste, setActiveTeste] = useState<Teste | null>(null);
  const openModal = (teste?: Teste) => {
    setOpen(true);
    teste ? setActiveTeste(teste) : setActiveTeste(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeTeste ? "Edit Teste" : "Create Teste"}
      >
        <TesteForm
          teste={activeTeste}
          addOptimistic={addOptimisticTeste}
          openModal={openModal}
          closeModal={closeModal}
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={"outline"}>
          +
        </Button>
      </div>
      {optimisticTestes.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticTestes.map((teste) => (
            <Teste teste={teste} key={teste.id} openModal={openModal} />
          ))}
        </ul>
      )}
    </div>
  );
}

const Teste = ({
  teste,
  openModal,
}: {
  teste: CompleteTeste;
  openModal: TOpenModal;
}) => {
  const optimistic = teste.id === "optimistic";
  const deleting = teste.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("teste") ? pathname : pathname + "/teste/";

  return (
    <li
      className={cn(
        "flex justify-between my-2",
        mutating ? "opacity-30 animate-pulse" : "",
        deleting ? "text-destructive" : ""
      )}
    >
      <div className="w-full">
        <div>{teste.name}</div>
      </div>
      <Button variant={"link"} asChild>
        <Link href={basePath + "/" + teste.id}>Edit</Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No teste
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new teste.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Teste{" "}
        </Button>
      </div>
    </div>
  );
};
