
import { type Teste, type CompleteTeste } from "@/lib/db/schema/teste";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<Teste>) => void;

export const useOptimisticTestes = (
  teste: CompleteTeste[],
  
) => {
  const [optimisticTestes, addOptimisticTeste] = useOptimistic(
    teste,
    (
      currentState: CompleteTeste[],
      action: OptimisticAction<Teste>,
    ): CompleteTeste[] => {
      const { data } = action;

      

      const optimisticTeste = {
        ...data,
        
        id: "optimistic",
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticTeste]
            : [...currentState, optimisticTeste];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticTeste } : item,
          );
        case "delete":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, id: "delete" } : item,
          );
        default:
          return currentState;
      }
    },
  );

  return { addOptimisticTeste, optimisticTestes };
};
