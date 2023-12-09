"use client";

import { Button, ButtonProps, buttonVariants } from "@/components/ui/button";
import { useModal } from "@/hooks/useModalStore";
import { cn } from "@/lib/utils";

interface PostCreateButtonProps extends ButtonProps {}

export function PostCreateButton({
  className,
  variant,
  ...props
}: PostCreateButtonProps) {
  const { onOpen } = useModal();
  async function onClick() {
    onOpen("createTask");
  }

  return (
    <Button
      onClick={onClick}
      className={cn(buttonVariants({ variant }), className)}
      {...props}
    >
      + New task
    </Button>
  );
}
