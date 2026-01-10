import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load the dashboard data. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-center space-y-4 max-w-md">
        <div className="flex justify-center">
          <span className="iconify lucide--alert-circle size-16 text-error" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-base-content/60 text-sm">{message}</p>
        </div>
        {onRetry && (
          <Button onClick={onRetry} className="btn btn-primary">
            <span className="iconify lucide--refresh-cw size-4" />
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
}
