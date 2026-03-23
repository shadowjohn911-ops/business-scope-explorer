import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { transactionInsightData } from "@/components/charts/TransactionInsightTable";
import { channelCostData, channelCostRates } from "@/components/charts/ChannelCostTable";
import { industryBase, cardTypeBase, productBase, applyPeriod } from "@/components/charts/TransactionDistributionChart";
import { providerIntakeVolatilityData } from "@/components/charts/ProviderIntakeVolatilityTable";
import { providerTransactionVolatilityData } from "@/components/charts/ProviderTransactionVolatilityTable";
import { providerMerchantScaleData, providerTransactionScaleData } from "@/components/charts/ProviderDistributionChart";
import { partnerBehaviorData } from "@/components/charts/PartnerBehaviorTable";
import { partnerIntakeVolatilityData } from "@/components/charts/PartnerIntakeVolatilityTable";
import { partnerTransactionVolatilityData } from "@/components/charts/PartnerTransactionVolatilityTable";
import { partnerMerchantScaleData, partnerTransactionScaleData } from "@/components/charts/PartnerDistributionChart";

type ModuleType = "merchant" | "transaction" | "organization";
type RoleType = "branch" | "provider" | "partner";
type PeriodType = "昨日" | "近7日" | "近30日" | "近90日";

interface SummaryItem {
  title: string;
  content: string;
}

const merchantSummaryByPeriod: Record<PeriodType, SummaryItem[]> = {
  "昨日": [
    { title: "入网与首刷（即首次交易）", content: "入网商户22户（门店24家），环比增长50%；首刷8户（门店9家），环比下降40%；新商户交易转化率36.4%，与平均数据相比偏低。" },
    { title: "交易活跃度", content: "共有商户1800户，有交易行为的商户310户，环比下降5%，存量商户活跃度下滑。" },
    { title: "交易额波动", content: "交易额增长超200%的商户5户，波动±50%以内的180户，无交易20户，需关注高增长商户的潜力挖掘与无交易商户的流失风险。" },
    { title: "商户特征", content: "商户存活天数中位数130天，80%商户集中在30天至200天之间；行业分布以餐饮、零售为主，合计占比60%。" },
  ],
  "近7日": [
    { title: "入网与首刷（即首次交易）", content: "入网商户130户（门店150家），环比增长60%；首刷50户（门店57家），环比下降60%；新商户交易转化率38.5%，与平均数据相比偏低。" },
    { title: "交易活跃度", content: "共有商户1800户，有交易行为的商户730户，环比下降10%，存量商户活跃度下滑。" },
    { title: "交易额波动", content: "交易额增长超200%的商户30户，波动±50%以内的220户，无交易60户，需关注高增长商户的潜力挖掘与无交易商户的流失风险。" },
  ],
  "近30日": [
    { title: "入网与首刷（即首次交易）", content: "入网商户420户（门店480家），环比增长35%；首刷180户（门店210家），环比下降25%；新商户交易转化率42.9%，与平均数据相比偏低。" },
    { title: "交易活跃度", content: "共有商户1800户，有交易行为的商户850户，环比增长8%，存量商户活跃度回升。" },
    { title: "交易额波动", content: "交易额增长超200%的商户40户，波动±50%以内的350户，无交易95户，需关注高增长商户的潜力挖掘与无交易商户的流失风险。" },
  ],
  "近90日": [
    { title: "入网与首刷（即首次交易）", content: "入网商户480户（门店550家），环比增长20%；首刷350户（门店400家），环比下降15%；新商户交易转化率72.9%，与平均数据相比较高。" },
    { title: "交易活跃度", content: "共有商户1800户，有交易行为的商户920户，环比增长12%，存量商户活跃度持续提升。" },
    { title: "交易额波动", content: "交易额增长超200%的商户55户，波动±50%以内的480户，无交易120户，需关注高增长商户的潜力挖掘与无交易商户的流失风险。" },
  ],
};

