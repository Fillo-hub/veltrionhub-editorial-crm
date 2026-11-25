"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Newspaper,
  FolderKanban,
  CheckSquare,
  BarChart3,
  User,
  Settings,
  PlusCircle,
  Sparkles,
  Download,
  LogOut,
} from "lucide-react";
import { useDashboard } from "@/components/providers/DashboardProvider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface SidebarProps {
  onNavigate?: () => void;
  className?: string;
}

const Sidebar = ({ onNavigate, className }: SidebarProps) => {
  const pathname = usePathname();
  const { posts, categories, tasks, exportWorkspaceJson } = useDashboard();
  const { toast } = useToast();

  const publishedCount = posts.filter((p) => p.status === "published").length;
  const pendingTasksCount = tasks.filter((t) => t.status !== "done").length;
  const completedTasksCount = tasks.filter((t) => t.status === "done").length;
  const totalTasks = tasks.length || 1;
  const completionPct = Math.round((completedTasksCount / totalTasks) * 100);

  const mainNav = [
    {
      label: "Panoramica",
      href: "/",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: "Articoli & Post",
      href: "/posts",
      icon: Newspaper,
      badge: posts.length,
    },
    {
      label: "Nuovo Articolo",
      href: "/posts/new",
      icon: PlusCircle,
      highlight: true,
    },
    {
      label: "Categorie",
      href: "/categories",
      icon: FolderKanban,
      badge: categories.length,
    },
    {
      label: "Task & Redazione",
      href: "/tasks",
      icon: CheckSquare,
      badge: pendingTasksCount > 0 ? pendingTasksCount : undefined,
      badgeVariant: "warning",
    },
    {
      label: "Analytics & Insight",
      href: "/analytics",
      icon: BarChart3,
    },
  ];

  const accountNav = [
    {
      label: "Profilo Utente",
      href: "/profile",
      icon: User,
    },
    {
      label: "Impostazioni & Dati",
      href: "/settings",
      icon: Settings,
    },
  ];

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    if (href === "/posts" && pathname === "/posts/new") return false;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleBackup = () => {
    exportWorkspaceJson();
    toast({
      title: "Backup esportato con successo",
      description: "Il file JSON del tuo workspace è stato scaricato.",
    });
  };

  return (
    <aside
      className={cn(
        "flex flex-col justify-between w-64 shrink-0 border-r border-border bg-card/70 backdrop-blur-sm select-none h-full",
        className
      )}
    >
      <div className="p-4 space-y-6 overflow-y-auto">
        {/* Main Navigation */}
        <div>
          <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Gestione Contenuti
          </p>
          <nav className="space-y-1">
            {mainNav.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href, item.exact);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group",
                    active
                      ? "bg-primary text-primary-foreground shadow-sm shadow-primary/25"
                      : item.highlight
                      ? "text-primary hover:bg-primary/10 border border-dashed border-primary/30"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={cn(
                        "h-4 w-4 transition-transform group-hover:scale-105",
                        active
                          ? "text-primary-foreground"
                          : item.highlight
                          ? "text-primary"
                          : "text-muted-foreground group-hover:text-foreground"
                      )}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={cn(
                        "px-2 py-0.5 text-[11px] font-semibold rounded-full",
                        active
                          ? "bg-white/20 text-white"
                          : item.badgeVariant === "warning"
                          ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                          : "bg-secondary text-secondary-foreground"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Account & Workspace Navigation */}
        <div>
          <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Workspace & Account
          </p>
          <nav className="space-y-1">
            {accountNav.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group",
                    active
                      ? "bg-primary text-primary-foreground shadow-sm shadow-primary/25"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={cn(
                        "h-4 w-4",
                        active
                          ? "text-primary-foreground"
                          : "text-muted-foreground group-hover:text-foreground"
                      )}
                    />
                    <span>{item.label}</span>
                  </div>
                </Link>
              );
            })}
            <Link
              href="/auth"
              onClick={onNavigate}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Disconnetti</span>
            </Link>
          </nav>
        </div>
      </div>

      {/* Bottom Productivity Widget */}
      <div className="p-4 border-t border-border">
        <div className="rounded-xl bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent border border-indigo-500/20 p-3.5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <Sparkles className="h-3.5 w-3.5" />
              </span>
              <span className="text-xs font-semibold text-foreground">
                Stato Redazione
              </span>
            </div>
            <span className="text-xs font-bold text-primary">{completionPct}%</span>
          </div>

          <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${completionPct}%` }}
            />
          </div>

          <div className="flex justify-between text-[11px] text-muted-foreground">
            <span>{publishedCount} pubblicati</span>
            <span>{completedTasksCount}/{ tasks.length } task svolti</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleBackup}
            className="w-full h-8 text-xs gap-1.5 bg-background/70 hover:bg-background"
          >
            <Download className="h-3.5 w-3.5" />
            Salva Backup JSON
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
