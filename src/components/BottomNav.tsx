import { Link, useLocation } from "@tanstack/react-router";
import { Map, Search, Megaphone, Star } from "lucide-react";

const items = [
  { to: "/", label: "Mapa", Icon: Map },
  { to: "/buscar", label: "Busca", Icon: Search },
  { to: "/eventos", label: "Eventos", Icon: Megaphone },
  { to: "/avaliar", label: "Avaliar", Icon: Star },
] as const;

export function BottomNav() {
  const loc = useLocation();
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-[900] border-t border-border bg-card/95 backdrop-blur"
      aria-label="Navegação principal"
    >
      <ul className="mx-auto flex max-w-md items-stretch">
        {items.map(({ to, label, Icon }) => {
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
