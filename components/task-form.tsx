"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useModal } from "@/hooks/useModalStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Textarea } from "./ui/textarea";
const formSchema = z.object({
  title: z.string().min(5, {
    message: "Task title is required.",
  }),
  text: z.string().min(5, { message: "Task title is required" }),
});

export default function TaskForm() {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();
  const { text, title, id } = data;
  const isModalOpen = isOpen && (type === "createTask" || type === "editTask");
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      text: "",
    },
  });
  useEffect(() => {
    if (data) {
      form.setValue("text", text);
      form.setValue("title", title);
    }
  }, [form, title, text, data, id]);
  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (type === "createTask") {
        await fetch(`/api/task`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: values.title,
            text: values.text,
          }),
        });
      } else if (type === "editTask") {
        await fetch(`/api/task/${id}`, {
          method: "PATCH", // Change the method to PATCH
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: values.title,
            text: values.text,
          }),
        });
      }
      form.reset();
      router.refresh();
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create task</DialogTitle>
          {type === "editTask" && (
            <DialogDescription>
              Make changes to your task here. Click save when youre done.
            </DialogDescription>
          )}
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase text-zinc-500 dark:text-secondary/70">
                    Task title
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      className="text-black border-0 bg-zinc-300/50 focus-visible:ring-0 focus-visible:ring-offset-0"
                      placeholder="Enter task title"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase text-zinc-500 dark:text-secondary/70">
                    Task description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Type your message here."
                      id="message"
                      disabled={isLoading}
                      className="text-black border-0 bg-zinc-300/50 focus-visible:ring-0 focus-visible:ring-offset-0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="float-right">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              {type === "createTask" ? "New Task" : "Update Task"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
