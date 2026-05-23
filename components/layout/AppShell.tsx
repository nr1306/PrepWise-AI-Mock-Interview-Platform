"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

const navItems = [
  { href: "/dashboard",  label: "Dashboard",         icon: "dashboard" },
  { href: "/interview",  label: "Practice Lobby",     icon: "record_voice_over" },
  { href: "/history",    label: "Interview History",  icon: "history" },
];

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background">
      {/* ── Top nav ── */}
      <header
        className="sticky top-0 z-50 h-16 flex items-center justify-between
                   px-4 md:px-8 bg-background/80 glass border-b border-outline-variant"
      >
        <Link href="/dashboard" className="flex items-center gap-2 no-underline">
          <span className="material-symbols-outlined text-secondary text-2xl">waves</span>
          <span className="text-headline-md text-on-surface font-bold">PrepAI</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item no-underline ${
                pathname === item.href || pathname.startsWith(item.href + "/")
                  ? "active"
                  : ""
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User avatar placeholder */}
        <div className="w-9 h-9 rounded-full bg-secondary-container flex items-center justify-center">
          <span className="material-symbols-outlined text-on-secondary-container text-[18px]">
            person
          </span>
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="max-w-[1280px] mx-auto px-4 md:px-8 py-8 pb-24 md:pb-8">
        {children}
      </main>

      {/* ── Mobile bottom nav ── */}
      <nav
        className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center
                   h-16 bg-surface border-t border-outline-variant md:hidden"
      >
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-4 py-1 no-underline
                          transition-colors ${
                            isActive
                              ? "text-secondary"
                              : "text-on-surface-variant"
                          }`}
            >
              <span className="material-symbols-outlined text-[22px]">
                {item.icon}
              </span>
              <span className="text-label-sm">{item.label.split(" ")[0]}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
