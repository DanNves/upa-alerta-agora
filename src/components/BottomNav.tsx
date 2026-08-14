import { Link, useLocation } from "@tanstack/react-router";
import { Map, Search, Megaphone, Star, Shield } from "lucide-react";
import { FEATURE_FLAGS } from "@/data/regras";

// Navegação do MVP: focada no cidadão.
// "Avaliar" e "Admin" permanecem como rotas acessíveis, porém fora das abas
// principais (ver docs/decisoes.md).
const items = [
  { to: "/", label: "Mapa", Icon: Map, enabled: true },
  { to: "/buscar", label: "Busca", Icon: Search, enabled: true },
  { to: "/eventos", label: "Eventos", Icon: Megaphone, enabled: true },
  { to: "/avaliar", label: "Avaliar", Icon: Star, enabled: FEATURE_FLAGS.avaliacoesNaNavegacao },
  { to: "/admin", label: "Admin", Icon: Shield, enabled: FEATURE_FLAGS.adminNaNavegacao },
] as const;

export function BottomNav() {
  const loc = useLocation();
  const visible = items.filter((i) => i.enabled);
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-[900] border-t border-border bg-card/95 backdrop-blur"
      aria-label="Navegação principal"
    >
      <ul className="mx-auto flex max-w-md items-stretch">
        {visible.map(({ to, label, Icon }) => {
          const active = loc.pathname === to || (to !== "/" && loc.pathname.startsWith(to));
          return (
            <li key={to} className="flex-1">
              <Link
                to={to}
                className={
                  "flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition " +
                  (active ? "text-primary" : "text-muted-foreground hover:text-foreground")
                }
              >
                <Icon className="h-5 w-5" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
