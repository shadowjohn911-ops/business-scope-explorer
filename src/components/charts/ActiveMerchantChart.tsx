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
  Legend,
} from "recharts";

type Dimension = "survival" | "industry";

// Generate normal distribution with right-tail truncation for survival days
const survivalDays = [1, 14, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360, 390, 420, 450, 480, 510, 540, 570, 600, 630, 660, 690, 720, 750, 780];
const mean = 120;
const stdDev = 150;
const survivalData = survivalDays.map((day) => {
  const z = (day - mean) / stdDev;
  const density = Math.exp(-0.5 * z * z) / (stdDev * Math.sqrt(2 * Math.PI));
  const count = Math.max(1, Math.round(density * 50000));
  return { day: `${day}天`, count };
});

// Industry donut data
const COLORS = [
  "hsl(215, 90%, 50%)",
  "hsl(160, 65%, 45%)",
  "hsl(30, 90%, 55%)",
  "hsl(340, 70%, 55%)",
  "hsl(260, 60%, 55%)",
  "hsl(180, 50%, 45%)",
  "hsl(45, 80%, 50%)",
  "hsl(200, 70%, 50%)",
];

const industryData = [
  { name: "餐饮", value: 2850, percent: "28.5%" },
  { name: "零售", value: 2130, percent: "21.3%" },
  { name: "生活服务", value: 1560, percent: "15.6%" },
  { name: "教育培训", value: 980, percent: "9.8%" },
  { name: "医疗健康", value: 750, percent: "7.5%" },
  { name: "美容美发", value: 620, percent: "6.2%" },
  { name: "住宿", value: 510, percent: "5.1%" },
  { name: "其它", value: 600, percent: "6.0%" },
];

const ActiveMerchantChart = () => {
  const [dimension, setDimension] = useState<Dimension>("survival");

  return (
    <Card className="border-border">
      <CardHeader className="px-3 py-2.5 pb-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs font-semibold text-foreground">日活跃商户分布</CardTitle>
          <div className="flex bg-muted rounded-md p-0.5">
            <button
              onClick={() => setDimension("survival")}
              className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                dimension === "survival"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground"
              }`}
            >
              存活天数
            </button>
            <button
              onClick={() => setDimension("industry")}
              className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                dimension === "industry"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground"
              }`}
            >
              行业
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-3 py-2.5 pt-1">
        {dimension === "survival" ? (
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={survivalData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 90%)" />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 9, fill: "hsl(215, 12%, 55%)" }}
                  interval={3}
                  axisLine={{ stroke: "hsl(214, 20%, 90%)" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 9, fill: "hsl(215, 12%, 55%)" }}
                  axisLine={false}
                  tickLine={false}
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
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={industryData}
                  cx="50%"
                  cy="45%"
                  innerRadius={40}
                  outerRadius={65}
                  dataKey="value"
                  stroke="none"
                >
                  {industryData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    fontSize: 11,
                    borderRadius: 8,
                    border: "1px solid hsl(214, 20%, 90%)",
                  }}
                  formatter={(value: number, name: string) => [`${value}户`, name]}
                />
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  wrapperStyle={{ fontSize: 10, paddingTop: 4 }}
                  formatter={(value: string, entry: any) => {
                    const item = industryData.find((d) => d.name === value);
                    return `${value} ${item?.percent || ""}`;
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
