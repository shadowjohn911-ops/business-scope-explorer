import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { HelpCircle } from "lucide-react";

const periods = ["昨日", "近7日", "近30日", "近90日"] as const;
const metrics = ["交易金额", "交易笔数", "笔均金额", "台均金额", "户均金额"] as const;

// Unified transaction data:
// 昨日:120万 近7日:850万 近30日:3200万 近90日:9500万
// 笔均100-200, 日台均~2000, 日户均~3000, 笔均<台均<户均
export const transactionInsightData: Record<string, Record<string, { value: string; rate: number }>> = {
  "交易金额": {
    "昨日": { value: "120万", rate: 5 },
    "近7日": { value: "850万", rate: 8 },
    "近30日": { value: "3200万", rate: 12 },
    "近90日": { value: "9500万", rate: 15 },
  },
  "交易笔数": {
    "昨日": { value: "8000", rate: 3 },
    "近7日": { value: "5.6万", rate: 6 },
    "近30日": { value: "21.3万", rate: 9 },
    "近90日": { value: "63.3万", rate: 11 },
  },
  "笔均金额": {
    "昨日": { value: "150", rate: 2 },
    "近7日": { value: "152", rate: 3 },
    "近30日": { value: "150", rate: 2 },
    "近90日": { value: "150", rate: 3 },
  },
  "台均金额": {
    "昨日": { value: "2000", rate: 3 },
    "近7日": { value: "1.4万", rate: 5 },
    "近30日": { value: "6万", rate: 7 },
    "近90日": { value: "18万", rate: 8 },
  },
  "户均金额": {
    "昨日": { value: "3000", rate: 4 },
    "近7日": { value: "2.1万", rate: 6 },
    "近30日": { value: "9万", rate: 8 },
    "近90日": { value: "27万", rate: 10 },
  },
};

const TransactionInsightTable = () => {
  return (
    <Card className="border-border">
      <CardHeader className="px-3 py-2.5 pb-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs font-semibold text-foreground">交易洞察</CardTitle>
          <Popover>
            <PopoverTrigger asChild>
              <button className="p-0.5 rounded-full hover:bg-muted transition-colors">
                <HelpCircle className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-72 text-[11px] leading-relaxed text-foreground" side="left" align="start">
              表格中的数值表示在指定回溯周期内（如近7日、近30日）各交易指标（如交易金额、交易笔数）的统计值；百分比表示当前周期相较于上一周期的环比变化率（正数表示增长，负数表示下降）。台均金额和户均金额为期间累计值。
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
                  <span className="absolute bottom-0.5 left-1 text-[9px] font-medium text-muted-foreground">交易指标</span>
                </th>
                {periods.map((p) => (
                  <th key={p} className="text-center py-1.5 px-1 font-medium text-muted-foreground">
                    {p}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {metrics.map((m) => (
                <tr key={m} className="border-b border-border last:border-0">
                  <td className="py-2 pr-2 font-medium text-foreground">{m}</td>
                  {periods.map((p) => {
                    const { value, rate } = mockData[m][p];
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

export default TransactionInsightTable;
