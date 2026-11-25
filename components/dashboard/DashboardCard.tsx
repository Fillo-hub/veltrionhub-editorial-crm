import React from "react";
import Link from "next/link";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  count: number | string;
  icon: React.ReactElement<LucideIcon>;
  subtitle?: string;
  trend?: string;
  trendUp?: boolean;
  accentClass?: string;
  href?: string;
}

const DashboardCard = ({
  title,
  count,
  icon,
  subtitle,
  trend,
  trendUp = true,
  accentClass = "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
  href,
}: DashboardCardProps) => {
  const content = (
    <Card
      className={cn(
        "relative overflow-hidden border border-border/80 bg-card transition-all duration-200 hover:shadow-md hover:border-primary/30",
        href && "cursor-pointer group"
      )}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {title}
            </p>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {typeof count === "number" ? count.toLocaleString("it-IT") : count}
            </h3>
          </div>
          <div
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105",
              accentClass
            )}
          >
            {icon}
          </div>
        </div>

        {(subtitle || trend) && (
          <div className="mt-4 flex items-center justify-between gap-2 pt-3 border-t border-border/60 text-xs">
            {trend && (
              <span
                className={cn(
                  "inline-flex items-center gap-1 font-semibold px-1.5 py-0.5 rounded-md",
                  trendUp
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                )}
              >
                {trendUp ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {trend}
              </span>
            )}
            {subtitle && (
              <span className="text-muted-foreground truncate">{subtitle}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
};

export default DashboardCard;
