import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

type ModuleType = "merchant" | "transaction" | "organization";

interface SummaryItem {
  title: string;
  content: string;
}

const merchantSummary: SummaryItem[] = [
  {
    title: "入网与首刷",
    content:
      "近7日入网商户130家，环比增长60%；首刷50家，环比下降60%；首刷率38.5%，新商户交易转化率偏低。",
  },
  {
    title: "交易活跃度",
    content:
      "近7日有交易行为的商户730家，环比下降10%，存量商户活跃度下滑。",
  },
  {
    title: "商户特征",
    content:
      "商户存活天数中位数130天，80%商户集中在30天至200天之间；行业分布以餐饮、零售为主，合计占比60%。",
  },
  {
    title: "交易额波动",
    content:
      "近7日交易额增长超300%的商户30户，波动±50%以内的700户，无交易60户，需关注极端高增长商户的潜力挖掘与无交易商户的流失风险。",
  },
];

const transactionSummary: SummaryItem[] = [
  {
    title: "交易规模",
    content:
      "近7日交易金额850万元，环比增长12%；交易笔数1.2万笔，环比增长8%；笔均金额708元，保持稳定。",
  },
  {
    title: "成本结构",
    content:
      "近7日通道成本合计4.2万元，交换费占比72%，清算费占比28%，整体成本率0.49%，环比持平。",
  },
  {
    title: "交易分布",
    content:
      "行业维度：餐饮、零售合计占交易额65%；卡种维度：借记卡交易占比55%，贷记卡35%，扫码10%。",
  },
];

const organizationSummary: SummaryItem[] = [
  {
    title: "服务商/盟友动态",
    content:
      "近7日进件波动超200%的服务商15家，交易额波动超200%的12家，需重点关注异常波动机构。",
  },
  {
    title: "合作方行为",
    content:
      "近7日新入网合作方25家，环比增长30%；首次进件18家，活跃合作方85家，环比下降5%。",
  },
  {
    title: "分布特征",
    content:
      "30天交易分布中，活跃商户1-5户的服务商占比45%，6-20户占比30%，头部集中度偏高。",
  },
];

const summaryMap: Record<ModuleType, SummaryItem[]> = {
  merchant: merchantSummary,
  transaction: transactionSummary,
  organization: organizationSummary,
};


interface Props {
  module: ModuleType;
}

const CoreDataSummary = ({ module }: Props) => {
  const items = summaryMap[module];

  return (
    <Card className="border-border">
      <CardHeader className="px-3 py-2.5 pb-0">
        <CardTitle className="text-xs font-semibold text-foreground">核心数据摘要</CardTitle>
      </CardHeader>
      <CardContent className="px-3 py-2.5">
        <div className="space-y-2.5">
          {items.map((item, idx) => (
            <div key={idx} className="flex gap-2">
              {getIndicator(item.content)}
              <div className="min-w-0">
                <span className="text-[11px] font-semibold text-foreground">{item.title}：</span>
                <span className="text-[11px] text-muted-foreground leading-relaxed">{item.content}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CoreDataSummary;