function generateTransactionSummary(period: PeriodType, role: RoleType): SummaryItem[] {
  const txAmount = transactionInsightData["交易金额"][period];
  const txCount = transactionInsightData["交易笔数"][period];
  const txAvg = transactionInsightData["笔均金额"][period];
  const amtDir = txAmount.rate > 0 ? "增长" : "下降";
  const cntDir = txCount.rate > 0 ? "增长" : "下降";
  const avgDir = txAvg.rate > 0 ? "提升" : "下降";
  const scaleSummary = `${period === "昨日" ? "昨日" : period}交易金额${txAmount.value}元，环比${amtDir}${Math.abs(txAmount.rate).toFixed(1)}%；交易笔数${txCount.value}笔，环比${cntDir}${Math.abs(txCount.rate).toFixed(1)}%；笔均金额${txAvg.value}元，环比${avgDir}${Math.abs(txAvg.rate).toFixed(1)}%，整体交易稳步增长，活跃度与客单价同步提升。`;

  const costTotal = channelCostData["总计"][period];
  const costInterchange = channelCostData["交换费"][period];
  const costClearing = channelCostData["清算费"][period];
  const rates = channelCostRates[period];
  const costSummary = `通道总成本${costTotal.value}万元，其中交换费${costInterchange.value}万元（费率${rates.interchangeRate}%），清算费${costClearing.value}万元（费率${rates.clearingRate}%），通道成本率在合理区间范围。`;

  const industryData = applyPeriod(industryBase, period);
  const indTotal = industryData.reduce((s, d) => s + d.value, 0);
  const sorted = [...industryData].sort((a, b) => b.value - a.value);
  const top1 = sorted[0], top2 = sorted[1], top3 = sorted[2], top4 = sorted[3];
  const top1Pct = ((top1.value / indTotal) * 100).toFixed(0);
  const top2Pct = ((top2.value / indTotal) * 100).toFixed(0);
  const top12Pct = (((top1.value + top2.value) / indTotal) * 100).toFixed(0);
  const top3Pct = ((top3.value / indTotal) * 100).toFixed(0);
  const top4Pct = ((top4.value / indTotal) * 100).toFixed(0);
  const industrySummary = `${top1.name}（${top1Pct}%）、${top2.name}（${top2Pct}%）合计贡献${top12Pct}%的交易额；${top3.name}、${top4.name}占比分别为${top3Pct}%和${top4Pct}%，行业结构稳定，仍以${top1.name}${top2.name}为主力。`;

  const cardData = applyPeriod(cardTypeBase, period);
  const cardTotal = cardData.reduce((s, d) => s + d.value, 0);
  const cardSorted = [...cardData].sort((a, b) => b.value - a.value);
  const cardParts = cardSorted.map(c => `${c.name}${((c.value / cardTotal) * 100).toFixed(0)}%`);
  const debit = cardData.find(c => c.name === "借记卡")!;
  const credit = cardData.find(c => c.name === "贷记卡")!;
  const loanRatio = (credit.value / debit.value).toFixed(1);
  const cardSummary = `${cardParts[0].replace(/(\d+%)/, "占比$1")}居首位，${cardParts.slice(1).join("、")}，支付方式呈现移动支付与信用消费主导；借贷比（贷记卡/借记卡）为${loanRatio}。`;

  const prodData = applyPeriod(productBase, period);
  const prodTotal = prodData.reduce((s, d) => s + d.value, 0);
  const prodSorted = [...prodData].sort((a, b) => b.value - a.value);
  const prodParts = prodSorted.map(p => `${p.name}${((p.value / prodTotal) * 100).toFixed(0)}%`);
  const productSummary = `${prodParts.join("、")}。`;

  const result: SummaryItem[] = [
    { title: "交易规模", content: scaleSummary },
  ];
  if (role === "branch") {
    result.push({ title: "通道成本", content: costSummary });
  }
  result.push(
    { title: "行业结构", content: industrySummary },
    { title: "卡种偏好", content: cardSummary },
    { title: "产品分布", content: productSummary },
  );
  return result;
}

function rateDir(rate: number): string {
  return rate > 0 ? "增长" : "下降";
}

