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
  "hsl(200, 70%, 50%)",
];

const total = 10000;
const industryData = [
  { name: "餐饮", value: 2850 },
  { name: "零售", value: 2130 },
  { name: "生活服务", value: 1560 },
  { name: "教育培训", value: 980 },
  { name: "医疗健康", value: 750 },
  { name: "美容美发", value: 620 },
  { name: "住宿", value: 510 },
  { name: "其它", value: 600 },
].map((d) => ({ ...d, percent: ((d.value / total) * 100).toFixed(1) + "%" }));

const RADIAN = Math.PI / 180;

const renderCustomLabel = ({
  cx, cy, midAngle, outerRadius, name, value, percent,
}: any) => {
  const radius = outerRadius + 18;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  const ex = cx + (outerRadius + 8) * Math.cos(-midAngle * RADIAN);
  const ey = cy + (outerRadius + 8) * Math.sin(-midAngle * RADIAN);

  return (
    <g>
      <line x1={ex} y1={ey} x2={x} y2={y} stroke="hsl(215, 12%, 70%)" strokeWidth={0.5} />
      <text
        x={x}
        y={y}
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={8}
        fill="hsl(215, 12%, 40%)"
      >
        {name} {value}户 {percent}
      </text>
    </g>
  );
};

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
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={industryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={55}
                  dataKey="value"
                  stroke="none"
                  label={renderCustomLabel}
                  labelLine={false}
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
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActiveMerchantChart;
