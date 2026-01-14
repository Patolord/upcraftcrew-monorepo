import { Button } from "@/components/ui/button";
import { AlertCircleIcon, RefreshCwIcon } from "lucide-react";

interface DashboardErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function DashboardErrorState({
  title = "Something went wrong",
  message = "We couldn't load the dashboard data. Please try again.",
  onRetry,
}: DashboardErrorStateProps) {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-center space-y-4 max-w-md">
        <div className="flex justify-center">
          <AlertCircleIcon className="h-16 w-16 text-error" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-base-content/60 text-sm">{message}</p>
        </div>
        {onRetry && (
          <Button onClick={onRetry} className="gap-2">
            <RefreshCwIcon className="h-4 w-4" />
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
}
