"use client";

import React from "react";
import Link from "next/link";
import BackButton from "@/components/BackButton";
import AnalyticsChart from "@/components/dashboard/AnalyticsChart";
import DashboardCard from "@/components/dashboard/DashboardCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDashboard } from "@/components/providers/DashboardProvider";
import { useToast } from "@/components/ui/use-toast";
import analyticsData from "@/data/analytics";
import {
  Eye,
  Users,
  TrendingUp,
  Award,
  Download,
  MessageSquare,
  FileSpreadsheet,
} from "lucide-react";

const AnalyticsPage = () => {
  const { posts, categories, exportPostsCsv, exportAnalyticsCsv } =
    useDashboard();
  const { toast } = useToast();

  const totalViews = posts.reduce((acc, p) => acc + (p.views || 0), 0);
  const totalUniqueVisitors = analyticsData.reduce(
    (acc, item) => acc + item.uv,
    0
  );
  const totalSubscribers = analyticsData.reduce(
    (acc, item) => acc + (item.subscribers || 0),
    0
  );
  const avgEngagement = Math.round(
    analyticsData.reduce((acc, item) => acc + (item.engagement || 75), 0) /
      analyticsData.length
  );

  const topPosts = [...posts]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5);

  const maxPostViews = topPosts[0]?.views || 1;

  const handleExportAnalytics = () => {
    exportAnalyticsCsv();
    toast({
      title: "Report Analytics Mensile scaricato",
      description: "File CSV formattato per Excel con metriche mensili.",
    });
  };

  const handleExportPosts = () => {
    exportPostsCsv();
    toast({
      title: "Report Articoli scaricato",
      description: "File CSV formattato per Excel con tutte le colonne.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <BackButton text="Torna alla Dashboard" link="/" />
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Analytics & Performance Insight
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Metriche dettagliate su traffico, letture, conversione newsletter e rendimento dei contenuti.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportAnalytics}
            className="h-9 text-xs gap-1.5"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-indigo-500" />
            <span>CSV Traffico Mensile</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportPosts}
            className="h-9 text-xs gap-1.5"
          >
            <Download className="h-3.5 w-3.5 text-emerald-500" />
            <span>CSV Articoli (Excel)</span>
          </Button>
        </div>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <DashboardCard
          title="Letture Articoli"
          count={totalViews}
          icon={<Eye className="h-5 w-5" />}
          trend="+22.5% YoY"
          trendUp={true}
          subtitle="Somma letture catalogo"
          accentClass="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
        />
        <DashboardCard
          title="Visitatori Unici Annui"
          count={totalUniqueVisitors}
          icon={<Users className="h-5 w-5" />}
          trend="+14.8% YoY"
          trendUp={true}
          subtitle="Traffico organico e diretto"
          accentClass="bg-sky-500/10 text-sky-600 dark:text-sky-400"
        />
        <DashboardCard
          title="Nuovi Iscritti Newsletter"
          count={totalSubscribers}
          icon={<TrendingUp className="h-5 w-5" />}
          trend="+31.2% YoY"
          trendUp={true}
          subtitle="Conversione da articoli"
          accentClass="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
        />
        <DashboardCard
          title="Indice di Engagement"
          count={`${avgEngagement}%`}
          icon={<Award className="h-5 w-5" />}
          trend="+4.2 pt"
          trendUp={true}
          subtitle="Tempo medio di permanenza"
          accentClass="bg-amber-500/10 text-amber-600 dark:text-amber-400"
        />
      </div>

      {/* Main Interactive Chart */}
      <AnalyticsChart />

      {/* Bottom Breakdown: Top Performing Posts & Category Share */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 5 Articles */}
        <Card className="border border-border/80 shadow-sm">
          <CardHeader className="pb-3 border-b border-border/60">
            <CardTitle className="text-base font-bold">
              Top 5 Articoli Più Letti
            </CardTitle>
            <CardDescription className="text-xs">
              Classifica dei contenuti con il maggior impatto sul traffico
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-5 space-y-4">
            {topPosts.map((post, index) => {
              const pct = Math.round(((post.views || 0) / maxPostViews) * 100);
              return (
                <div key={post.id} className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
                        {index + 1}
                      </span>
                      <Link
                        href={`/posts/edit/${post.id}`}
                        className="font-semibold text-foreground hover:text-primary truncate"
                      >
                        {post.title}
                      </Link>
                    </div>
                    <span className="font-bold text-foreground shrink-0">
                      {(post.views || 0).toLocaleString("it-IT")} letture
                    </span>
                  </div>

                  <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-muted-foreground pl-7">
                    <span>
                      {post.category} • Di {post.author}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {post.comments.length} commenti
                    </span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Category Performance Share */}
        <Card className="border border-border/80 shadow-sm">
          <CardHeader className="pb-3 border-b border-border/60">
            <CardTitle className="text-base font-bold">
              Rendimento per Categoria
            </CardTitle>
            <CardDescription className="text-xs">
              Quota di letture e densità di pubblicazione per area tematica
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-5 space-y-4">
            {categories.map((cat) => {
              const catPosts = posts.filter((p) => p.category === cat.name);
              const catViews = catPosts.reduce(
                (s, p) => s + (p.views || 0),
                0
              );
              const sharePct =
                totalViews > 0 ? Math.round((catViews / totalViews) * 100) : 0;

              return (
                <div
                  key={cat.id}
                  className="p-3 rounded-xl border border-border/70 bg-secondary/20 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="text-xs font-bold text-foreground">
                        {cat.name}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-primary">
                      {sharePct}% del traffico
                    </span>
                  </div>

                  <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${sharePct}%`,
                        backgroundColor: cat.color,
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>{catPosts.length} articoli pubblicati/bozza</span>
                    <span>
                      {catViews.toLocaleString("it-IT")} visualizzazioni
                    </span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;
