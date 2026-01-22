import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, FileQuestionIcon } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="container max-w-2xl text-center">
        <div className="mb-8 flex justify-center">
          <div className="rounded-full bg-primary/10 p-6">
            <FileQuestionIcon className="size-16 text-primary" />
          </div>
        </div>

        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">Project Not Found</h1>

        <p className="mb-8 text-lg text-muted-foreground">
          We couldn't find the project you're looking for. It may have been moved or doesn't exist.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button size="lg" className="bg-orange-500 text-white hover:bg-orange-600" asChild>
            <Link href="/#portfolio">
              <ArrowLeftIcon className="mr-2 size-4" />
              Back to Portfolio
            </Link>
          </Button>

          <Button size="lg" variant="outline" asChild>
            <Link href="/">Go to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
