import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import ModuleTabs from "@/components/ModuleTabs";
import DimensionFilters from "@/components/DimensionFilters";

type RoleType = "branch" | "provider" | "partner";
type ModuleType = "merchant" | "transaction" | "organization";

const roleLabels: Record<RoleType, string> = {
  branch: "分公司",
  provider: "服务商",
  partner: "合作方",
};

const Dashboard = () => {
  const { role } = useParams<{ role: string }>();
  const navigate = useNavigate();
  const roleType = (role as RoleType) || "branch";
  const [activeModule, setActiveModule] = useState<ModuleType>("merchant");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-card border-b border-border">
        <div className="flex items-center h-12 px-4">
          <button onClick={() => navigate("/")} className="p-1 -ml-1">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="flex-1 text-center font-semibold text-foreground pr-6">
            {roleLabels[roleType]}数据看板
          </h1>
        </div>

        {/* Module tabs */}
        <ModuleTabs active={activeModule} onChange={setActiveModule} />
      </div>

      {/* Filters */}
      <div className="flex-1 px-4 pt-4 pb-8">
        <DimensionFilters role={roleType} module={activeModule} />

        {/* Placeholder content */}
        <div className="mt-6 bg-card rounded-xl border border-border p-6 text-center">
          <p className="text-muted-foreground text-sm">
            {roleLabels[roleType]} · {activeModule === "merchant" ? "商户洞察" : activeModule === "transaction" ? "交易洞察" : "组织洞察"} 数据区域
          </p>
          <p className="text-xs text-muted-foreground mt-2">选择维度筛选后查看数据</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
