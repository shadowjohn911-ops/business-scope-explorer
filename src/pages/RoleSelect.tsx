import { useNavigate } from "react-router-dom";
import { Building2, Handshake, Users } from "lucide-react";

const roles = [
  {
    id: "branch" as const,
    label: "分公司角色",
    desc: "管理分公司商户与交易数据",
    icon: Building2,
    colorClass: "bg-role-branch",
  },
  {
    id: "provider" as const,
    label: "服务商角色",
    desc: "查看服务商运营与交易情况",
    icon: Users,
    colorClass: "bg-role-provider",
  },
  {
    id: "partner" as const,
    label: "合作方角色",
    desc: "跟踪合作方业务数据",
    icon: Handshake,
    colorClass: "bg-role-partner",
  },
];

const RoleSelect = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="pt-14 pb-8 px-6 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">选择角色</h1>
        <p className="text-sm text-muted-foreground">请选择您的角色以进入对应的数据看板</p>
      </div>

      {/* Role cards */}
      <div className="flex-1 px-5 space-y-4">
        {roles.map((role) => {
          const Icon = role.icon;
          return (
            <button
              key={role.id}
              onClick={() => navigate(`/dashboard/${role.id}`)}
              className="w-full flex items-center gap-4 p-5 bg-card rounded-2xl shadow-sm border border-border active:scale-[0.98] transition-transform"
            >
              <div className={`w-12 h-12 rounded-xl ${role.colorClass} flex items-center justify-center shrink-0`}>
                <Icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="text-left">
                <div className="text-base font-semibold text-card-foreground">{role.label}</div>
                <div className="text-sm text-muted-foreground mt-0.5">{role.desc}</div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="pb-10 pt-6 text-center">
        <p className="text-xs text-muted-foreground">数据洞察平台 v1.0</p>
      </div>
    </div>
  );
};

export default RoleSelect;
