"use client";

import React, { useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import data from "@/data/analytics";
import { useDashboard } from "@/components/providers/DashboardProvider";
import { BarChart2, TrendingUp, Users } from "lucide-react";
import { cn } from "@/lib/utils";

type ChartMode = "traffic" | "subscribers" | "categories";
type TimeRange = "all" | "h1" | "h2";

const AnalyticsChart = () => {
  const { posts, categories } = useDashboard();
  const [chartMode, setChartMode] = useState<ChartMode>("traffic");
  const [timeRange, setTimeRange] = useState<TimeRange>("all");

  const filteredData = React.useMemo(() => {
    if (timeRange === "h1") return data.slice(0, 6);
    if (timeRange === "h2") return data.slice(6, 12);
    return data;
  }, [timeRange]);

  const categoryChartData = React.useMemo(() => {
    return categories.map((cat) => {
      const catPosts = posts.filter((p) => p.category === cat.name);
      const totalViews = catPosts.reduce((acc, p) => acc + (p.views || 0), 0);
      return {
        name: cat.name.length > 18 ? cat.name.slice(0, 16) + "…" : cat.name,
        fullName: cat.name,
        articoli: catPosts.length,
        letture: totalViews,
      };
    });
  }, [posts, categories]);

  return (
    <Card className="border border-border/80 shadow-sm">
      <CardHeader className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-border/60">
        <div>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            Andamento & Performance Editoriale
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Analisi interattiva di letture mensili, visitatori unici, iscritti e resa per categoria
          </CardDescription>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Chart Mode Tabs */}
          <div className="inline-flex rounded-lg border border-border bg-secondary/50 p-1">
            <button
              type="button"
              onClick={() => setChartMode("traffic")}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all",
                chartMode === "traffic"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <TrendingUp className="h-3.5 w-3.5 text-indigo-500" />
              <span>Traffico</span>
            </button>
            <button
              type="button"
              onClick={() => setChartMode("subscribers")}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all",
                chartMode === "subscribers"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Users className="h-3.5 w-3.5 text-emerald-500" />
              <span>Iscritti & Engagement</span>
            </button>
            <button
              type="button"
              onClick={() => setChartMode("categories")}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all",
                chartMode === "categories"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <BarChart2 className="h-3.5 w-3.5 text-amber-500" />
              <span>Per Categoria</span>
            </button>
          </div>

          {/* Period Filter */}
          {chartMode !== "categories" && (
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as TimeRange)}
              aria-label="Filtra periodo"
              className="h-8 rounded-lg border border-border bg-background px-2.5 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="all">Tutto l&apos;anno (12 mesi)</option>
              <option value="h1">1° Semestre (Gen - Giu)</option>
              <option value="h2">2° Semestre (Lug - Dic)</option>
            </select>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="w-full h-[310px]">
          <ResponsiveContainer width="100%" height="100%">
            {chartMode === "traffic" ? (
              <AreaChart
                data={filteredData}
                margin={{ top: 10, right: 16, left: -10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} vertical={false} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: "#94a3b8" }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: "#94a3b8" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "0.75rem",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
                <Area
                  type="monotone"
                  dataKey="pv"
                  name="Visualizzazioni Pagina"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorPv)"
                />
                <Area
                  type="monotone"
                  dataKey="uv"
                  name="Visitatori Unici"
                  stroke="#0ea5e9"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorUv)"
                />
              </AreaChart>
            ) : chartMode === "subscribers" ? (
              <AreaChart
                data={filteredData}
                margin={{ top: 10, right: 16, left: -10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorSub" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} vertical={false} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: "#94a3b8" }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: "#94a3b8" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "0.75rem",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
                <Area
                  type="monotone"
                  dataKey="subscribers"
                  name="Nuovi Iscritti Newsletter"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorSub)"
                />
              </AreaChart>
            ) : (
              <BarChart
                data={categoryChartData}
                margin={{ top: 10, right: 16, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} vertical={false} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: "#94a3b8" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "0.75rem",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
                <Bar
                  dataKey="letture"
                  name="Letture Totali Categoria"
                  fill="#6366f1"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsChart;
