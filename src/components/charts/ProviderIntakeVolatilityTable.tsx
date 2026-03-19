import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { HelpCircle, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const periods = ["昨日", "近7日", "近30日", "近90日"] as const;
const bands = ["⬆200%以上", "⬆100%~200%", "⬆50%~100%", "-50%~50%", "⬇50%~75%", "⬇75%~100%", "⬇100%"] as const;
const bandRanges: Record<string, [number, number]> = {
  "⬆200%以上": [200, 1000], "⬆100%~200%": [100, 200], "⬆50%~100%": [50, 100],
  "-50%~50%": [-50, 50], "⬇50%~75%": [-75, -50], "⬇75%~100%": [-100, -75], "⬇100%": [-100, -100],
};
const nonZeroRate = () => { let r = 0; while (r === 0) r = Math.floor(Math.random() * 200) - 100; return r; };
const PAGE_SIZE = 20;

const mockData: Record<string, Record<string, { value: number; rate: number }>> = {};
bands.forEach((band) => { mockData[band] = {}; periods.forEach((p) => { const base = band === "-50%~50%" ? 30 : 8; mockData[band][p] = { value: Math.floor(Math.random() * base) + 1, rate: nonZeroRate() }; }); });

const getBandColor = (band: string) => { if (band.startsWith("⬆")) return "text-emerald-600"; if (band.startsWith("⬇")) return "text-red-500"; return "text-muted-foreground"; };
const getBarColor = (band: string) => { if (band.startsWith("⬆")) return "hsl(160, 65%, 45%)"; if (band.startsWith("⬇")) return "hsl(0, 84%, 60%)"; return "hsl(215, 90%, 50%)"; };

const generateDetails = (band: string, entityLabel: string, count: number) => {
  const [minPct, maxPct] = bandRanges[band] || [-50, 50];
  return Array.from({ length: count }, (_, i) => {
    const previousCount = Math.floor(Math.random() * 200) + 10;
    const volatility = Math.round(minPct + Math.random() * (maxPct - minPct));
    const currentCount = Math.max(1, Math.round(previousCount * (1 + volatility / 100)));
    return { providerId: `S${String(1000 + i).padStart(6, "0")}`, providerName: `${entityLabel}${String.fromCharCode(30002 + (i % 20))}${i >= 20 ? i : ""}`, currentCount, previousCount, volatility };
  });
};

type DetailSortField = "currentCount" | "volatility";
interface Props { entityLabel?: string; }

const ProviderIntakeVolatilityTable = ({ entityLabel = "服务商" }: Props) => {
  const [activePeriod, setActivePeriod] = useState<string>("近7日");
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailTitle, setDetailTitle] = useState("");
  const [detailPeriod, setDetailPeriod] = useState("近7日");
  const [details, setDetails] = useState<ReturnType<typeof generateDetails>>([]);
  const [sortField, setSortField] = useState<DetailSortField>("currentCount");
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(1);

  const handleCellClick = (band: string, period: string, value: number) => {
    if (value < 100) {
      setDetailTitle(`${band} · ${period} 明细`);
      setDetailPeriod(period);
      setDetails(generateDetails(band, entityLabel, value));
      setPage(1);
      setDetailOpen(true);
    }
  };

  const handleSort = (field: DetailSortField) => {
    if (sortField === field) setSortAsc(!sortAsc);
    else { setSortField(field); setSortAsc(false); }
  };

  const sortedDetails = [...details].sort((a, b) => { const diff = a[sortField] - b[sortField]; return sortAsc ? diff : -diff; });
  const totalPages = Math.ceil(sortedDetails.length / PAGE_SIZE);
  const pagedDetails = sortedDetails.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const periodDays = detailPeriod.replace("天", "");

  return (
    <>
      <Card className="border-border">
        <CardHeader className="px-3 py-2.5 pb-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xs font-semibold text-foreground">{entityLabel}进件洞察</CardTitle>
            <div className="flex items-center gap-1.5">
              <div className="flex bg-muted rounded-md p-0.5">
                {periods.map((p) => (<button key={p} onClick={() => setActivePeriod(p)} className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors ${activePeriod === p ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>{p}</button>))}
              </div>
              <Popover>
                <PopoverTrigger asChild><button className="p-0.5 rounded-full hover:bg-muted transition-colors"><HelpCircle className="w-3.5 h-3.5 text-muted-foreground" /></button></PopoverTrigger>
                <PopoverContent className="w-80 text-[11px] leading-relaxed text-foreground" side="left" align="start">
                  表格中的数值表示在指定回溯周期内（如近7日），进件数较上一周期增长率落在该区间的{entityLabel}数量；百分比表示该区间{entityLabel}数量相较于上一周期的环比变化率（正数表示增加，负数表示减少）。
                  <br /><br /><span className="text-muted-foreground">示例：若"⬆200%以上"对应"近7日"的数值为5，比例为+25%，则表示当前周期（如3/10-3/16）内有5个{entityLabel}的进件数较上一周期（如3/3-3/9）增长超过2倍，且这类{entityLabel}的数量较上一周期增加了25%。</span>
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
                    <div className="flex-1 h-3 bg-muted rounded-sm overflow-hidden"><div className="h-full rounded-sm transition-all" style={{ width: `${barWidth}%`, backgroundColor: getBarColor(band) }} /></div>
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
                  <th className="text-left py-1.5 px-1 font-medium text-muted-foreground">{entityLabel}编号</th>
                  <th className="text-left py-1.5 px-1 font-medium text-muted-foreground">{entityLabel}名称</th>
                  <th className="text-right py-1.5 px-1 font-medium text-muted-foreground">{periodDays}天进件数(上期)</th>
                  <th className="text-right py-1.5 px-1 font-medium text-muted-foreground cursor-pointer hover:text-foreground" onClick={() => handleSort("currentCount")}>
                    <span className="inline-flex items-center gap-0.5">{periodDays}天进件数(本期) <ArrowUpDown className="w-2.5 h-2.5" /></span>
                  </th>
                  <th className="text-right py-1.5 px-1 font-medium text-muted-foreground cursor-pointer hover:text-foreground" onClick={() => handleSort("volatility")}>
                    <span className="inline-flex items-center gap-0.5">进件波动比例 <ArrowUpDown className="w-2.5 h-2.5" /></span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {pagedDetails.map((d, i) => (
                  <tr key={i} className="border-b border-border last:border-0">
                    <td className="py-1.5 px-1 text-foreground">{d.providerId}</td>
                    <td className="py-1.5 px-1 text-foreground">{d.providerName}</td>
                    <td className="py-1.5 px-1 text-right text-muted-foreground">{d.previousCount}</td>
                    <td className="py-1.5 px-1 text-right text-foreground font-medium">{d.currentCount}</td>
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

export default ProviderIntakeVolatilityTable;
