import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { HelpCircle } from "lucide-react";

const periods = ["昨日", "近7日", "近30日", "近90日"] as const;
const allCostTypes = ["交换费", "清算费", "总计"] as const;

// Hardcoded data synchronized with CoreDataSummary transaction module
const mockData: Record<string, Record<string, { value: string; rate: number }>> = {
  "交换费": {
    "昨日": { value: "0.43", rate: 3 },
    "近7日": { value: "3.02", rate: 5 },
    "近30日": { value: "11.22", rate: 8 },
    "近90日": { value: "32.55", rate: 10 },
  },
  "清算费": {
    "昨日": { value: "0.17", rate: 5 },
    "近7日": { value: "1.18", rate: 8 },
    "近30日": { value: "4.58", rate: 10 },
    "近90日": { value: "13.95", rate: 12 },
  },
  "总计": {
    "昨日": { value: "0.60", rate: 4 },
    "近7日": { value: "4.20", rate: 6 },
    "近30日": { value: "15.80", rate: 9 },
    "近90日": { value: "46.50", rate: 11 },
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
              表格中的数值表示在指定回溯周期内（如近7日、近30日）各类成本的统计值（单位：万元）；百分比表示当前周期相较于上一周期的环比变化率（正数表示增长，负数表示下降）。
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
