import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useState, useMemo } from "react";
import ModuleTabs from "@/components/ModuleTabs";
import DimensionFilters from "@/components/DimensionFilters";
import MerchantBehaviorTable from "@/components/charts/MerchantBehaviorTable";
import ActiveMerchantChart from "@/components/charts/ActiveMerchantChart";
import TransactionVolatilityTable from "@/components/charts/TransactionVolatilityTable";
import TransactionInsightTable from "@/components/charts/TransactionInsightTable";
import ChannelCostTable from "@/components/charts/ChannelCostTable";
import TransactionDistributionChart from "@/components/charts/TransactionDistributionChart";
import ProviderIntakeVolatilityTable from "@/components/charts/ProviderIntakeVolatilityTable";
import ProviderTransactionVolatilityTable from "@/components/charts/ProviderTransactionVolatilityTable";
import ProviderDistributionChart from "@/components/charts/ProviderDistributionChart";
import PartnerBehaviorTable from "@/components/charts/PartnerBehaviorTable";
import PartnerIntakeVolatilityTable from "@/components/charts/PartnerIntakeVolatilityTable";
import PartnerTransactionVolatilityTable from "@/components/charts/PartnerTransactionVolatilityTable";
import PartnerDistributionChart from "@/components/charts/PartnerDistributionChart";
import CoreDataSummary from "@/components/CoreDataSummary";

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
  const [selectedCardTypes, setSelectedCardTypes] = useState<string[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedBusinessModes, setSelectedBusinessModes] = useState<string[]>([]);

  const handleModuleChange = (m: ModuleType) => {
    setActiveModule(m);
    setOwnerLevel1("全部");
    setSelectedCardTypes([]);
    setSelectedProducts([]);
    setSelectedBusinessModes([]);
  };

  // Filter key to force data regeneration when any filter changes
  const filterKey = useMemo(
    () => `${ownerLevel1}-${selectedBusinessModes.join(",")}-${selectedCardTypes.join(",")}-${selectedProducts.join(",")}`,
    [ownerLevel1, selectedBusinessModes, selectedCardTypes, selectedProducts]
  );

  const disablePartnerDetails = roleType === "provider" && (ownerLevel1 === "全部" || ownerLevel1 === "盟友");

  return (
    <div className="min-h-screen bg-background flex flex-col items-center">
      <div className="w-full max-w-md min-h-screen flex flex-col">
        <div className="sticky top-0 z-10 bg-card border-b border-border">
          <div className="flex items-center h-11 px-3">
            <button onClick={() => navigate("/")} className="p-1 -ml-1">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <h1 className="flex-1 text-center font-semibold text-sm text-foreground pr-6">
              {roleLabels[roleType]}数据看板
            </h1>
          </div>
          <ModuleTabs active={activeModule} onChange={handleModuleChange} role={roleType} />
        </div>

        <div className="flex-1 px-3 pt-3 pb-6">
          <DimensionFilters
            role={roleType}
            module={activeModule}
            onOwnerLevel1Change={setOwnerLevel1}
            onCardTypeChange={setSelectedCardTypes}
            onProductChange={setSelectedProducts}
            onBusinessModeChange={setSelectedBusinessModes}
          />

          <div className="mt-4 space-y-3">
            {activeModule === "merchant" && (
              <>
                <CoreDataSummary module="merchant" />
                <MerchantBehaviorTable key={`mb-${filterKey}`} />
                <ActiveMerchantChart key={`ac-${filterKey}`} />
                <TransactionVolatilityTable key={`tv-${filterKey}`} />
              </>
            )}

            {activeModule === "transaction" && (
              <>
                <CoreDataSummary module="transaction" />
                <TransactionInsightTable key={`ti-${filterKey}`} />
                {roleType === "branch" && <ChannelCostTable key={`cc-${filterKey}`} />}
                <TransactionDistributionChart
                  key={`td-${filterKey}`}
                  selectedCardTypes={selectedCardTypes}
                  selectedProducts={selectedProducts}
                />
              </>
            )}

            {activeModule === "organization" && roleType === "branch" && (
              <>
                <CoreDataSummary module="organization" />
                {ownerLevel1 !== "自有" && (
                  <>
                    <ProviderIntakeVolatilityTable key={`piv-${filterKey}`} />
                    <ProviderTransactionVolatilityTable key={`ptv-${filterKey}`} />
                    <ProviderDistributionChart key={`pd-${filterKey}`} />
                  </>
                )}
                <PartnerBehaviorTable key={`pb-${filterKey}`} />
                <PartnerIntakeVolatilityTable key={`piv2-${filterKey}`} />
                <PartnerTransactionVolatilityTable key={`ptv2-${filterKey}`} />
                <PartnerDistributionChart key={`pdc-${filterKey}`} />
              </>
            )}

            {activeModule === "organization" && roleType === "provider" && (
              <>
                <CoreDataSummary module="organization" />
                {ownerLevel1 !== "自有" && (
                  <>
                    <ProviderIntakeVolatilityTable key={`piv-${filterKey}`} entityLabel="盟友" />
                    <ProviderTransactionVolatilityTable key={`ptv-${filterKey}`} entityLabel="盟友" />
                    <ProviderDistributionChart key={`pd-${filterKey}`} entityLabel="盟友" />
                  </>
                )}
                <PartnerBehaviorTable key={`pb-${filterKey}`} disableDetails={disablePartnerDetails} />
                <PartnerIntakeVolatilityTable key={`piv2-${filterKey}`} disableDetails={disablePartnerDetails} />
                <PartnerTransactionVolatilityTable key={`ptv2-${filterKey}`} disableDetails={disablePartnerDetails} />
                <PartnerDistributionChart key={`pdc-${filterKey}`} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
