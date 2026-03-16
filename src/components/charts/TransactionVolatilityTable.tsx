import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

const periods = ["7天", "14天", "30天", "90天"] as const;
const bands = [
  "↑200%以上",
  "↑100%~200%",
  "↑50%~100%",
  "-50%~50%",
  "↓50%~75%",
  "↓75%~100%",
  "↓100%",
] as const;

// Generate mock data
const mockData: Record<string, Record<string, number>> = {};
bands.forEach((band) => {
  mockData[band] = {};
  periods.forEach((p) => {
    // Middle band (-50%~50%) gets higher counts
    const base = band === "-50%~50%" ? 30 : 8;
    mockData[band][p] = Math.floor(Math.random() * base) + 1;
  });
});

const getBandColor = (band: string) => {
  if (band.startsWith("↑")) return "text-emerald-600";
  if (band.startsWith("↓")) return "text-red-500";
  return "text-muted-foreground";
};

const TransactionVolatilityTable = () => {
  const [activePeriod, setActivePeriod] = useState<string>("7天");

  return (
    <Card className="border-border">
      <CardHeader className="px-3 py-2.5 pb-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs font-semibold text-foreground">交易额波动表</CardTitle>
          <div className="flex bg-muted rounded-md p-0.5">
            {periods.map((p) => (
              <button
                key={p}
                onClick={() => setActivePeriod(p)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors ${
                  activePeriod === p
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-3 py-2.5 pt-1">
        <div className="space-y-0">
          {bands.map((band) => {
            const count = mockData[band][activePeriod];
            const maxCount = Math.max(...bands.map((b) => mockData[b][activePeriod]));
            const barWidth = maxCount > 0 ? (count / maxCount) * 100 : 0;

            return (
              <div key={band} className="flex items-center py-1.5 border-b border-border last:border-0">
                <span className={`text-[10px] w-24 shrink-0 font-medium ${getBandColor(band)}`}>
                  {band}
                </span>
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1 h-3 bg-muted rounded-sm overflow-hidden">
                    <div
                      className="h-full rounded-sm transition-all"
                      style={{
                        width: `${barWidth}%`,
                        backgroundColor: band.startsWith("↑")
                          ? "hsl(160, 65%, 45%)"
                          : band.startsWith("↓")
                          ? "hsl(0, 84%, 60%)"
                          : "hsl(215, 90%, 50%)",
                      }}
                    />
                  </div>
                  <span className="text-[10px] text-foreground font-semibold w-6 text-right">
                    {count}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionVolatilityTable;
