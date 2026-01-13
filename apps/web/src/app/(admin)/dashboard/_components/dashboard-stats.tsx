"use client";

interface DashboardStatsProps {
  stats: {
    activeProjects: number;
    activeMembers: number;
    totalRevenue: number;
    netProfit: number;
    avgProgress: number;
  };
  totalProjects: number;
  totalMembers: number;
}

export function DashboardStats({ stats, totalProjects, totalMembers }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <div className="stats shadow border border-base-300">
        <div className="stat py-4">
          <div className="stat-figure text-primary">
            <span className="iconify lucide--briefcase size-8" />
          </div>
          <div className="stat-title text-xs">Active Projects</div>
          <div className="stat-value text-2xl text-primary">{stats.activeProjects}</div>
          <div className="stat-desc text-xs">{totalProjects} total projects</div>
        </div>
      </div>

      <div className="stats shadow border border-base-300">
        <div className="stat py-4">
          <div className="stat-figure text-success">
            <span className="iconify lucide--users size-8" />
          </div>
          <div className="stat-title text-xs">Team Members</div>
          <div className="stat-value text-2xl text-success">{stats.activeMembers}</div>
          <div className="stat-desc text-xs">{totalMembers} total members</div>
        </div>
      </div>

      <div className="stats shadow border border-base-300">
        <div className="stat py-4">
          <div className="stat-figure text-info">
            <span className="iconify lucide--dollar-sign size-8" />
          </div>
          <div className="stat-title text-xs">Total Revenue</div>
          <div className="stat-value text-2xl text-info">
            {(stats.totalRevenue / 1000).toFixed(0)}k
          </div>
          <div className="stat-desc text-xs">This period</div>
        </div>
      </div>

      <div className="stats shadow border border-base-300">
        <div className="stat py-4">
          <div className="stat-figure text-success">
            <span className="iconify lucide--trending-up size-8" />
          </div>
          <div className="stat-title text-xs">Net Profit</div>
          <div className="stat-value text-2xl text-success">
            {(stats.netProfit / 1000).toFixed(0)}k
          </div>
          <div className="stat-desc text-xs">
            {((stats.netProfit / stats.totalRevenue) * 100).toFixed(0)}% margin
          </div>
        </div>
      </div>

      <div className="stats shadow border border-base-300">
        <div className="stat py-4">
          <div className="stat-figure text-warning">
            <span className="iconify lucide--activity size-8" />
          </div>
          <div className="stat-title text-xs">Avg Progress</div>
          <div className="stat-value text-2xl text-warning">{stats.avgProgress.toFixed(0)}%</div>
          <div className="stat-desc text-xs">All projects</div>
        </div>
      </div>
    </div>
  );
}
