"use client";

import React, { useState } from "react";
import Link from "next/link";
import AnalyticsChart from "@/components/dashboard/AnalyticsChart";
import DashboardCard from "@/components/dashboard/DashboardCard";
import PostsTable from "@/components/posts/PostsTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDashboard } from "@/components/providers/DashboardProvider";
import { useToast } from "@/components/ui/use-toast";
import {
  Newspaper,
  Eye,
  CheckSquare,
  MessageCircle,
  Plus,
  CheckCircle2,
  Circle,
  ArrowRight,
  Sparkles,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  const { posts, categories, tasks, user, updateTaskStatus, addTask } =
    useDashboard();
  const { toast } = useToast();
  const [quickTaskTitle, setQuickTaskTitle] = useState("");

  const publishedCount = posts.filter((p) => p.status === "published").length;
  const draftCount = posts.filter((p) => p.status !== "published").length;
  const totalViews = posts.reduce((acc, p) => acc + (p.views || 0), 0);
  const totalComments = posts.reduce(
    (acc, p) => acc + (p.comments?.length || 0),
    0
  );
  const activeTasks = tasks.filter((t) => t.status !== "done");
  const completedTasksCount = tasks.filter((t) => t.status === "done").length;

  const handleQuickAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTaskTitle.trim()) return;
    addTask({
      title: quickTaskTitle.trim(),
      description: "Aggiunto dai promemoria rapidi della dashboard.",
      status: "todo",
      priority: "medium",
      dueDate: new Date(Date.now() + 3 * 86400000).toISOString().split("T")[0],
      assignee: user.name,
      category: categories[0]?.name || "Generale",
    });
    setQuickTaskTitle("");
    toast({
      title: "Task aggiunto",
      description: "Promemoria inserito nella coda di lavoro.",
    });
  };

  const toggleTaskDone = (id: string, currentStatus: string) => {
    const next = currentStatus === "done" ? "todo" : "done";
    updateTaskStatus(id, next);
    toast({
      title: next === "done" ? "Task completato!" : "Task riaperto",
      description: "Lo stato dell'attività è stato aggiornato.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-border/80 bg-gradient-to-r from-indigo-500/10 via-violet-500/5 to-transparent p-5 sm:p-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Workspace Attivo • {user.company}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Bentornato, {user.name.split(" ")[0]}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Hai <strong className="text-foreground">{activeTasks.length} task operativi</strong> in corso e{" "}
            <strong className="text-foreground">{publishedCount} articoli pubblicati</strong> che hanno generato{" "}
            <strong className="text-foreground">{totalViews.toLocaleString("it-IT")} letture</strong>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link href="/tasks">
            <Button variant="outline" size="sm" className="h-9 gap-1.5 bg-background/80">
              <CheckSquare className="h-4 w-4 text-indigo-500" />
              <span>Apri Kanban ({activeTasks.length})</span>
            </Button>
          </Link>
          <Link href="/posts/new">
            <Button size="sm" className="h-9 gap-1.5 shadow-sm">
              <Plus className="h-4 w-4" />
              <span>Scrivi Articolo</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <DashboardCard
          title="Articoli in Catalogo"
          count={posts.length}
          icon={<Newspaper className="h-5 w-5" />}
          trend={`${publishedCount} Pubblicati`}
          trendUp={true}
          subtitle={`${draftCount} in bozza/revisione`}
          accentClass="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
          href="/posts"
        />
        <DashboardCard
          title="Visualizzazioni Totali"
          count={totalViews}
          icon={<Eye className="h-5 w-5" />}
          trend="+18.4% questo mese"
          trendUp={true}
          subtitle={`Media ${Math.round(totalViews / (posts.length || 1)).toLocaleString("it-IT")} / post`}
          accentClass="bg-sky-500/10 text-sky-600 dark:text-sky-400"
          href="/analytics"
        />
        <DashboardCard
          title="Task & Redazione"
          count={`${completedTasksCount}/${tasks.length}`}
          icon={<CheckSquare className="h-5 w-5" />}
          trend={`${activeTasks.length} da completare`}
          trendUp={activeTasks.length <= 3}
          subtitle="Pianificazione editoriale"
          accentClass="bg-amber-500/10 text-amber-600 dark:text-amber-400"
          href="/tasks"
        />
        <DashboardCard
          title="Commenti & Categorie"
          count={totalComments}
          icon={<MessageCircle className="h-5 w-5" />}
          trend={`${categories.length} Categorie`}
          trendUp={true}
          subtitle="Interazioni dei lettori"
          accentClass="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          href="/categories"
        />
      </div>

      {/* Middle Section: Analytics Chart + Quick Editorial Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AnalyticsChart />
        </div>

        {/* Quick Tasks Widget */}
        <Card className="border border-border/80 shadow-sm flex flex-col justify-between">
          <div>
            <CardHeader className="pb-3 border-b border-border/60">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold">
                  Checklist Redazione
                </CardTitle>
                <Link
                  href="/tasks"
                  className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                >
                  <span>Vedi tutti</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
              <CardDescription className="text-xs">
                Spunta le attività completate o aggiungine una al volo
              </CardDescription>
            </CardHeader>

            <CardContent className="p-4 space-y-3">
              {/* Quick Add Form */}
              <form onSubmit={handleQuickAddTask} className="flex gap-2">
                <Input
                  value={quickTaskTitle}
                  onChange={(e) => setQuickTaskTitle(e.target.value)}
                  placeholder="Nuovo promemoria rapido..."
                  className="h-8 text-xs"
                />
                <Button type="submit" size="sm" className="h-8 px-2.5 shrink-0">
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </form>

              {/* Task Items */}
              <div className="space-y-2 max-h-[245px] overflow-y-auto pr-1">
                {tasks.slice(0, 6).map((task) => {
                  const isDone = task.status === "done";
                  return (
                    <div
                      key={task.id}
                      onClick={() => toggleTaskDone(task.id, task.status)}
                      className={cn(
                        "flex items-start gap-2.5 p-2.5 rounded-xl border text-left cursor-pointer transition-all",
                        isDone
                          ? "bg-muted/30 border-border/40 opacity-60"
                          : "bg-card hover:bg-accent/50 border-border/80"
                      )}
                    >
                      <button
                        type="button"
                        className="mt-0.5 text-primary shrink-0"
                        aria-label="Cambia stato task"
                      >
                        {isDone ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <Circle className="h-4 w-4 text-muted-foreground hover:text-primary" />
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <p
                          className={cn(
                            "text-xs font-semibold leading-snug line-clamp-2",
                            isDone && "line-through text-muted-foreground"
                          )}
                        >
                          {task.title}
                        </p>
                        <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground">
                          <span
                            className={cn(
                              "px-1.5 py-0.2 rounded font-semibold uppercase",
                              task.priority === "high"
                                ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                                : task.priority === "medium"
                                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                : "bg-slate-500/10 text-slate-500"
                            )}
                          >
                            {task.priority === "high"
                              ? "Alta"
                              : task.priority === "medium"
                              ? "Media"
                              : "Bassa"}
                          </span>
                          <span className="inline-flex items-center gap-0.5">
                            <Calendar className="h-2.5 w-2.5" />
                            {task.dueDate}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </div>

          <div className="p-4 pt-0">
            <Link href="/tasks">
              <Button
                variant="secondary"
                size="sm"
                className="w-full h-8 text-xs font-medium"
              >
                Gestisci Board Kanban Completa
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Bottom: Posts Table */}
      <PostsTable title="Articoli & Contenuti Recenti" limit={6} showControls={true} />
    </div>
  );
}
