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
    <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
      <div className="stats text-center border border-orange-500 rounded-md">
        <div className="stat py-4">
          <div className="stat-title text-xs">Projects</div>
          <div className="stat-value text-2xl text-orange-500">{stats.activeProjects}</div>
          <div className="stat-desc text-xs">{totalProjects} total projects</div>
        </div>
      </div>

      <div className="stats text-center border border-orange-500 rounded-md">
        <div className="stat py-4">
          <div className="stat-title text-xs">Team Members</div>
          <div className="stat-value text-2xl text-orange-500">{stats.activeMembers}</div>
          <div className="stat-desc text-xs">{totalMembers} total members</div>
        </div>
      </div>

      <div className="stats text-center border border-orange-500 rounded-md">
        <div className="stat py-4">
          <div className="stat-title text-xs">Total Revenue</div>
          <div className="stat-value text-2xl text-orange-500">
            {(stats.totalRevenue / 1000).toFixed(0)}k
          </div>
          <div className="stat-desc text-xs">This period</div>
        </div>
      </div>

      <div className="stats text-center border border-orange-500 rounded-md">
        <div className="stat py-4">
          <div className="stat-title text-xs">Net Profit</div>
          <div className="stat-value text-2xl text-orange-500">
            {(stats.netProfit / 1000).toFixed(0)}k
          </div>
          <div className="stat-desc text-xs">
            {((stats.netProfit / stats.totalRevenue) * 100).toFixed(0)}% margin
          </div>
        </div>
      </div>

      <div className="stats text-center border border-orange-500 rounded-md">
        <div className="stat py-4">
          <div className="stat-title text-xs">Avg Progress</div>
          <div className="stat-value text-2xl text-orange-500">{stats.avgProgress.toFixed(0)}%</div>
          <div className="stat-desc text-xs">All projects</div>
        </div>
      </div>
    </div>
  );
}
