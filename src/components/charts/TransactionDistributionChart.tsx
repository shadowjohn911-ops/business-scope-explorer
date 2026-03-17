import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

const periodsOptions = ["1天", "7天", "30天", "90天"] as const;
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

const industryRaw = [
  { name: "餐饮", value: 3200 },
  { name: "零售", value: 2500 },
  { name: "生活服务", value: 1800 },
  { name: "教育培训", value: 1100 },
  { name: "医疗健康", value: 850 },
  { name: "美容美发", value: 680 },
  { name: "住宿", value: 520 },
  { name: "汽车服务", value: 350 },
  { name: "文体娱乐", value: 220 },
  { name: "家政服务", value: 130 },
];

const cardTypeRaw = [
  { name: "借记卡", value: 4200 },
  { name: "贷记卡", value: 3800 },
  { name: "扫码", value: 2600 },
  { name: "外卡", value: 450 },
];

const productRaw = [
  { name: "收款码", value: 3500 },
  { name: "POS", value: 3100 },
  { name: "扫码盒", value: 2200 },
  { name: "智能POS", value: 1800 },
];

const processData = (raw: { name: string; value: number }[]) => {
  const total = raw.reduce((s, d) => s + d.value, 0);
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

const dimensionDataMap: Record<DimensionType, { name: string; value: number }[]> = {
  industry: industryRaw,
  cardType: cardTypeRaw,
  product: productRaw,
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

const TransactionDistributionChart = () => {
  const [period, setPeriod] = useState<string>("30天");
  const [dimension, setDimension] = useState<DimensionType>("industry");

  const { data, total } = processData(dimensionDataMap[dimension]);

  return (
    <Card className="border-border">
      <CardHeader className="px-3 py-2.5 pb-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs font-semibold text-foreground">交易额分布</CardTitle>
          <div className="flex bg-muted rounded-md p-0.5">
            {periodsOptions.map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
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
