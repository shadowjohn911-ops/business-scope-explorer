import { useState } from "react";
import { ChevronDown, X } from "lucide-react";

interface Props {
  label: string;
  options: string[];
}

const MultiSelectFilter = ({ label, options }: Props) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  const isAll = selected.length === 0;

  const toggle = (val: string) => {
    setSelected((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );
  };

  const selectAll = () => setSelected([]);

  const displayText = isAll ? "全部" : selected.join("、");

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2.5"
      >
        <span className="text-xs font-medium text-card-foreground">{label}</span>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground truncate max-w-[120px]">{displayText}</span>
          <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
        </div>
      </button>

      {open && (
        <div className="px-3 pb-2.5 flex flex-wrap gap-1.5">
          <button
            onClick={selectAll}
            className={`px-2.5 py-1 rounded-md text-[10px] font-medium transition-colors ${
              isAll ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            全部
          </button>
          {options.map((opt) => {
            const active = selected.includes(opt);
            return (
              <button
                key={opt}
                onClick={() => toggle(opt)}
                className={`px-2.5 py-1 rounded-md text-[10px] font-medium transition-colors ${
                  active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {opt}
                {active && <X className="w-3 h-3 inline ml-0.5" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MultiSelectFilter;
