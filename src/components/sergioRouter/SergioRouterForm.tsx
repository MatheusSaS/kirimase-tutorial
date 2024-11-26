"use client";

import { SergioRouter, NewSergioRouterParams, insertSergioRouterParams } from "@/lib/db/schema/sergioRouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const SergioRouterForm = ({
  sergioRouter,
  closeModal,
}: {
  sergioRouter?: SergioRouter;
  closeModal?: () => void;
}) => {
  
  const editing = !!sergioRouter?.id;

  const router = useRouter();
  const utils = trpc.useUtils();

  const form = useForm<z.infer<typeof insertSergioRouterParams>>({
    // latest Zod release has introduced a TS error with zodResolver
    // open issue: https://github.com/colinhacks/zod/issues/2663
    // errors locally but not in production
    resolver: zodResolver(insertSergioRouterParams),
    defaultValues: sergioRouter ?? {
      name: ""
    },
  });

  const onSuccess = async (action: "create" | "update" | "delete",
    data?: { error?: string },
  ) => {
        if (data?.error) {
      toast.error(data.error)
      return;
    }

    await utils.sergioRouter.getSergioRouter.invalidate();
    router.refresh();
    if (closeModal) closeModal();
        toast.success(`Sergio Router ${action}d!`);
  };

  const { mutate: createSergioRouter, isLoading: isCreating } =
    trpc.sergioRouter.createSergioRouter.useMutation({
      onSuccess: (res) => onSuccess("create"),
      onError: (err) => onError("create", { error: err.message }),
    });

  const { mutate: updateSergioRouter, isLoading: isUpdating } =
    trpc.sergioRouter.updateSergioRouter.useMutation({
      onSuccess: (res) => onSuccess("update"),
      onError: (err) => onError("update", { error: err.message }),
    });

  const { mutate: deleteSergioRouter, isLoading: isDeleting } =
    trpc.sergioRouter.deleteSergioRouter.useMutation({
      onSuccess: (res) => onSuccess("delete"),
      onError: (err) => onError("delete", { error: err.message }),
    });

  const handleSubmit = (values: NewSergioRouterParams) => {
    if (editing) {
      updateSergioRouter({ ...values, id: sergioRouter.id });
    } else {
      createSergioRouter(values);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={"space-y-8"}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (<FormItem>
              <FormLabel>Name</FormLabel>
                <FormControl>
            <Input {...field} />
          </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="mr-1"
          disabled={isCreating || isUpdating}
        >
          {editing
            ? `Sav${isUpdating ? "ing..." : "e"}`
            : `Creat${isCreating ? "ing..." : "e"}`}
        </Button>
        {editing ? (
          <Button
            type="button"
            variant={"destructive"}
            onClick={() => deleteSergioRouter({ id: sergioRouter.id })}
          >
            Delet{isDeleting ? "ing..." : "e"}
          </Button>
        ) : null}
      </form>
    </Form>
  );
};

export default SergioRouterForm;
