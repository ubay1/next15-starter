/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useTRPC } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

export default function Page2() {
  const trpc = useTRPC(); // use `import { trpc } from './utils/trpc'` if you're using the singleton pattern

  const getAllUser = useQuery(trpc.user.getAll.queryOptions());
  const insertUser = useMutation(
    trpc.user.addUser.mutationOptions({
      onSuccess: (data) => {
        console.log("sukses add data = ", data);
        getAllUser.refetch(); // Refresh user list
      },
    })
  );

  const schema = z.object({
    name: z.string().min(3, {
      message: "Name must be at least 3 characters long",
    }),
    age: z.number().min(1, {
      message: "Minimal value is 1",
    }),
    role: z.string().min(1, {
      message: "Role wajib diisi",
    }),
  });

  type FormValues = z.infer<typeof schema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "", // fix error "A component is changing an uncontrolled input to be controlled."
      age: 0,
      role: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log(data);
    insertUser.mutate({
      name: data.name,
      age: String(data.age),
      role: data.role,
    });
  };

  return (
    <div className={cn("flex flex-col h-screen px-8 mt-10")}>
      <Card>
        <CardContent>
          <div className="text-3xl text-center font-bold mb-10">
            CRUD TRPC + Tanstack Query + Supabase
          </div>
          <Form {...form}>
            <form
              className="w-full flex flex-col gap-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        data-testid="home-example-form-input"
                        type="text"
                        placeholder="Enter name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage data-testid="home-example-error-msg" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input
                        data-testid="home-example-form-input"
                        type="number"
                        placeholder="Enter age"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage data-testid="home-example-error-msg" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Input
                        data-testid="home-example-form-input"
                        type="text"
                        placeholder="Enter role"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage data-testid="home-example-error-msg" />
                  </FormItem>
                )}
              />
              <Button
                data-testid="home-example-btn-submit"
                className="mt-4"
                disabled={insertUser.isPending}
                type="submit"
              >
                Submit
              </Button>
            </form>
          </Form>

          <div className="mt-4">
            {getAllUser.isFetching && (
              <div className="flex flex-col gap-2">
                <Skeleton className="h-[125px] w-full rounded-xl" />
                <Skeleton className="h-[125px] w-full rounded-xl" />
                <Skeleton className="h-[125px] w-full rounded-xl" />
              </div>
            )}
            {getAllUser.data?.map((user) => (
              <Card key={user.id} className="mb-2">
                <CardContent>
                  <div>Name: {user.name}</div>
                  <div>Age: {user.age}</div>
                  <div>Role: {user.role}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
