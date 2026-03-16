import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { HelpCircle, ArrowUpDown } from "lucide-react";
import { useState } from "react";

const periods = ["1天", "7天", "30天", "90天"] as const;
const behaviors = ["入网", "首刷", "交易"] as const;

const generateRow = () => {
  const v90 = Math.floor(Math.random() * 500);
  const v30 = Math.floor(Math.random() * (v90 + 1));
  const v7 = Math.floor(Math.random() * (v30 + 1));
  const v1 = Math.floor(Math.random() * (v7 + 1));
  return {
    "1天": { value: v1, rate: Math.floor(Math.random() * 201) - 100 },
    "7天": { value: v7, rate: Math.floor(Math.random() * 201) - 100 },
    "30天": { value: v30, rate: Math.floor(Math.random() * 201) - 100 },
    "90天": { value: v90, rate: Math.floor(Math.random() * 201) - 100 },
  };
};

const mockData: Record<string, Record<string, { value: number; rate: number }>> = {};
behaviors.forEach((b) => {
  mockData[b] = generateRow();
});

const generateDetails = () =>
  Array.from({ length: 5 }, (_, i) => ({
    merchantId: `M${String(1000 + i).padStart(6, "0")}`,
    merchantName: `商户${["甲", "乙", "丙", "丁", "戊"][i]}`,
    entryDate: `2026-01-${String(Math.floor(Math.random() * 28) + 1).padStart(2, "0")}`,
    firstSwipeDate: `2026-02-${String(Math.floor(Math.random() * 28) + 1).padStart(2, "0")}`,
    lastSwipeDate: `2026-03-${String(Math.floor(Math.random() * 16) + 1).padStart(2, "0")}`,
  }));

type SortField = "entryDate" | "firstSwipeDate" | "lastSwipeDate";

const MerchantBehaviorTable = () => {
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailTitle, setDetailTitle] = useState("");
  const [details] = useState(() => generateDetails());
  const [sortField, setSortField] = useState<SortField>("entryDate");
  const [sortAsc, setSortAsc] = useState(false);

  const handleCellClick = (behavior: string, period: string, value: number) => {
    if (value < 100) {
      setDetailTitle(`${behavior} · ${period} 明细`);
      setDetailOpen(true);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortAsc(!sortAsc);
    else { setSortField(field); setSortAsc(false); }
  };

  const sortedDetails = [...details].sort((a, b) => {
    const diff = a[sortField].localeCompare(b[sortField]);
    return sortAsc ? diff : -diff;
  });

  return (
    <>
      <Card className="border-border">
        <CardHeader className="px-3 py-2.5 pb-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xs font-semibold text-foreground">商户行为洞察</CardTitle>
            <Popover>
              <PopoverTrigger asChild>
                <button className="p-0.5 rounded-full hover:bg-muted transition-colors">
                  <HelpCircle className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-72 text-[11px] leading-relaxed text-foreground" side="left" align="start">
                表格中的数值表示在指定回溯周期内（如近7日、近30日）发生过该行为的商户数量；百分比表示当前周期相较于上一周期的环比变化率（正数表示增长，负数表示下降）。
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
                    <span className="absolute bottom-0.5 left-1 text-[9px] font-medium text-muted-foreground">行为</span>
                  </th>
                  {periods.map((p) => (
                    <th key={p} className="text-center py-1.5 px-1 font-medium text-muted-foreground">
                      {p}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {behaviors.map((b) => (
                  <tr key={b} className="border-b border-border last:border-0">
                    <td className="py-2 pr-2 font-medium text-foreground">{b}</td>
                    {periods.map((p) => {
                      const { value, rate } = mockData[b][p];
                      const isPositive = rate > 0;
                      const isZero = rate === 0;
                      const clickable = value < 100;
                      return (
                        <td
                          key={p}
                          className={`text-center py-2 px-1 ${clickable ? "cursor-pointer hover:bg-muted/40 rounded" : ""}`}
                          onClick={() => handleCellClick(b, p, value)}
                        >
                          <div className={`font-semibold ${clickable ? "text-primary underline underline-offset-2" : "text-foreground"}`}>{value}</div>
                          <div
                            className={`text-[10px] mt-0.5 ${
                              isZero ? "text-muted-foreground" : isPositive ? "text-emerald-600" : "text-red-500"
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

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-sm max-h-[80vh] overflow-auto p-4">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-sm">{detailTitle}</DialogTitle>
            <DialogDescription className="text-[10px] text-muted-foreground">点击表头排序</DialogDescription>
          </DialogHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-[10px]">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-1.5 px-1 font-medium text-muted-foreground">商户号</th>
                  <th className="text-left py-1.5 px-1 font-medium text-muted-foreground">商户名称</th>
                  <th
                    className="text-left py-1.5 px-1 font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                    onClick={() => handleSort("entryDate")}
                  >
                    <span className="inline-flex items-center gap-0.5">入网日期 <ArrowUpDown className="w-2.5 h-2.5" /></span>
                  </th>
                  <th
                    className="text-left py-1.5 px-1 font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                    onClick={() => handleSort("firstSwipeDate")}
                  >
                    <span className="inline-flex items-center gap-0.5">首刷日期 <ArrowUpDown className="w-2.5 h-2.5" /></span>
                  </th>
                  <th
                    className="text-left py-1.5 px-1 font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                    onClick={() => handleSort("lastSwipeDate")}
                  >
                    <span className="inline-flex items-center gap-0.5">末刷日期 <ArrowUpDown className="w-2.5 h-2.5" /></span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedDetails.map((d, i) => (
                  <tr key={i} className="border-b border-border last:border-0">
                    <td className="py-1.5 px-1 text-foreground">{d.merchantId}</td>
                    <td className="py-1.5 px-1 text-foreground">{d.merchantName}</td>
                    <td className="py-1.5 px-1 text-muted-foreground">{d.entryDate}</td>
                    <td className="py-1.5 px-1 text-muted-foreground">{d.firstSwipeDate}</td>
                    <td className="py-1.5 px-1 text-muted-foreground">{d.lastSwipeDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MerchantBehaviorTable;
