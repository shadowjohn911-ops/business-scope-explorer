import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ModuleType = "merchant" | "transaction" | "organization";
type PeriodType = "昨日" | "近7日" | "近30日" | "近90日";

interface SummaryItem {
  title: string;
  content: string;
}

const merchantSummaryByPeriod: Record<PeriodType, SummaryItem[]> = {
  "昨日": [
    { title: "入网与首刷", content: "入网商户18家，环比增长25%；首刷8家，环比下降30%；首刷率44.4%，新商户交易转化率偏低。" },
    { title: "交易活跃度", content: "有交易行为的商户680家，环比下降5%，存量商户活跃度下滑。" },
    { title: "商户特征", content: "商户存活天数中位数130天，80%商户集中在30天至200天之间；行业分布以餐饮、零售为主，合计占比60%。" },
    { title: "交易额波动", content: "交易额增长超300%的商户5户，波动±50%以内的180户，无交易80户，需关注极端高增长商户的潜力挖掘与无交易商户的流失风险。" },
  ],
  "近7日": [
    { title: "入网与首刷", content: "入网商户130家，环比增长60%；首刷50家，环比下降60%；首刷率38.5%，新商户交易转化率偏低。" },
    { title: "交易活跃度", content: "有交易行为的商户730家，环比下降10%，存量商户活跃度下滑。" },
    { title: "商户特征", content: "商户存活天数中位数130天，80%商户集中在30天至200天之间；行业分布以餐饮、零售为主，合计占比60%。" },
    { title: "交易额波动", content: "交易额增长超300%的商户30户，波动±50%以内的220户，无交易60户，需关注极端高增长商户的潜力挖掘与无交易商户的流失风险。" },
  ],
  "近30日": [
    { title: "入网与首刷", content: "入网商户480家，环比增长35%；首刷210家，环比下降20%；首刷率43.8%，新商户交易转化率偏低。" },
    { title: "交易活跃度", content: "有交易行为的商户820家，环比下降8%，存量商户活跃度下滑。" },
    { title: "商户特征", content: "商户存活天数中位数130天，80%商户集中在30天至200天之间；行业分布以餐饮、零售为主，合计占比60%。" },
    { title: "交易额波动", content: "交易额增长超300%的商户55户，波动±50%以内的350户，无交易95户，需关注极端高增长商户的潜力挖掘与无交易商户的流失风险。" },
  ],
  "近90日": [
    { title: "入网与首刷", content: "入网商户1200家，环比增长20%；首刷580家，环比下降15%；首刷率48.3%，新商户交易转化率偏低。" },
    { title: "交易活跃度", content: "有交易行为的商户910家，环比下降6%，存量商户活跃度下滑。" },
    { title: "商户特征", content: "商户存活天数中位数130天，80%商户集中在30天至200天之间；行业分布以餐饮、零售为主，合计占比60%。" },
    { title: "交易额波动", content: "交易额增长超300%的商户80户，波动±50%以内的480户，无交易120户，需关注极端高增长商户的潜力挖掘与无交易商户的流失风险。" },
  ],
};

const transactionSummaryByPeriod: Record<PeriodType, SummaryItem[]> = {
  "昨日": [
    { title: "交易规模", content: "交易金额120万元，环比增长5%；交易笔数1800笔，环比增长3%；笔均金额667元，保持稳定。" },
    { title: "成本结构", content: "通道成本合计0.6万元，交换费占比72%，清算费占比28%，整体成本率0.50%，环比持平。" },
    { title: "交易分布", content: "行业维度：餐饮、零售合计占交易额65%；卡种维度：借记卡交易占比55%，贷记卡35%，扫码10%。" },
  ],
  "近7日": [
    { title: "交易规模", content: "交易金额850万元，环比增长12%；交易笔数1.2万笔，环比增长8%；笔均金额708元，保持稳定。" },
    { title: "成本结构", content: "通道成本合计4.2万元，交换费占比72%，清算费占比28%，整体成本率0.49%，环比持平。" },
    { title: "交易分布", content: "行业维度：餐饮、零售合计占交易额65%；卡种维度：借记卡交易占比55%，贷记卡35%，扫码10%。" },
  ],
  "近30日": [
    { title: "交易规模", content: "交易金额3200万元，环比增长15%；交易笔数4.5万笔，环比增长10%；笔均金额711元，保持稳定。" },
    { title: "成本结构", content: "通道成本合计15.8万元，交换费占比71%，清算费占比29%，整体成本率0.49%，环比持平。" },
    { title: "交易分布", content: "行业维度：餐饮、零售合计占交易额65%；卡种维度：借记卡交易占比55%，贷记卡35%，扫码10%。" },
  ],
  "近90日": [
    { title: "交易规模", content: "交易金额9500万元，环比增长18%；交易笔数13万笔，环比增长12%；笔均金额731元，保持稳定。" },
    { title: "成本结构", content: "通道成本合计46.5万元，交换费占比70%，清算费占比30%，整体成本率0.49%，环比持平。" },
    { title: "交易分布", content: "行业维度：餐饮、零售合计占交易额65%；卡种维度：借记卡交易占比55%，贷记卡35%，扫码10%。" },
  ],
};

