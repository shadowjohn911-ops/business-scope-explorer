import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { HelpCircle } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

type Dimension = "merchantScale" | "transactionScale";

const COLORS = [
  "hsl(215, 90%, 50%)",
  "hsl(160, 65%, 45%)",
  "hsl(30, 90%, 55%)",
  "hsl(340, 70%, 55%)",
  "hsl(260, 60%, 55%)",
  "hsl(180, 50%, 45%)",
  "hsl(45, 80%, 50%)",
  "hsl(0, 70%, 55%)",
  "hsl(280, 50%, 50%)",
];

export const partnerMerchantScaleData = [
  { name: "1户", value: 80 },
  { name: "2-5户", value: 220 },
  { name: "6-20户", value: 310 },
  { name: "21-50户", value: 180 },
  { name: "51-100户", value: 120 },
  { name: "101-500户", value: 75 },
  { name: "500户以上", value: 30 },
];

export const partnerTransactionScaleData = [
  { name: "500以下", value: 65 },
  { name: "500-2k", value: 140 },
  { name: "2k-5k", value: 230 },
  { name: "5k-1w", value: 190 },
  { name: "1w-2w", value: 150 },
  { name: "2w-5w", value: 110 },
  { name: "5w-10w", value: 70 },
  { name: "10w-50w", value: 40 },
  { name: "50w以上", value: 15 },
];

const RADIAN = Math.PI / 180;

const PartnerDistributionChart = () => {
  const [dimension, setDimension] = useState<Dimension>("merchantScale");

  const { data, total } = useMemo(() => {
    const raw = dimension === "merchantScale" ? partnerMerchantScaleData : partnerTransactionScaleData;
    const t = raw.reduce((s, d) => s + d.value, 0);
    return { data: raw, total: t };
  }, [dimension]);

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
          {value}个
        </text>
      </g>
    );
  };

  return (
    <Card className="border-border">
      <CardHeader className="px-3 py-2.5 pb-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs font-semibold text-foreground">30天交易合作方分布</CardTitle>
          <div className="flex items-center gap-1.5">
            <div className="flex bg-muted rounded-md p-0.5">
              <button
                onClick={() => setDimension("merchantScale")}
                className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                  dimension === "merchantScale" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                }`}
              >
                数量规模
              </button>
              <button
                onClick={() => setDimension("transactionScale")}
                className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                  dimension === "transactionScale" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                }`}
              >
                交易规模
              </button>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <button className="p-0.5 rounded-full hover:bg-muted transition-colors">
                  <HelpCircle className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80 text-[11px] leading-relaxed text-foreground" side="left" align="start">
                图中每个扇区代表一个区间，数值表示该区间内的合作方数量，百分比表示该区间合作方占所有近30天有活跃商户的合作方总数的比例。
                <br /><br />
                <span className="text-muted-foreground">
                  示例：区间"6-20户"的数值为400，占比10%，意味着有400个合作方近30天内的活跃商户数量在6至20户之间，占所有近30天有活跃商户的合作方总数的10%。
                </span>
              </PopoverContent>
            </Popover>
          </div>
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
                {data.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
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
                  return [`${value}个 (${pct}%)`, name];
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PartnerDistributionChart;
