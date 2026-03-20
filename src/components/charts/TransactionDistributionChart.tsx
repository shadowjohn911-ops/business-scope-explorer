import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

type PeriodType = "昨日" | "近7日" | "近30日" | "近90日";
const periodsOptions: PeriodType[] = ["昨日", "近7日", "近30日", "近90日"];
type DimensionType = "industry" | "cardType" | "product";

const COLORS = [
  "hsl(215, 90%, 50%)",
  "hsl(160, 65%, 45%)",
  "hsl(30, 90%, 55%)",
  "hsl(340, 70%, 55%)",
  "hsl(260, 60%, 55%)",
  "hsl(180, 50%, 45%)",
  "hsl(45, 80%, 50%)",
];
const OTHER_COLOR = "hsl(0, 0%, 20%)";
const RADIAN = Math.PI / 180;

// Multipliers to match unified transaction totals:
// 昨日:120万 近7日:850万 近30日:3200万 近90日:9500万
// Base data sums to ~3200 (matching 近30日)
const periodMultipliers: Record<string, number> = {
  "昨日": 0.0375,
  "近7日": 0.2656,
  "近30日": 1,
  "近90日": 2.969,
};

// Sum = 3203 ≈ 3200万 (近30日 base)
export const industryBase = [
  { name: "餐饮", value: 903 },
  { name: "零售", value: 705 },
  { name: "生活服务", value: 508 },
  { name: "教育培训", value: 310 },
  { name: "医疗健康", value: 240 },
  { name: "美容美发", value: 192 },
  { name: "住宿", value: 147 },
  { name: "汽车服务", value: 99 },
  { name: "文体娱乐", value: 62 },
  { name: "家政服务", value: 37 },
];

// Sum = 3201 ≈ 3200万
export const cardTypeBase = [
  { name: "借记卡", value: 640 },
  { name: "贷记卡", value: 960 },
  { name: "扫码", value: 1440 },
  { name: "外卡", value: 161 },
];

// Sum = 3201 ≈ 3200万
export const productBase = [
  { name: "收款码", value: 1057 },
  { name: "POS", value: 936 },
  { name: "扫码盒", value: 664 },
  { name: "智能POS", value: 544 },
];

// Add slight per-item variance based on period to avoid identical ratios
export const applyPeriod = (raw: { name: string; value: number }[], period: string) => {
  const mult = periodMultipliers[period] ?? 1;
  return raw.map((item, i) => ({
    ...item,
    value: Math.round(item.value * mult * (1 + (i % 3 === 0 ? 0.08 : i % 3 === 1 ? -0.05 : 0.02) * (period === "近30日" ? 0 : 1))),
  }));
};

const processData = (raw: { name: string; value: number }[], groupOther: boolean) => {
  const total = raw.reduce((s, d) => s + d.value, 0);
  if (!groupOther) {
    const data = raw.map((d) => ({ ...d, percent: ((d.value / total) * 100).toFixed(1) + "%" }));
    return { data, total };
  }
  const sorted = [...raw].sort((a, b) => b.value - a.value);
  let cumulative = 0;
  const threshold = total * 0.9;
  const topItems: typeof sorted = [];
  const otherItems: typeof sorted = [];
  sorted.forEach((item) => {
    if (cumulative < threshold) {
      topItems.push(item);
      cumulative += item.value;
    } else {
      otherItems.push(item);
    }
  });
  const otherValue = otherItems.reduce((s, d) => s + d.value, 0);
  const data = [
    ...topItems.map((d) => ({ ...d, percent: ((d.value / total) * 100).toFixed(1) + "%" })),
    ...(otherValue > 0 ? [{ name: "其它", value: otherValue, percent: ((otherValue / total) * 100).toFixed(1) + "%" }] : []),
  ];
  return { data, total };
};

const dimensionLabels: Record<DimensionType, string> = {
  industry: "行业",
  cardType: "卡种",
  product: "产品",
};

const renderInnerLabel = (total: number) => ({ cx, cy, midAngle, innerRadius, outerRadius, value }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  const pct = ((value / total) * 100).toFixed(1);
  return (
    <text x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize={7} fill="white" fontWeight={600}>
      {pct}%
    </text>
  );
};

