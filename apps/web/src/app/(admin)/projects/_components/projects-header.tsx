import { Button } from "@/components/ui/button";

interface ProjectsHeaderProps {
  onNewProject?: () => void;
}

export function ProjectsHeader({ onNewProject }: ProjectsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">Projects</h1>
        <p className="text-base-content/60 text-sm mt-1">Manage and track all your projects</p>
      </div>
      <Button className="btn btn-primary gap-2" onClick={onNewProject}>
        <span className="iconify lucide--plus size-5" />
        New Project
      </Button>
    </div>
  );
}
