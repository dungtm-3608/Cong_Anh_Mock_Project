import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import SiteFooter from "../layout/SiteFooter";
import SiteHeader from "../layout/SiteHeader";

interface AuthShellProps {
  title: string;
  crumb: string;
  switchLabel: string;
  switchTo: string;
  switchState?: unknown;
  children: ReactNode;
}

export default function AuthShell({
  title,
  crumb,
  switchLabel,
  switchTo,
  switchState,
  children,
}: AuthShellProps) {
  return (
    <div className="min-h-screen bg-surface text-dark">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-[11px] text-muted">
              Trang chủ / <span className="text-primary">{crumb}</span>
            </p>
            <h1
              className="mt-4 text-4xl uppercase tracking-[0.16em] text-dark"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {title}
            </h1>
            <div className="mt-3 flex items-center gap-2 text-dark">
              <span className="h-px w-8 bg-dark" />
              <span className="text-xs">➜</span>
              <span className="h-px w-4 bg-dark" />
            </div>
          </div>

          <Link
            to={switchTo}
            state={switchState}
            className="inline-flex items-center justify-center bg-black px-8 py-3 text-[11px] font-semibold uppercase tracking-[0.26em] text-white transition hover:bg-(--color-dark-2)"
          >
            {switchLabel}
          </Link>
        </div>

        <div className="mt-8">{children}</div>
      </main>
      <SiteFooter />
    </div>
  );
}
