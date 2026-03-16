import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Generate random mock data
const generateValue = () => Math.floor(Math.random() * 100);
const generateRate = () => Math.floor(Math.random() * 200) - 100; // -100 to +100

const periods = ["1天", "7天", "30天", "90天"] as const;
const behaviors = ["入网", "首刷", "交易"] as const;

// Pre-generate stable mock data
const mockData: Record<string, Record<string, { value: number; rate: number }>> = {};
behaviors.forEach((b) => {
  mockData[b] = {};
  periods.forEach((p) => {
    mockData[b][p] = { value: generateValue(), rate: generateRate() };
  });
});

const MerchantBehaviorTable = () => {
  return (
    <Card className="border-border">
      <CardHeader className="px-3 py-2.5 pb-0">
        <CardTitle className="text-xs font-semibold text-foreground">商户行为洞察</CardTitle>
      </CardHeader>
      <CardContent className="px-3 py-2.5">
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-1.5 pr-2 font-medium text-muted-foreground w-12">行为</th>
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
                    return (
                      <td key={p} className="text-center py-2 px-1">
                        <div className="font-semibold text-foreground">{value}</div>
                        <div
                          className={`text-[10px] mt-0.5 ${
                            isZero
                              ? "text-muted-foreground"
                              : isPositive
                              ? "text-emerald-600"
                              : "text-red-500"
                          }`}
                        >
                          {isPositive ? "+" : ""}
                          {rate}%
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

export default MerchantBehaviorTable;
