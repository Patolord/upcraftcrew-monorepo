import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

interface ProjectsHeaderProps {
  onNewProject?: () => void;
}

export function ProjectsHeader({ onNewProject }: ProjectsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-medium text-orange-500">Projects</h1>
      </div>
      <Button
        className="btn btn-primary gap-2 rounded-full bg-orange-500 text-white border border-orange-500"
        onClick={onNewProject}
      >
        <PlusIcon className="h-4 w-4" />
        New Project
      </Button>
    </div>
  );
}
