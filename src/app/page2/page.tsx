import { cn } from "@/lib/utils";

export default function Page2() {
  return (
    <div className={cn("flex flex-col h-screen px-8")}>
      <p
        data-testid="heading-greet"
        className="text-4xl text-center font-bold font-manrope mt-8"
      >
        this is page 2
      </p>
    </div>
  );
}
