"use client";

import { RotaTrpc, NewRotaTrpcParams, insertRotaTrpcParams } from "@/lib/db/schema/rotaTrpc";
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

const RotaTrpcForm = ({
  rotaTrpc,
  closeModal,
}: {
  rotaTrpc?: RotaTrpc;
  closeModal?: () => void;
}) => {
  
  const editing = !!rotaTrpc?.id;

  const router = useRouter();
  const utils = trpc.useUtils();

  const form = useForm<z.infer<typeof insertRotaTrpcParams>>({
    // latest Zod release has introduced a TS error with zodResolver
    // open issue: https://github.com/colinhacks/zod/issues/2663
    // errors locally but not in production
    resolver: zodResolver(insertRotaTrpcParams),
    defaultValues: rotaTrpc ?? {
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

    await utils.rotaTrpc.getRotaTrpc.invalidate();
    router.refresh();
    if (closeModal) closeModal();
        toast.success(`Rota Trpc ${action}d!`);
  };

  const { mutate: createRotaTrpc, isLoading: isCreating } =
    trpc.rotaTrpc.createRotaTrpc.useMutation({
      onSuccess: (res) => onSuccess("create"),
      onError: (err) => onError("create", { error: err.message }),
    });

  const { mutate: updateRotaTrpc, isLoading: isUpdating } =
    trpc.rotaTrpc.updateRotaTrpc.useMutation({
      onSuccess: (res) => onSuccess("update"),
      onError: (err) => onError("update", { error: err.message }),
    });

  const { mutate: deleteRotaTrpc, isLoading: isDeleting } =
    trpc.rotaTrpc.deleteRotaTrpc.useMutation({
      onSuccess: (res) => onSuccess("delete"),
      onError: (err) => onError("delete", { error: err.message }),
    });

  const handleSubmit = (values: NewRotaTrpcParams) => {
    if (editing) {
      updateRotaTrpc({ ...values, id: rotaTrpc.id });
    } else {
      createRotaTrpc(values);
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
            onClick={() => deleteRotaTrpc({ id: rotaTrpc.id })}
          >
            Delet{isDeleting ? "ing..." : "e"}
          </Button>
        ) : null}
      </form>
    </Form>
  );
};

export default RotaTrpcForm;
