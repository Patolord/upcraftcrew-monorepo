import { NewProjectModal } from "./new-project-modal";
import { UserMenu } from "./user-menu";

export function DashboardHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-base-content/60 text-sm mt-1">
          Welcome back! Here's what's happening today
        </p>
      </div>
      <div className="flex items-center gap-3">
        <UserMenu />
        <NewProjectModal />
      </div>
    </div>
  );
}
