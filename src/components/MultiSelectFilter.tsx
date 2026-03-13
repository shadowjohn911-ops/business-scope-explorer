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
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3"
      >
        <span className="text-sm font-medium text-card-foreground">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground truncate max-w-[160px]">{displayText}</span>
          <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
        </div>
      </button>

      {open && (
        <div className="px-4 pb-3 flex flex-wrap gap-2">
          <button
            onClick={selectAll}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
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
      )}
    </div>
  );
};

export default MultiSelectFilter;
