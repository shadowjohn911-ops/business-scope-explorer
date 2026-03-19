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

// Custom survival curve: starts at 25, peaks at 120→133, 690→15, 750+→25
const survivalKeyPoints: [number, number][] = [
  [1, 25], [14, 35], [30, 55], [60, 95], [90, 120], [120, 133],
  [150, 125], [180, 110], [210, 95], [240, 82], [270, 70], [300, 60],
  [330, 52], [360, 45], [390, 39], [420, 34], [450, 30], [480, 27],
  [510, 24], [540, 21], [570, 19], [600, 17], [630, 16], [660, 15],
  [690, 15], [720, 18], [750, 25],
];

const survivalData = survivalKeyPoints.map(([day, count], i) => ({
  day: i === survivalKeyPoints.length - 1 ? "750+" : `${day}`,
  count,
}));

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
  { name: "餐饮", value: 3200 },
  { name: "零售", value: 2800 },
  { name: "生活服务", value: 1200 },
  { name: "教育培训", value: 800 },
  { name: "医疗健康", value: 600 },
  { name: "美容美发", value: 500 },
  { name: "住宿", value: 400 },
  { name: "汽车服务", value: 250 },
  { name: "文体娱乐", value: 150 },
  { name: "家政服务", value: 100 },
];

const total = rawIndustryData.reduce((s, d) => s + d.value, 0);
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

// Inner label: show percentage as value/total
const renderInnerLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value }: any) => {
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

// Outer label with leader line: industry name + count
const renderOuterLabel = ({ cx, cy, midAngle, outerRadius, name, value }: any) => {
  const sin = Math.sin(-midAngle * RADIAN);
  const cos = Math.cos(-midAngle * RADIAN);
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
        {value}户
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
          <div className="h-64 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={industryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={38}
                  outerRadius={62}
                  dataKey="value"
                  stroke="none"
                  label={renderOuterLabel}
                  labelLine={false}
                >
                  {industryData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={entry.name === "其它" ? OTHER_COLOR : COLORS[index % COLORS.length]}
                      style={{ cursor: "pointer" }}
                    />
                  ))}
                </Pie>
                {/* Inner percentage labels rendered as a second Pie layer */}
                <Pie
                  data={industryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={38}
                  outerRadius={62}
                  dataKey="value"
                  stroke="none"
                  label={renderInnerLabel}
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