const organizationSummaryByPeriod: Record<PeriodType, SummaryItem[]> = {
  "昨日": [
    { title: "服务商/盟友动态", content: "进件波动超200%的服务商3家，交易额波动超200%的2家，需重点关注异常波动机构。" },
    { title: "合作方行为", content: "新入网合作方4家，环比增长15%；首次进件3家，活跃合作方80家，环比下降2%。" },
    { title: "分布特征", content: "交易分布中，活跃商户1-5户的服务商占比45%，6-20户占比30%，头部集中度偏高。" },
  ],
  "近7日": [
    { title: "服务商/盟友动态", content: "进件波动超200%的服务商15家，交易额波动超200%的12家，需重点关注异常波动机构。" },
    { title: "合作方行为", content: "新入网合作方25家，环比增长30%；首次进件18家，活跃合作方85家，环比下降5%。" },
    { title: "分布特征", content: "交易分布中，活跃商户1-5户的服务商占比45%，6-20户占比30%，头部集中度偏高。" },
  ],
  "近30日": [
    { title: "服务商/盟友动态", content: "进件波动超200%的服务商28家，交易额波动超200%的22家，需重点关注异常波动机构。" },
    { title: "合作方行为", content: "新入网合作方65家，环比增长25%；首次进件48家，活跃合作方92家，环比下降3%。" },
    { title: "分布特征", content: "交易分布中，活跃商户1-5户的服务商占比45%，6-20户占比30%，头部集中度偏高。" },
  ],
  "近90日": [
    { title: "服务商/盟友动态", content: "进件波动超200%的服务商42家，交易额波动超200%的35家，需重点关注异常波动机构。" },
    { title: "合作方行为", content: "新入网合作方180家，环比增长20%；首次进件130家，活跃合作方98家，环比下降4%。" },
    { title: "分布特征", content: "交易分布中，活跃商户1-5户的服务商占比45%，6-20户占比30%，头部集中度偏高。" },
  ],
};

const summaryByPeriodMap: Record<ModuleType, Record<PeriodType, SummaryItem[]>> = {
  merchant: merchantSummaryByPeriod,
  transaction: transactionSummaryByPeriod,
  organization: organizationSummaryByPeriod,
};

const periods: PeriodType[] = ["昨日", "近7日", "近30日", "近90日"];

interface Props {
  module: ModuleType;
}

const CoreDataSummary = ({ module }: Props) => {
  const [activePeriod, setActivePeriod] = useState<PeriodType>("近7日");
  const items = summaryByPeriodMap[module][activePeriod];

  return (
    <Card className="border-border">
      <CardHeader className="px-3 py-2.5 pb-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs font-semibold text-foreground">核心数据摘要</CardTitle>
          <div className="flex gap-1">
            {periods.map((p) => (
              <button
                key={p}
                onClick={() => setActivePeriod(p)}
                className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                  activePeriod === p
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-accent"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-3 py-2.5">
        <div className="space-y-2.5">
          {items.map((item, idx) => (
            <div key={idx} className="min-w-0">
              <span className="text-[11px] font-semibold text-foreground">{item.title}：</span>
              <span className="text-[11px] text-muted-foreground leading-relaxed">{item.content}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CoreDataSummary;