function generateOrganizationSummary(period: PeriodType, role: RoleType): SummaryItem[] {
  const result: SummaryItem[] = [];
  const entityLabel = role === "provider" ? "盟友" : "服务商";

  // 1. 服务商/盟友 进件波动
  const intakeUp200 = providerIntakeVolatilityData["⬆200%以上"][period];
  const intakeDown50 = providerIntakeVolatilityData["⬇50%~75%"][period];
  const intakeDown75 = providerIntakeVolatilityData["⬇75%~100%"][period];
  const intakeDown100 = providerIntakeVolatilityData["⬇100%"][period];
  const intakeDownTotal = intakeDown50.value + intakeDown75.value + intakeDown100.value;
  const intakeDownAvgRate = Math.round((intakeDown50.rate + intakeDown75.rate + intakeDown100.rate) / 3);
  result.push({
    title: `${entityLabel}进件波动`,
    content: `${period}进件增长超200%的${entityLabel}${intakeUp200.value}家，环比${rateDir(intakeUp200.rate)}${Math.abs(intakeUp200.rate)}%；进件下降超50%的${entityLabel}${intakeDownTotal}家，环比${rateDir(intakeDownAvgRate)}${Math.abs(intakeDownAvgRate)}%，${entityLabel}进件活跃度分化加剧，头部增长与尾部下滑并存。`,
  });

  // 2. 服务商/盟友 交易波动
  const txUp200 = providerTransactionVolatilityData["⬆200%以上"][period];
  const txDown50 = providerTransactionVolatilityData["⬇50%~75%"][period];
  const txDown75 = providerTransactionVolatilityData["⬇75%~100%"][period];
  const txDown100 = providerTransactionVolatilityData["⬇100%"][period];
  const txDownTotal = txDown50.value + txDown75.value + txDown100.value;
  const txDownAvgRate = Math.round((txDown50.rate + txDown75.rate + txDown100.rate) / 3);
  result.push({
    title: `${entityLabel}交易波动`,
    content: `${period}交易额增长超300%的${entityLabel}${txUp200.value}家，环比${rateDir(txUp200.rate)}${Math.abs(txUp200.rate)}%；交易额下降超50%的${entityLabel}${txDownTotal}家，环比${rateDir(txDownAvgRate)}${Math.abs(txDownAvgRate)}%，${entityLabel}交易表现波动扩大，尾部风险上升。`,
  });

  // 3. 交易服务商/盟友 结构
  const provMerchTotal = providerMerchantScaleData.reduce((s, d) => s + d.value, 0);
  const provTxTotal = providerTransactionScaleData.reduce((s, d) => s + d.value, 0);
  // 头部：商户数量超400户 (取最后几档合计)
  const highMerchCount = providerMerchantScaleData.filter(d => {
    const match = d.name.match(/(\d+)/);
    return match && parseInt(match[1]) >= 201;
  }).reduce((s, d) => s + d.value, 0);
  const highMerchPct = ((highMerchCount / provMerchTotal) * 100).toFixed(0);
  // 头部：交易金额超400万 (取高档合计)
  const highTxCount = providerTransactionScaleData.filter(d => {
    return d.name.includes("200w") || d.name.includes("1000w") || d.name.includes("5000w");
  }).reduce((s, d) => s + d.value, 0);
  const highTxPct = ((highTxCount / provTxTotal) * 100).toFixed(0);
  result.push({
    title: `交易${entityLabel}结构`,
    content: `30天内，交易商户数量超400户的${entityLabel}${highMerchCount}家，占整体${highMerchPct}%；交易金额超400万元的${entityLabel}${highTxCount}家，占整体${highTxPct}%，${entityLabel}结构呈现头部集中，中小${entityLabel}数量占比高但贡献有限。`,
  });

  // 4. 合作方入网与进件
  const entryData = partnerBehaviorData["入网"][period];
  const firstIntake = partnerBehaviorData["首次进件"][period];
  const activeData = partnerBehaviorData["活跃"][period];
  const conversionRate = entryData.value > 0 ? ((firstIntake.value / entryData.value) * 100).toFixed(1) : "0";
  const convLabel = parseFloat(conversionRate) < 50 ? "偏低" : "较高";
  result.push({
    title: "合作方入网与进件",
    content: `入网合作方${entryData.value}个，环比${rateDir(entryData.rate)}${Math.abs(entryData.rate)}%；首次进件${firstIntake.value}个，环比${rateDir(firstIntake.rate)}${Math.abs(firstIntake.rate)}%；新合作方进件转化率${conversionRate}%，与平均数据相比${convLabel}。有进件行为的合作方${activeData.value}个，环比${rateDir(activeData.rate)}${Math.abs(activeData.rate)}%。`,
  });

  // 5. 合作方进件波动
  const pIntakeUp200 = partnerIntakeVolatilityData["⬆200%以上"][period];
  const pIntakeDown50 = partnerIntakeVolatilityData["⬇50%~75%"][period];
  const pIntakeDown75 = partnerIntakeVolatilityData["⬇75%~100%"][period];
  const pIntakeDown100 = partnerIntakeVolatilityData["⬇100%"][period];
  const pIntakeDownTotal = pIntakeDown50.value + pIntakeDown75.value + pIntakeDown100.value;
  const pIntakeDownAvgRate = Math.round((pIntakeDown50.rate + pIntakeDown75.rate + pIntakeDown100.rate) / 3);
  result.push({
    title: "合作方进件波动",
    content: `${period}进件增长超200%的合作方${pIntakeUp200.value}个，环比${rateDir(pIntakeUp200.rate)}${Math.abs(pIntakeUp200.rate)}%；进件下降超50%的合作方${pIntakeDownTotal}个，环比${rateDir(pIntakeDownAvgRate)}${Math.abs(pIntakeDownAvgRate)}%，合作方进件活跃度分化加剧，头部增长与尾部下滑并存。`,
  });

  // 6. 合作方交易波动
  const pTxUp200 = partnerTransactionVolatilityData["⬆200%以上"][period];
  const pTxDown50 = partnerTransactionVolatilityData["⬇50%~75%"][period];
  const pTxDown75 = partnerTransactionVolatilityData["⬇75%~100%"][period];
  const pTxDown100 = partnerTransactionVolatilityData["⬇100%"][period];
  const pTxDownTotal = pTxDown50.value + pTxDown75.value + pTxDown100.value;
  const pTxDownAvgRate = Math.round((pTxDown50.rate + pTxDown75.rate + pTxDown100.rate) / 3);
  result.push({
    title: "合作方交易波动",
    content: `${period}交易额增长超300%的合作方${pTxUp200.value}个，环比${rateDir(pTxUp200.rate)}${Math.abs(pTxUp200.rate)}%；交易额下降超50%的合作方${pTxDownTotal}个，环比${rateDir(pTxDownAvgRate)}${Math.abs(pTxDownAvgRate)}%，合作方交易表现波动扩大，尾部风险上升。`,
  });

  // 7. 交易合作方结构
  const partMerchTotal = partnerMerchantScaleData.reduce((s, d) => s + d.value, 0);
  const partTxTotal = partnerTransactionScaleData.reduce((s, d) => s + d.value, 0);
  const highPartMerchCount = partnerMerchantScaleData.filter(d => {
    return d.name.includes("101") || d.name.includes("500户以上");
  }).reduce((s, d) => s + d.value, 0);
  const highPartMerchPct = ((highPartMerchCount / partMerchTotal) * 100).toFixed(0);
  const highPartTxCount = partnerTransactionScaleData.filter(d => {
    return d.name.includes("10w-50w") || d.name.includes("50w以上");
  }).reduce((s, d) => s + d.value, 0);
  const highPartTxPct = ((highPartTxCount / partTxTotal) * 100).toFixed(0);
  result.push({
    title: "交易合作方结构",
    content: `30天内，交易商户数量超400户的合作方${highPartMerchCount}个，占整体${highPartMerchPct}%；交易金额超400万元的合作方${highPartTxCount}个，占整体${highPartTxPct}%，合作方结构呈现头部集中，中小合作方数量占比高但贡献有限。`,
  });

  return result;
}

const summaryByPeriodMap: Record<ModuleType, Record<PeriodType, SummaryItem[]> | null> = {
  merchant: merchantSummaryByPeriod,
  transaction: null,
  organization: null, // generated dynamically
};

const periods: PeriodType[] = ["昨日", "近7日", "近30日", "近90日"];

interface Props {
  module: ModuleType;
  period: PeriodType;
  onPeriodChange: (p: PeriodType) => void;
  role?: RoleType;
}

const CoreDataSummary = ({ module, period, onPeriodChange, role = "branch" }: Props) => {
  const items = module === "transaction"
    ? generateTransactionSummary(period, role)
    : summaryByPeriodMap[module]![period];

  return (
    <Card className="border-border">
      <CardHeader className="px-3 py-2.5 pb-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs font-semibold text-foreground">核心数据摘要</CardTitle>
          <div className="flex bg-muted rounded-md p-0.5">
            {periods.map((p) => (
              <button
                key={p}
                onClick={() => onPeriodChange(p)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors ${
                  period === p
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground"
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
