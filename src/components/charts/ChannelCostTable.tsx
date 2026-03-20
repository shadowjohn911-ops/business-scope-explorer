import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { HelpCircle } from "lucide-react";

const periods = ["昨日", "近7日", "近30日", "近90日"] as const;
const allCostTypes = ["交换费", "清算费", "总计"] as const;

// Channel cost at 0.04%-0.05% of transaction volume
// 昨日:120万 近7日:850万 近30日:3200万 近90日:9500万
// 交换费~65%, 清算费~35%
const mockData: Record<string, Record<string, { value: string; rate: number }>> = {
  "交换费": {
    "昨日": { value: "0.035", rate: 3 },
    "近7日": { value: "0.25", rate: 5 },
    "近30日": { value: "0.92", rate: 4 },
    "近90日": { value: "2.59", rate: 6 },
  },
  "清算费": {
    "昨日": { value: "0.019", rate: 5 },
    "近7日": { value: "0.14", rate: 8 },
    "近30日": { value: "0.49", rate: 6 },
    "近90日": { value: "1.40", rate: 7 },
  },
  "总计": {
    "昨日": { value: "0.054", rate: 4 },
    "近7日": { value: "0.39", rate: 6 },
    "近30日": { value: "1.41", rate: 5 },
    "近90日": { value: "3.99", rate: 6 },
  },
};

const ChannelCostTable = () => {
  return (
    <Card className="border-border">
      <CardHeader className="px-3 py-2.5 pb-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs font-semibold text-foreground">通道成本（万元）</CardTitle>
          <Popover>
            <PopoverTrigger asChild>
              <button className="p-0.5 rounded-full hover:bg-muted transition-colors">
                <HelpCircle className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-72 text-[11px] leading-relaxed text-foreground" side="left" align="start">
              表格中的数值表示在指定回溯周期内各类通道成本的统计值（单位：万元），通道成本率约为万分之四到万分之五；百分比表示当前周期相较于上一周期的环比变化率。
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>
      <CardContent className="px-3 py-2.5">
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-border">
                <th className="relative w-16 h-10 p-0 overflow-hidden">
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 64 40" preserveAspectRatio="none">
                    <line x1="0" y1="0" x2="64" y2="40" stroke="hsl(var(--border))" strokeWidth="1" />
                  </svg>
                  <span className="absolute top-0.5 right-1 text-[9px] font-medium text-muted-foreground">回溯周期</span>
                  <span className="absolute bottom-0.5 left-1 text-[9px] font-medium text-muted-foreground">成本类型</span>
                </th>
                {periods.map((p) => (
                  <th key={p} className="text-center py-1.5 px-1 font-medium text-muted-foreground">
                    {p}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allCostTypes.map((c) => (
                <tr key={c} className={`border-b border-border last:border-0 ${c === "总计" ? "bg-muted/30 font-semibold" : ""}`}>
                  <td className="py-2 pr-2 font-medium text-foreground">{c}</td>
                  {periods.map((p) => {
                    const { value, rate } = mockData[c][p];
                    const isPositive = rate > 0;
                    return (
                      <td key={p} className="text-center py-2 px-1">
                        <div className="font-semibold text-foreground">{value}</div>
                        <div
                          className={`text-[10px] mt-0.5 ${
                            isPositive ? "text-emerald-600" : "text-red-500"
                          }`}
                        >
                          {isPositive ? "+" : ""}{rate}%
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChannelCostTable;
