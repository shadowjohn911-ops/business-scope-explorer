import { useState } from "react";
import { ChevronDown, Search, X, Check } from "lucide-react";

type RoleType = "branch" | "provider" | "partner";

// Mock service providers for team/ally search
const mockProviders = [
  "SP001-服务商A",
  "SP002-服务商B",
  "SP003-服务商C",
  "SP004-联盟商户D",
  "SP005-渠道服务E",
  "SP006-合作服务F",
];

interface Props {
  role: RoleType;
  onLevel1Change?: (val: string) => void;
}

const MerchantOwnerFilter = ({ role, onLevel1Change }: Props) => {
  const [open, setOpen] = useState(false);
  const [level1, setLevel1] = useState<string>("全部");
  const [level2Selected, setLevel2Selected] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Define options based on role
  const getLevel1Options = (): string[] => {
    if (role === "partner") return ["全部", "自拓", "合作方"];
    if (role === "branch") return ["全部", "自有", "团队"];
    return ["全部", "自有", "盟友"]; // provider
  };

  const getLevel2Options = (): string[] | null => {
    if (role === "partner") return null; // partner has no level 2
    if (level1 === "全部") return null;
    if (level1 === "自有") return ["自拓", "合作方"];
    // 团队 or 盟友 -> searchable provider list
    return null; // handled separately
  };

  const isTeamOrAlly = (role === "branch" && level1 === "团队") || (role === "provider" && level1 === "盟友");
  const level2Options = getLevel2Options();

  const filteredProviders = mockProviders.filter((p) =>
    p.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleLevel2 = (val: string) => {
    setLevel2Selected((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );
  };

  const handleLevel1Change = (val: string) => {
    setLevel1(val);
    setLevel2Selected([]);
    setSearchTerm("");
  };

  const getDisplayText = () => {
    if (level1 === "全部") return "全部";
    if (level2Selected.length > 0) return `${level1} · ${level2Selected.join("、")}`;
    return level1;
  };

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3"
      >
        <span className="text-sm font-medium text-card-foreground">商户归属</span>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground truncate max-w-[160px]">{getDisplayText()}</span>
          <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
        </div>
      </button>

      {open && (
        <div className="px-4 pb-3 space-y-3">
          {/* Level 1 */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">一级筛选</p>
            <div className="flex flex-wrap gap-2">
              {getLevel1Options().map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleLevel1Change(opt)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    level1 === opt ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Level 2 - fixed options */}
          {level2Options && (
            <div>
              <p className="text-xs text-muted-foreground mb-2">二级筛选</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setLevel2Selected([])}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    level2Selected.length === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  全部
                </button>
                {level2Options.map((opt) => {
                  const active = level2Selected.includes(opt);
                  return (
                    <button
                      key={opt}
                      onClick={() => toggleLevel2(opt)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {opt}
                      {active && <X className="w-3 h-3 inline ml-1" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Level 2 - searchable provider list */}
          {isTeamOrAlly && (
            <div>
              <p className="text-xs text-muted-foreground mb-2">二级筛选 · 选择服务商</p>
              <div className="relative mb-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="搜索服务商编号或名称"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-muted rounded-lg border-none outline-none text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div className="max-h-40 overflow-y-auto space-y-1">
                <button
                  onClick={() => setLevel2Selected([])}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
                    level2Selected.length === 0 ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                  }`}
                >
                  <span>全部</span>
                  {level2Selected.length === 0 && <Check className="w-3.5 h-3.5" />}
                </button>
                {filteredProviders.map((provider) => {
                  const active = level2Selected.includes(provider);
                  return (
                    <button
                      key={provider}
                      onClick={() => toggleLevel2(provider)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
                        active ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      <span>{provider}</span>
                      {active && <Check className="w-3.5 h-3.5" />}
                    </button>
                  );
                })}
                {filteredProviders.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-3">未找到匹配的服务商</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MerchantOwnerFilter;
