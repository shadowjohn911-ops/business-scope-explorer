import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

type Dimension = "survival" | "industry";

const survivalDays = [1, 14, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360, 390, 420, 450, 480, 510, 540, 570, 600, 630, 660, 690, 720, 750, 780];
const mean = 120;
const stdDev = 150;
const survivalData = survivalDays.map((day) => {
  const z = (day - mean) / stdDev;
  const density = Math.exp(-0.5 * z * z) / (stdDev * Math.sqrt(2 * Math.PI));
  const count = Math.max(1, Math.round(density * 50000));
  return { day: `${day}`, count };
});

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

const rawIndustryData = [
  { name: "餐饮", value: 2850 },
  { name: "零售", value: 2130 },
  { name: "生活服务", value: 1560 },
  { name: "教育培训", value: 980 },
  { name: "医疗健康", value: 750 },
  { name: "美容美发", value: 620 },
  { name: "住宿", value: 510 },
  { name: "汽车服务", value: 300 },
  { name: "文体娱乐", value: 200 },
  { name: "家政服务", value: 100 },
];

const total = rawIndustryData.reduce((s, d) => s + d.value, 0);
// Sort descending, take top items until cumulative >= 90%
const sorted = [...rawIndustryData].sort((a, b) => b.value - a.value);
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
const industryData = [
  ...topItems.map((d) => ({ ...d, percent: ((d.value / total) * 100).toFixed(1) + "%" })),
  ...(otherValue > 0 ? [{ name: "其它", value: otherValue, percent: ((otherValue / total) * 100).toFixed(1) + "%" }] : []),
];

const RADIAN = Math.PI / 180;

const renderInnerLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, name }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize={8} fill="white" fontWeight={500}>
      {name}
    </text>
  );
};

const ActiveMerchantChart = () => {
  const [dimension, setDimension] = useState<Dimension>("survival");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <Card className="border-border">
      <CardHeader className="px-3 py-2.5 pb-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs font-semibold text-foreground">日活跃商户分布</CardTitle>
          <div className="flex bg-muted rounded-md p-0.5">
            <button
              onClick={() => setDimension("survival")}
              className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                dimension === "survival" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              存活天数
            </button>
            <button
              onClick={() => setDimension("industry")}
              className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                dimension === "industry" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              行业
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-3 py-2.5 pt-1">
        {dimension === "survival" ? (
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={survivalData} margin={{ top: 10, right: 10, left: 5, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 90%)" />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 9, fill: "hsl(215, 12%, 55%)" }}
                  interval={3}
                  axisLine={{ stroke: "hsl(214, 20%, 90%)" }}
                  tickLine={false}
                  label={{ value: "首次交易距今间隔（天）", position: "bottom", offset: 10, fontSize: 9, fill: "hsl(215, 12%, 55%)" }}
                />
                <YAxis
                  tick={{ fontSize: 9, fill: "hsl(215, 12%, 55%)" }}
                  axisLine={false}
                  tickLine={false}
                  label={{ value: "交易商户数（户）", angle: -90, position: "insideLeft", offset: 10, fontSize: 9, fill: "hsl(215, 12%, 55%)", dy: 30 }}
                />
                <Tooltip
                  contentStyle={{
                    fontSize: 11,
                    borderRadius: 8,
                    border: "1px solid hsl(214, 20%, 90%)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  }}
                  formatter={(value: number) => [`${value}户`, "商户数"]}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="hsl(215, 90%, 50%)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 3, strokeWidth: 1 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-56 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={industryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  dataKey="value"
                  stroke="none"
                  label={renderInnerLabel}
                  labelLine={false}
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  {industryData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={entry.name === "其它" ? OTHER_COLOR : COLORS[index % COLORS.length]}
                      opacity={activeIndex === null || activeIndex === index ? 1 : 0.5}
                      style={{ cursor: "pointer", transition: "opacity 0.2s" }}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    fontSize: 11,
                    borderRadius: 8,
                    border: "1px solid hsl(214, 20%, 90%)",
                  }}
                  formatter={(value: number, name: string) => {
                    const pct = ((value / total) * 100).toFixed(1);
                    return [`${value}户 (${pct}%)`, name];
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActiveMerchantChart;
