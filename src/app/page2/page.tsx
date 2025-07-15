"use client";

import { useTRPC } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

export default function Page2() {
  const trpc = useTRPC(); // use `import { trpc } from './utils/trpc'` if you're using the singleton pattern
  const userQuery = useQuery(trpc.greeting.queryOptions({ name: "Ubay" }));
  // const userCreator = useMutation(trpc.createUser.mutationOptions());

  return (
    <div className={cn("flex flex-col h-screen px-8")}>
      <p
        data-testid="heading-greet"
        className="text-4xl text-center font-bold font-manrope mt-8"
      >
        this is page 2
      </p>

      <p>{userQuery.data?.message}</p>
    </div>
  );
}
