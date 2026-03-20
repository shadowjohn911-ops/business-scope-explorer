import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { transactionInsightData } from "@/components/charts/TransactionInsightTable";
import { channelCostData, channelCostRates } from "@/components/charts/ChannelCostTable";
import { industryBase, cardTypeBase, productBase } from "@/components/charts/TransactionDistributionChart";

type ModuleType = "merchant" | "transaction" | "organization";
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

function generateTransactionSummary(period: PeriodType): SummaryItem[] {
  // --- 交易规模 ---
  const txAmount = transactionInsightData["交易金额"][period];
  const txCount = transactionInsightData["交易笔数"][period];
  const txAvg = transactionInsightData["笔均金额"][period];
  const amtDir = txAmount.rate > 0 ? "增长" : "下降";
  const cntDir = txCount.rate > 0 ? "增长" : "下降";
  const avgDir = txAvg.rate > 0 ? "提升" : "下降";
  const scaleSummary = `${period === "昨日" ? "昨日" : period}交易金额${txAmount.value}元，环比${amtDir}${Math.abs(txAmount.rate).toFixed(1)}%；交易笔数${txCount.value}笔，环比${cntDir}${Math.abs(txCount.rate).toFixed(1)}%；笔均金额${txAvg.value}元，环比${avgDir}${Math.abs(txAvg.rate).toFixed(1)}%，整体交易稳步增长，活跃度与客单价同步提升。`;

  // --- 通道成本 ---
  const costTotal = channelCostData["总计"][period];
  const costInterchange = channelCostData["交换费"][period];
  const costClearing = channelCostData["清算费"][period];
  const rates = channelCostRates[period];
  const costDir = costTotal.rate > 0 ? "增长" : "下降";
  const costSummary = `通道总成本${costTotal.value}万元，其中交换费${costInterchange.value}万元（费率${rates.interchangeRate}%），清算费${costClearing.value}万元（费率${rates.clearingRate}%），环比${costDir}${Math.abs(costTotal.rate).toFixed(1)}%；成本结构合理。`;

  // --- 行业结构 ---
  const indTotal = industryBase.reduce((s, d) => s + d.value, 0);
  const sorted = [...industryBase].sort((a, b) => b.value - a.value);
  const top1 = sorted[0], top2 = sorted[1], top3 = sorted[2], top4 = sorted[3];
  const top1Pct = ((top1.value / indTotal) * 100).toFixed(0);
  const top2Pct = ((top2.value / indTotal) * 100).toFixed(0);
  const top12Pct = (((top1.value + top2.value) / indTotal) * 100).toFixed(0);
  const top3Pct = ((top3.value / indTotal) * 100).toFixed(0);
  const top4Pct = ((top4.value / indTotal) * 100).toFixed(0);
  const industrySummary = `${top1.name}（${top1Pct}%）、${top2.name}（${top2Pct}%）合计贡献${top12Pct}%的交易额；${top3.name}、${top4.name}占比分别为${top3Pct}%和${top4Pct}%，行业结构稳定，仍以${top1.name}${top2.name}为主力。`;

  // --- 卡种偏好 ---
  const cardTotal = cardTypeBase.reduce((s, d) => s + d.value, 0);
  const cardSorted = [...cardTypeBase].sort((a, b) => b.value - a.value);
  const cardParts = cardSorted.map(c => `${c.name}${((c.value / cardTotal) * 100).toFixed(0)}%`);
  const debit = cardTypeBase.find(c => c.name === "借记卡")!;
  const credit = cardTypeBase.find(c => c.name === "贷记卡")!;
  const loanRatio = (credit.value / debit.value).toFixed(1);
  const cardSummary = `${cardParts[0].replace(/(\d+%)/, "占比$1")}居首位，${cardParts.slice(1).join("、")}，支付方式呈现移动支付与信用消费主导；借贷比（贷记卡/借记卡）为${loanRatio}。`;

  // --- 产品分布 ---
  const prodTotal = productBase.reduce((s, d) => s + d.value, 0);
  const prodSorted = [...productBase].sort((a, b) => b.value - a.value);
  const prodParts = prodSorted.map(p => `${p.name}${((p.value / prodTotal) * 100).toFixed(0)}%`);
  const productSummary = `${prodParts.join("、")}，产品体系集中，基础产品仍为核心。`;

  return [
    { title: "交易规模", content: scaleSummary },
    { title: "通道成本", content: costSummary },
    { title: "行业结构", content: industrySummary },
    { title: "卡种偏好", content: cardSummary },
    { title: "产品分布", content: productSummary },
  ];
}

const organizationSummaryByPeriod: Record<PeriodType, SummaryItem[]> = {
  "昨日": [
    { title: "服务商/盟友动态", content: "进件波动超200%的服务商3家，交易额波动超200%的2家，需重点关注异常波动机构。" },
    { title: "合作方行为", content: "新入网合作方4家，环比增长15%；首次进件3家，环比增长10%；活跃合作方80家，环比下降2%。" },
    { title: "分布特征", content: "交易分布中，活跃商户1-5户的服务商占比45%，6-20户占比30%，头部集中度偏高。" },
  ],
  "近7日": [
    { title: "服务商/盟友动态", content: "进件波动超200%的服务商15家，交易额波动超200%的12家，需重点关注异常波动机构。" },
    { title: "合作方行为", content: "新入网合作方25家，环比增长30%；首次进件18家，环比增长25%；活跃合作方85家，环比下降5%。" },
    { title: "分布特征", content: "交易分布中，活跃商户1-5户的服务商占比45%，6-20户占比30%，头部集中度偏高。" },
  ],
  "近30日": [
    { title: "服务商/盟友动态", content: "进件波动超200%的服务商28家，交易额波动超200%的22家，需重点关注异常波动机构。" },
    { title: "合作方行为", content: "新入网合作方65家，环比增长25%；首次进件48家，环比增长20%；活跃合作方92家，环比下降3%。" },
    { title: "分布特征", content: "交易分布中，活跃商户1-5户的服务商占比45%，6-20户占比30%，头部集中度偏高。" },
  ],
  "近90日": [
    { title: "服务商/盟友动态", content: "进件波动超200%的服务商42家，交易额波动超200%的35家，需重点关注异常波动机构。" },
    { title: "合作方行为", content: "新入网合作方180家，环比增长20%；首次进件130家，环比增长15%；活跃合作方98家，环比下降4%。" },
    { title: "分布特征", content: "交易分布中，活跃商户1-5户的服务商占比45%，6-20户占比30%，头部集中度偏高。" },
  ],
};

const summaryByPeriodMap: Record<ModuleType, Record<PeriodType, SummaryItem[]> | null> = {
  merchant: merchantSummaryByPeriod,
  transaction: null, // generated dynamically
  organization: organizationSummaryByPeriod,
};

const periods: PeriodType[] = ["昨日", "近7日", "近30日", "近90日"];

interface Props {
  module: ModuleType;
  period: PeriodType;
  onPeriodChange: (p: PeriodType) => void;
}

const CoreDataSummary = ({ module, period, onPeriodChange }: Props) => {
  const items = module === "transaction"
    ? generateTransactionSummary(period)
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
