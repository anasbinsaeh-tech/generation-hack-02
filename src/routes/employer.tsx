import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import { LangToggle, Logo } from "@/components/siuuu";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/employer")({
  head: () => ({
    meta: [
      { title: "Talent Radar — Skilleveling for employers" },
      {
        name: "description",
        content: "Search candidates by proven evidence and inspect the actual work behind every score.",
      },
      { property: "og:title", content: "Talent Radar — Skilleveling for employers" },
      { property: "og:description", content: "Don't trust a black-box AI score. Inspect the evidence behind it." },
    ],
  }),
  component: EmployerLayout,
});

function EmployerLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { t } = useT();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="flex size-9 items-center justify-center rounded-lg text-foreground hover:bg-black/5 sm:hidden"
            >
              <Menu className="size-5" />
            </button>
            <Logo />
            <span className="hidden rounded-md border border-border px-2 py-0.5 text-[11px] text-muted-foreground sm:inline">
              {t("emp.badge")}
            </span>
          </div>
          <div className="hidden items-center gap-2 text-sm sm:flex">
            {pathname !== "/employer" && (
              <Link to="/employer" className="text-muted-foreground hover:text-foreground">
                {t("emp.backRadar")}
              </Link>
            )}
            <Link
              to="/dashboard"
              className="rounded-lg border border-border px-3 py-1.5 text-muted-foreground hover:text-foreground"
            >
              {t("emp.switch")}
            </Link>
            <LangToggle />
          </div>
        </div>
      </header>
      <Outlet />

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-50 transition-opacity duration-300 sm:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
        <aside
          className={cn(
            "absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col border-r border-border bg-background shadow-xl transition-transform duration-300 ease-out",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex h-14 items-center justify-between border-b border-border/70 px-4">
            <Logo />
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-black/5 hover:text-foreground"
            >
              <X className="size-5" />
            </button>
          </div>
          <nav className="flex flex-col gap-1 p-3">
            {pathname !== "/employer" && (
              <Link
                to="/employer"
                className="rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-black/5 hover:text-foreground"
              >
                {t("emp.backRadar")}
              </Link>
            )}
            <Link
              to="/dashboard"
              className="rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-black/5 hover:text-foreground"
            >
              {t("emp.switch")}
            </Link>
          </nav>
          <div className="mt-auto border-t border-border/70 p-4">
            <LangToggle />
          </div>
        </aside>
      </div>
    </div>
  );
}