const renderOuterLabel = ({ cx, cy, midAngle, outerRadius, name, value }: any) => {
  const cos = Math.cos(-midAngle * RADIAN);
  const sin = Math.sin(-midAngle * RADIAN);
  const ex = cx + (outerRadius + 12) * cos;
  const ey = cy + (outerRadius + 12) * sin;
  const ex2 = cx + (outerRadius + 28) * cos;
  const ey2 = cy + (outerRadius + 28) * sin;
  const textAnchor = cos >= 0 ? "start" : "end";
  const ex3 = ex2 + (cos >= 0 ? 4 : -4);

  return (
    <g>
      <path
        d={`M${cx + outerRadius * cos},${cy + outerRadius * sin}L${ex},${ey}L${ex2},${ey2}`}
        stroke="hsl(215, 12%, 65%)"
        fill="none"
        strokeWidth={0.8}
      />
      <circle cx={cx + outerRadius * cos} cy={cy + outerRadius * sin} r={1.5} fill="hsl(215, 12%, 65%)" />
      <text x={ex3} y={ey2 - 4} textAnchor={textAnchor} fontSize={7} fill="hsl(215, 12%, 35%)" fontWeight={500}>
        {name}
      </text>
      <text x={ex3} y={ey2 + 5} textAnchor={textAnchor} fontSize={7} fill="hsl(215, 12%, 55%)">
        {value}万元
      </text>
    </g>
  );
};

interface Props {
  selectedCardTypes: string[];
  selectedProducts: string[];
  period: PeriodType;
  onPeriodChange: (p: PeriodType) => void;
}

const TransactionDistributionChart = ({ selectedCardTypes, selectedProducts, period, onPeriodChange }: Props) => {
  const [dimension, setDimension] = useState<DimensionType>("industry");

  const { data, total } = useMemo(() => {
    let baseData: { name: string; value: number }[];
    let groupOther = true;

    if (dimension === "industry") {
      baseData = industryBase;
      groupOther = true;
    } else if (dimension === "cardType") {
      baseData = selectedCardTypes.length > 0
        ? cardTypeBase.filter((d) => selectedCardTypes.includes(d.name))
        : cardTypeBase;
      groupOther = false;
    } else {
      baseData = selectedProducts.length > 0
        ? productBase.filter((d) => selectedProducts.includes(d.name))
        : productBase;
      groupOther = true;
    }

    const periodAdjusted = applyPeriod(baseData, period);
    return processData(periodAdjusted, groupOther);
  }, [dimension, period, selectedCardTypes, selectedProducts]);

  return (
    <Card className="border-border">
      <CardHeader className="px-3 py-2.5 pb-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs font-semibold text-foreground">交易额分布</CardTitle>
          <div className="flex bg-muted rounded-md p-0.5">
            {periodsOptions.map((p) => (
              <button
                key={p}
                onClick={() => onPeriodChange(p)}
                className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                  period === p ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <div className="flex bg-muted rounded-md p-0.5 mt-2 self-start">
          {(Object.keys(dimensionLabels) as DimensionType[]).map((d) => (
            <button
              key={d}
              onClick={() => setDimension(d)}
              className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                dimension === d ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              {dimensionLabels[d]}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="px-3 py-2.5 pt-1">
        <div className="h-64 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={38}
                outerRadius={62}
                dataKey="value"
                stroke="none"
                label={renderOuterLabel}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.name === "其它" ? OTHER_COLOR : COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={38}
                outerRadius={62}
                dataKey="value"
                stroke="none"
                label={renderInnerLabel(total)}
                labelLine={false}
                isAnimationActive={false}
                fill="transparent"
              />
              <Tooltip
                contentStyle={{
                  fontSize: 11,
                  borderRadius: 8,
                  border: "1px solid hsl(214, 20%, 90%)",
                }}
                formatter={(value: number, name: string) => {
                  const pct = ((value / total) * 100).toFixed(1);
                  return [`${value}万元 (${pct}%)`, name];
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionDistributionChart;
