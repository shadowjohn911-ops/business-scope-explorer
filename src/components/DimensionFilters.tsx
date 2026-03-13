import { useState } from "react";
import MultiSelectFilter from "@/components/MultiSelectFilter";
import MerchantOwnerFilter from "@/components/MerchantOwnerFilter";

type RoleType = "branch" | "provider" | "partner";
type ModuleType = "merchant" | "transaction" | "organization";

const businessModes = ["渠道", "四方", "saas", "资源", "地推"];
const cardTypes = ["借记卡", "贷记卡", "预付卡"];
const products = ["收款码", "POS", "扫码盒", "智能POS"];

interface DimensionConfig {
  showBusinessMode: boolean;
  showMerchantOwner: boolean;
  showCardType: boolean;
  showProduct: boolean;
}

const getConfig = (module: ModuleType): DimensionConfig => {
  switch (module) {
    case "merchant":
      return { showBusinessMode: true, showMerchantOwner: true, showCardType: false, showProduct: false };
    case "transaction":
      return { showBusinessMode: true, showMerchantOwner: true, showCardType: true, showProduct: true };
    case "organization":
      return { showBusinessMode: true, showMerchantOwner: true, showCardType: false, showProduct: false };
  }
};

interface Props {
  role: RoleType;
  module: ModuleType;
}

const DimensionFilters = ({ role, module }: Props) => {
  const config = getConfig(module);

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">筛选维度</h3>

      {config.showBusinessMode && (
        <MultiSelectFilter label="展业模式" options={businessModes} />
      )}

      {config.showMerchantOwner && (
        <MerchantOwnerFilter role={role} />
      )}

      {config.showCardType && (
        <MultiSelectFilter label="卡种" options={cardTypes} />
      )}

      {config.showProduct && (
        <MultiSelectFilter label="产品" options={products} />
      )}
    </div>
  );
};

export default DimensionFilters;
