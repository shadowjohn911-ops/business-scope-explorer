import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import ModuleTabs from "@/components/ModuleTabs";
import DimensionFilters from "@/components/DimensionFilters";
import MerchantBehaviorTable from "@/components/charts/MerchantBehaviorTable";
import ActiveMerchantChart from "@/components/charts/ActiveMerchantChart";
import TransactionVolatilityTable from "@/components/charts/TransactionVolatilityTable";
import TransactionInsightTable from "@/components/charts/TransactionInsightTable";
import ChannelCostTable from "@/components/charts/ChannelCostTable";
import TransactionDistributionChart from "@/components/charts/TransactionDistributionChart";

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
  const [ownerLevel1, setOwnerLevel1] = useState<string>("全部");

  // Reset owner level1 when module changes
  const handleModuleChange = (m: ModuleType) => {
    setActiveModule(m);
    setOwnerLevel1("全部");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center">
      <div className="w-full max-w-md min-h-screen flex flex-col">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-card border-b border-border">
          <div className="flex items-center h-11 px-3">
            <button onClick={() => navigate("/")} className="p-1 -ml-1">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <h1 className="flex-1 text-center font-semibold text-sm text-foreground pr-6">
              {roleLabels[roleType]}数据看板
            </h1>
          </div>

          {/* Module tabs */}
          <ModuleTabs active={activeModule} onChange={handleModuleChange} role={roleType} />
        </div>

        {/* Filters */}
        <div className="flex-1 px-3 pt-3 pb-6">
          <DimensionFilters role={roleType} module={activeModule} onOwnerLevel1Change={setOwnerLevel1} />

          {/* Data content area */}
          <div className="mt-4 space-y-3">
            {activeModule === "merchant" && (
              <>
                <MerchantBehaviorTable />
                <ActiveMerchantChart />
                <TransactionVolatilityTable />
              </>
            )}

            {activeModule === "transaction" && (
              <div className="bg-card rounded-lg border border-border p-5 text-center">
                <p className="text-muted-foreground text-xs">
                  {roleLabels[roleType]} · 交易洞察 数据区域
                </p>
                <p className="text-[10px] text-muted-foreground mt-1.5">选择维度筛选后查看数据</p>
              </div>
            )}

            {activeModule === "organization" && roleType === "branch" && (
              <>
                {ownerLevel1 !== "自有" && (
                  <div className="bg-card rounded-lg border border-border p-5 text-center">
                    <p className="text-muted-foreground text-xs font-medium">服务商洞察</p>
                    <p className="text-[10px] text-muted-foreground mt-1.5">服务商相关数据展示区域</p>
                  </div>
                )}
                <div className="bg-card rounded-lg border border-border p-5 text-center">
                  <p className="text-muted-foreground text-xs font-medium">合作方洞察</p>
                  <p className="text-[10px] text-muted-foreground mt-1.5">合作方相关数据展示区域</p>
                </div>
              </>
            )}

            {activeModule === "organization" && roleType === "provider" && (
              <>
                {ownerLevel1 !== "自有" && (
                  <div className="bg-card rounded-lg border border-border p-5 text-center">
                    <p className="text-muted-foreground text-xs font-medium">盟友洞察</p>
                    <p className="text-[10px] text-muted-foreground mt-1.5">盟友相关数据展示区域</p>
                  </div>
                )}
                <div className="bg-card rounded-lg border border-border p-5 text-center">
                  <p className="text-muted-foreground text-xs font-medium">合作方洞察</p>
                  <p className="text-[10px] text-muted-foreground mt-1.5">合作方相关数据展示区域</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
