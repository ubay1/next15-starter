"use client";

import { flex } from "@/lib/classes";
import { cn } from "@/lib/utils";
import { buttonVariant } from "@/lib/variants/button";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import Link from "next/link";

const baseSuccessVariant = buttonVariant({
  color: "success",
  size: "lg",
});
const baseBooleanVariant = buttonVariant({
  color: "secondary",
  disabled: true,
  size: "lg",
});
const baseCompoundVariant = buttonVariant({
  color: "success",
  disabled: true,
  size: "lg",
});
const baseCompount2Color = buttonVariant({
  color: "primary",
  disabled: true,
  size: "lg",
});

export default function Home() {
  const schema = z.object({
    username: z.string().min(3, {
      message: "Username must be at least 3 characters long",
    }),
  });

  type FormValues = z.infer<typeof schema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "", // fix error "A component is changing an uncontrolled input to be controlled."
    },
  });

  const [value, setValue] = useState("");
  const onSubmit = (data: FormValues) => {
    setValue(data.username);
  };
  return (
    <div className={cn("flex flex-col h-screen px-8")}>
      <p
        data-testid="heading-greet"
        className="text-4xl text-center font-bold font-manrope mt-8"
      >
        Hallo developer this is nextjs 15 starter
      </p>
      <p
        data-testid="heading-desc"
        className="text-2xl text-center font-manrope mt-2 mb-14"
      >
        Shadcn UI, CVA, Tailwind CSS, React Hook Form, Zod, Zustand, React
        Query, Vitest, React Testing Library, Playwright
      </p>

      <Card>
        <CardContent>
          <p className="text-2xl font-bold font-manrope mb-4 text-left">
            Button component + CVA
          </p>
          <div className={cn(flex.start, "flex-wrap gap-2")}>
            <button
              className={baseSuccessVariant}
              onClick={() => toast.success("Hallo")}
            >
              Success variant
            </button>
            <button className={baseBooleanVariant}>Boolean variant</button>
            <button className={baseCompoundVariant}>Compound variant</button>
            <button className={baseCompount2Color}>
              Compound variant with 2 color
            </button>
          </div>

          <hr className="my-8 border-1" />

          <p className="text-2xl font-bold font-manrope mb-4 text-left">
            Form (React Hook Form, Shadcn, Zod)
          </p>
          <Form {...form}>
            <form className="w-full" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        data-testid="home-example-form-input"
                        type="text"
                        placeholder="Enter username"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage data-testid="home-example-error-msg" />
                    {value && (
                      <p data-testid="home-example-username">Hallo {value}</p>
                    )}
                  </FormItem>
                )}
              />
              <Button
                data-testid="home-example-btn-submit"
                className="mt-4"
                type="submit"
              >
                Submit
              </Button>
            </form>
          </Form>

          <hr className="my-8 border-1" />

          <Button asChild data-testid="btn-goto-page2">
            <Link href="/page2">Goto Page 2</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
