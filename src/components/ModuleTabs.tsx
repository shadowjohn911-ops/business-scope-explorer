type ModuleType = "merchant" | "transaction" | "organization";
type RoleType = "branch" | "provider" | "partner";

const allModules: { id: ModuleType; label: string }[] = [
  { id: "merchant", label: "商户洞察" },
  { id: "transaction", label: "交易洞察" },
  { id: "organization", label: "组织洞察" },
];

interface Props {
  active: ModuleType;
  onChange: (m: ModuleType) => void;
  role: RoleType;
}

const ModuleTabs = ({ active, onChange, role }: Props) => {
  const modules = role === "partner"
    ? allModules.filter((m) => m.id !== "organization")
    : allModules;

  return (
    <div className="flex px-4 gap-1 pb-2">
      {modules.map((m) => (
        <button
          key={m.id}
          onClick={() => onChange(m.id)}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
            active === m.id
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted"
          }`}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
};

export default ModuleTabs;
