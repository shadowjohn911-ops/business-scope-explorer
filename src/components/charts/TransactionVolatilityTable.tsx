import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { HelpCircle, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const periods = ["昨日", "近7日", "近30日", "近90日"] as const;
const bands = [
  "⬆500%以上", "⬆200%~500%", "⬆100%~200%", "⬆50%~100%",
  "-50%~50%", "⬇50%~75%", "⬇75%~100%", "⬇100%",
] as const;

const bandRanges: Record<string, [number, number]> = {
  "⬆500%以上": [500, 1000], "⬆200%~500%": [200, 500], "⬆100%~200%": [100, 200],
  "⬆50%~100%": [50, 100], "-50%~50%": [-50, 50], "⬇50%~75%": [-75, -50],
  "⬇75%~100%": [-100, -75], "⬇100%": [-100, -100],
};

const nonZeroRate = () => { let r = 0; while (r === 0) r = Math.floor(Math.random() * 200) - 100; return r; };
const PAGE_SIZE = 20;

const nonZeroRate2 = () => { let r = 0; while (r === 0) r = Math.floor(Math.random() * 200) - 100; return r; };

const mockData: Record<string, Record<string, { value: number; rate: number }>> = {
  "⬆500%以上":  { "昨日": { value: 3, rate: 50 },  "近7日": { value: 10, rate: 25 },  "近30日": { value: 18, rate: 20 },  "近90日": { value: 25, rate: 15 } },
  "⬆200%~500%": { "昨日": { value: 5, rate: 30 },  "近7日": { value: 20, rate: 35 },  "近30日": { value: 30, rate: 28 },  "近90日": { value: 40, rate: 18 } },
  "⬆100%~200%": { "昨日": { value: 8, rate: -15 }, "近7日": { value: 25, rate: -10 }, "近30日": { value: 35, rate: 12 },  "近90日": { value: 50, rate: 10 } },
  "⬆50%~100%":  { "昨日": { value: 12, rate: 20 }, "近7日": { value: 35, rate: 15 },  "近30日": { value: 50, rate: -8 },  "近90日": { value: 65, rate: -5 } },
  "-50%~50%":    { "昨日": { value: 250, rate: -3 },"近7日": { value: 700, rate: -5 }, "近30日": { value: 750, rate: 3 },   "近90日": { value: 780, rate: 5 } },
  "⬇50%~75%":   { "昨日": { value: 6, rate: -20 }, "近7日": { value: 15, rate: -12 }, "近30日": { value: 22, rate: -18 },  "近90日": { value: 30, rate: -10 } },
  "⬇75%~100%":  { "昨日": { value: 3, rate: -35 }, "近7日": { value: 5, rate: -25 },  "近30日": { value: 10, rate: -30 },  "近90日": { value: 15, rate: -20 } },
  "⬇100%":      { "昨日": { value: 20, rate: 10 }, "近7日": { value: 60, rate: 8 },   "近30日": { value: 80, rate: -5 },   "近90日": { value: 90, rate: -3 } },
};

const getBandColor = (band: string) => { if (band.startsWith("⬆")) return "text-emerald-600"; if (band.startsWith("⬇")) return "text-red-500"; return "text-muted-foreground"; };
const getBarColor = (band: string) => { if (band.startsWith("⬆")) return "hsl(160, 65%, 45%)"; if (band.startsWith("⬇")) return "hsl(0, 84%, 60%)"; return "hsl(215, 90%, 50%)"; };

const generateDetails = (band: string, count: number) => {
  const [minPct, maxPct] = bandRanges[band] || [-50, 50];
  return Array.from({ length: count }, (_, i) => {
    const previousAmount = Math.floor(Math.random() * 50000) + 1000;
    const volatility = Math.round(minPct + Math.random() * (maxPct - minPct));
    const currentAmount = Math.max(0, Math.round(previousAmount * (1 + volatility / 100)));
    return {
      merchantId: `M${String(2000 + i).padStart(6, "0")}`,
      merchantName: `商户${String.fromCharCode(65 + (i % 26))}${i >= 26 ? i : ""}`,
      firstSwipeDate: `2026-02-${String((i % 28) + 1).padStart(2, "0")}`,
      lastSwipeDate: `2026-03-${String((i % 16) + 1).padStart(2, "0")}`,
      previousAmount, currentAmount, volatility,
    };
  });
};

type DetailSortField = "currentAmount" | "volatility";

const TransactionVolatilityTable = () => {
  const [activePeriod, setActivePeriod] = useState<string>("近7日");
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailTitle, setDetailTitle] = useState("");
  const [detailPeriod, setDetailPeriod] = useState("近7日");
  const [details, setDetails] = useState<ReturnType<typeof generateDetails>>([]);
  const [sortField, setSortField] = useState<DetailSortField>("currentAmount");
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(1);

  const handleCellClick = (band: string, period: string, value: number) => {
    if (value < 100) {
      setDetailTitle(`${band} · ${period} 明细`);
      setDetailPeriod(period);
      setDetails(generateDetails(band, value));
      setPage(1);
      setDetailOpen(true);
    }
  };

  const handleSort = (field: DetailSortField) => {
    if (sortField === field) setSortAsc(!sortAsc);
    else { setSortField(field); setSortAsc(false); }
  };

  const sortedDetails = [...details].sort((a, b) => {
    const diff = a[sortField] - b[sortField];
    return sortAsc ? diff : -diff;
  });

  const totalPages = Math.ceil(sortedDetails.length / PAGE_SIZE);
  const pagedDetails = sortedDetails.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  

  return (
    <>
      <Card className="border-border">
        <CardHeader className="px-3 py-2.5 pb-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xs font-semibold text-foreground">商户交易额波动分布</CardTitle>
            <div className="flex items-center gap-1.5">
              <div className="flex bg-muted rounded-md p-0.5">
                {periods.map((p) => (
                  <button key={p} onClick={() => setActivePeriod(p)} className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors ${activePeriod === p ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>{p}</button>
                ))}
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <button className="p-0.5 rounded-full hover:bg-muted transition-colors"><HelpCircle className="w-3.5 h-3.5 text-muted-foreground" /></button>
                </PopoverTrigger>
                <PopoverContent className="w-80 text-[11px] leading-relaxed text-foreground" side="left" align="start">
                  表格中的数值表示在指定回溯周期内（如近7日），交易额较上一周期波动幅度落在该区间的商户数量；百分比表示该区间商户数量相较于上一周期的环比变化率（正数表示增加，负数表示减少）。
                  <br /><br />
                  <span className="text-muted-foreground">
                    示例：若"⬆500%以上"对应"近7日"的数值为3，比例为+200%，则表示当前周期（如3/10-3/16）内有3个商户的交易额较上一周期（如3/3-3/9）增长超过5倍，且这类商户的数量较上一周期增加了2倍（即从1个增至3个）。
                  </span>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-3 py-2.5 pt-1">
          <div className="space-y-0">
            {bands.map((band) => {
              const { value: count, rate } = mockData[band][activePeriod];
              const maxCount = Math.max(...bands.map((b) => mockData[b][activePeriod].value));
              const barWidth = maxCount > 0 ? (count / maxCount) * 100 : 0;
              const clickable = count < 100;
              const isPositive = rate > 0;
              return (
                <div key={band} className={`flex items-center py-1.5 border-b border-border last:border-0 ${clickable ? "cursor-pointer hover:bg-muted/30 rounded" : ""}`} onClick={() => handleCellClick(band, activePeriod, count)}>
                  <span className={`text-[10px] w-24 shrink-0 font-medium ${getBandColor(band)}`}>{band}</span>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="flex-1 h-3 bg-muted rounded-sm overflow-hidden">
                      <div className="h-full rounded-sm transition-all" style={{ width: `${barWidth}%`, backgroundColor: getBarColor(band) }} />
                    </div>
                    <div className="flex items-baseline gap-1 w-16 justify-end shrink-0">
                      <span className={`text-[10px] font-semibold ${clickable ? "text-primary underline underline-offset-2" : "text-foreground"}`}>{count}</span>
                      <span className={`text-[9px] ${isPositive ? "text-emerald-600" : "text-red-500"}`}>{isPositive ? "+" : ""}{rate}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-sm max-h-[80vh] overflow-auto p-4">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-sm">{detailTitle}</DialogTitle>
            <DialogDescription className="text-[10px] text-muted-foreground">共{details.length}条 · 点击表头排序</DialogDescription>
          </DialogHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-[10px]">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-1.5 px-1 font-medium text-muted-foreground">商户号</th>
                  <th className="text-left py-1.5 px-1 font-medium text-muted-foreground">商户名称</th>
                  <th className="text-left py-1.5 px-1 font-medium text-muted-foreground">首刷日期</th>
                  <th className="text-left py-1.5 px-1 font-medium text-muted-foreground">末刷日期</th>
                  <th className="text-right py-1.5 px-1 font-medium text-muted-foreground">{detailPeriod}交易额(上期)</th>
                  <th className="text-right py-1.5 px-1 font-medium text-muted-foreground cursor-pointer hover:text-foreground" onClick={() => handleSort("currentAmount")}>
                    <span className="inline-flex items-center gap-0.5">{detailPeriod}交易额(本期) <ArrowUpDown className="w-2.5 h-2.5" /></span>
                  </th>
                  <th className="text-right py-1.5 px-1 font-medium text-muted-foreground cursor-pointer hover:text-foreground" onClick={() => handleSort("volatility")}>
                    <span className="inline-flex items-center gap-0.5">波动比例 <ArrowUpDown className="w-2.5 h-2.5" /></span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {pagedDetails.map((d, i) => (
                  <tr key={i} className="border-b border-border last:border-0">
                    <td className="py-1.5 px-1 text-foreground">{d.merchantId}</td>
                    <td className="py-1.5 px-1 text-foreground">{d.merchantName}</td>
                    <td className="py-1.5 px-1 text-muted-foreground">{d.firstSwipeDate}</td>
                    <td className="py-1.5 px-1 text-muted-foreground">{d.lastSwipeDate}</td>
                    <td className="py-1.5 px-1 text-right text-muted-foreground">{d.previousAmount.toLocaleString()}</td>
                    <td className="py-1.5 px-1 text-right text-foreground font-medium">{d.currentAmount.toLocaleString()}</td>
                    <td className={`py-1.5 px-1 text-right font-medium ${d.volatility > 0 ? "text-emerald-600" : "text-red-500"}`}>{d.volatility > 0 ? "+" : ""}{d.volatility}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2 text-[10px]">
              <span className="text-muted-foreground">第{page}/{totalPages}页</span>
              <div className="flex gap-1">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="p-1 rounded hover:bg-muted disabled:opacity-30"><ChevronLeft className="w-3 h-3" /></button>
                <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="p-1 rounded hover:bg-muted disabled:opacity-30"><ChevronRight className="w-3 h-3" /></button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TransactionVolatilityTable;
