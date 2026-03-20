import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

const transactionSummaryByPeriod: Record<PeriodType, SummaryItem[]> = {
  "昨日": [
    { title: "交易规模", content: "昨日交易金额120万元，环比增长5.0%；交易笔数8000笔，环比增长3.0%；笔均金额150元，环比提升2.0%，整体交易稳步增长，活跃度与客单价同步提升。" },
    { title: "通道成本", content: "通道总成本0.342万元（3420元），其中交换费0.30万元（费率0.25%），清算费0.042万元（费率0.035%），环比增长4.0%；成本结构合理。" },
    { title: "行业结构", content: "餐饮、零售合计贡献50%的交易额；生活服务、教育培训占比分别为16%和10%，行业结构稳定，仍以餐饮零售为主力。" },
    { title: "卡种偏好", content: "扫码支付占比45%居首位，贷记卡、借记卡分别占30%和20%，支付方式呈现移动支付与信用消费主导；借贷比（贷记卡/借记卡）为1.5。" },
    { title: "产品分布", content: "标准产品交易额占比72%，优惠产品、定制产品分别占20%和8%，产品体系集中，基础产品仍为核心。" },
  ],
  "近7日": [
    { title: "交易规模", content: "近7日交易金额850万元，环比增长8.0%；交易笔数5.6万笔，环比增长6.0%；笔均金额152元，环比提升3.0%，整体交易稳步增长，活跃度与客单价同步提升。" },
    { title: "通道成本", content: "通道总成本3.08万元，其中交换费2.72万元（费率0.32%），清算费0.357万元（费率0.042%），环比增长6.0%；成本结构合理。" },
    { title: "行业结构", content: "餐饮、零售合计贡献50%的交易额；生活服务、教育培训占比分别为16%和10%，行业结构稳定，仍以餐饮零售为主力。" },
    { title: "卡种偏好", content: "扫码支付占比45%居首位，贷记卡、借记卡分别占30%和20%，支付方式呈现移动支付与信用消费主导；借贷比（贷记卡/借记卡）为1.5。" },
    { title: "产品分布", content: "标准产品交易额占比72%，优惠产品、定制产品分别占20%和8%，产品体系集中，基础产品仍为核心。" },
  ],
  "近30日": [
    { title: "交易规模", content: "近30日交易金额3200万元，环比增长12.0%；交易笔数21.3万笔，环比增长9.0%；笔均金额150元，环比提升2.0%，整体交易稳步增长，活跃度与客单价同步提升。" },
    { title: "通道成本", content: "通道总成本1.41万元，环比增长5.0%；通道成本率0.044%（万分之四点四），成本控制良好，效率略有优化。" },
    { title: "行业结构", content: "餐饮、零售合计贡献50%的交易额；生活服务、教育培训占比分别为16%和10%，行业结构稳定，仍以餐饮零售为主力。" },
    { title: "卡种偏好", content: "扫码支付占比45%居首位，贷记卡、借记卡分别占30%和20%，支付方式呈现移动支付与信用消费主导；借贷比（贷记卡/借记卡）为1.5。" },
    { title: "产品分布", content: "标准产品交易额占比72%，优惠产品、定制产品分别占20%和8%，产品体系集中，基础产品仍为核心。" },
  ],
  "近90日": [
    { title: "交易规模", content: "近90日交易金额9500万元，环比增长15.0%；交易笔数63.3万笔，环比增长11.0%；笔均金额150元，环比提升3.0%，整体交易稳步增长，活跃度与客单价同步提升。" },
    { title: "通道成本", content: "通道总成本3.99万元，环比增长6.0%；通道成本率0.042%（万分之四点二），成本控制良好，效率略有优化。" },
    { title: "行业结构", content: "餐饮、零售合计贡献50%的交易额；生活服务、教育培训占比分别为16%和10%，行业结构稳定，仍以餐饮零售为主力。" },
    { title: "卡种偏好", content: "扫码支付占比45%居首位，贷记卡、借记卡分别占30%和20%，支付方式呈现移动支付与信用消费主导；借贷比（贷记卡/借记卡）为1.5。" },
    { title: "产品分布", content: "标准产品交易额占比72%，优惠产品、定制产品分别占20%和8%，产品体系集中，基础产品仍为核心。" },
  ],
};

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

const summaryByPeriodMap: Record<ModuleType, Record<PeriodType, SummaryItem[]>> = {
  merchant: merchantSummaryByPeriod,
  transaction: transactionSummaryByPeriod,
  organization: organizationSummaryByPeriod,
};

const periods: PeriodType[] = ["昨日", "近7日", "近30日", "近90日"];

interface Props {
  module: ModuleType;
  period: PeriodType;
  onPeriodChange: (p: PeriodType) => void;
}

const CoreDataSummary = ({ module, period, onPeriodChange }: Props) => {
  const items = summaryByPeriodMap[module][period];

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
