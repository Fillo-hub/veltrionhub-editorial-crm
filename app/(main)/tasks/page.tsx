"use client";

import React, { useState } from "react";
import BackButton from "@/components/BackButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDashboard } from "@/components/providers/DashboardProvider";
import { useToast } from "@/components/ui/use-toast";
import { TaskPriority, TaskStatus } from "@/types/posts";
import {
  Plus,
  Trash2,
  Calendar,
  User,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  ListTodo,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";

const columns: {
  id: TaskStatus;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  accent: string;
}[] = [
  {
    id: "todo",
    title: "Da Fare",
    subtitle: "In attesa di presa in carico",
    icon: ListTodo,
    accent: "text-slate-500 bg-slate-500/10",
  },
  {
    id: "in_progress",
    title: "In Lavorazione",
    subtitle: "Attività attualmente in corso",
    icon: Clock,
    accent: "text-amber-500 bg-amber-500/10",
  },
  {
    id: "done",
    title: "Completati",
    subtitle: "Revisionati e portati a termine",
    icon: CheckCircle2,
    accent: "text-emerald-500 bg-emerald-500/10",
  },
];

const priorityBadge: Record<TaskPriority, { label: string; className: string }> = {
  high: {
    label: "Alta Priorità",
    className:
      "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  },
  medium: {
    label: "Media",
    className:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  low: {
    label: "Bassa",
    className:
      "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
  },
};

const TasksPage = () => {
  const {
    tasks,
    categories,
    user,
    addTask,
    updateTaskStatus,
    deleteTask,
    exportTasksCsv,
  } = useDashboard();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 5 * 86400000).toISOString().split("T")[0]
  );
  const [assignee, setAssignee] = useState(user.name);
  const [category, setCategory] = useState(categories[0]?.name || "Generale");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTask({
      title: title.trim(),
      description:
        description.trim() || "Attività pianificata nella board redazionale.",
      status: "todo",
      priority,
      dueDate,
      assignee: assignee.trim() || user.name,
      category,
    });

    toast({
      title: "Nuovo task creato",
      description: `"${title.trim()}" è stato aggiunto alla colonna Da Fare.`,
    });

    setTitle("");
    setDescription("");
  };

  const handleExportTasks = () => {
    exportTasksCsv();
    toast({
      title: "Report Task CSV scaricato",
      description: "Le attività sono state esportate in colonne formattate per Excel.",
    });
  };

  const filteredTasks = tasks.filter(
    (t) => priorityFilter === "all" || t.priority === priorityFilter
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <BackButton text="Torna alla Dashboard" link="/" />
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Board Task & Pianificazione Kanban
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Organizza il lavoro editoriale, assegna le priorità e sposta le attività lungo il flusso di produzione.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            aria-label="Filtra per priorità"
            className="h-9 rounded-lg border border-input bg-background px-3 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="all">Tutte le priorità</option>
            <option value="high">Solo Alta Priorità</option>
            <option value="medium">Solo Media Priorità</option>
            <option value="low">Solo Bassa Priorità</option>
          </select>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportTasks}
            className="h-9 text-xs gap-1.5"
          >
            <Download className="h-3.5 w-3.5 text-emerald-500" />
            <span>Esporta CSV (Excel)</span>
          </Button>
        </div>
      </div>

      {/* New Task Creation Card */}
      <Card className="border border-border/80 shadow-sm">
        <CardHeader className="pb-3 border-b border-border/60">
          <CardTitle className="text-base font-bold">
            Aggiungi Nuova Attività
          </CardTitle>
          <CardDescription className="text-xs">
            Pianifica una revisione, un articolo o un&apos;attività tecnica per il team
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <form
            onSubmit={handleAddTask}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2.5"
          >
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titolo attività (es. Revisione guida AI)..."
              className="sm:col-span-2 h-9 text-xs"
              required
            />
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Note operative..."
              className="h-9 text-xs"
            />
            <Input
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              placeholder="Assegnatario..."
              className="h-9 text-xs"
            />
            <div className="flex gap-2">
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                aria-label="Priorità"
                className="w-1/2 h-9 rounded-lg border border-input bg-background px-2 text-xs font-medium text-foreground"
              >
                <option value="high">🔴 Alta</option>
                <option value="medium">🟡 Media</option>
                <option value="low">⚪ Bassa</option>
              </select>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-1/2 h-9 text-xs px-2"
              />
            </div>
            <Button type="submit" size="sm" className="h-9 gap-1.5">
              <Plus className="h-4 w-4" />
              <span>Aggiungi Task</span>
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* 3-Column Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {columns.map((col) => {
          const ColIcon = col.icon;
          const colTasks = filteredTasks.filter((t) => t.status === col.id);

          return (
            <div
              key={col.id}
              className="flex flex-col rounded-2xl border border-border/80 bg-secondary/25 p-4 space-y-4 min-h-[420px]"
            >
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg",
                      col.accent
                    )}
                  >
                    <ColIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold leading-none">
                      {col.title}
                    </h3>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      {col.subtitle}
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-background border border-border px-2.5 py-0.5 text-xs font-bold">
                  {colTasks.length}
                </span>
              </div>

              <div className="space-y-3 flex-1">
                {colTasks.length === 0 ? (
                  <div className="h-40 flex items-center justify-center rounded-xl border border-dashed border-border text-xs text-muted-foreground">
                    Nessun task in questa colonna
                  </div>
                ) : (
                  colTasks.map((task) => {
                    const pBadge = priorityBadge[task.priority];
                    return (
                      <Card
                        key={task.id}
                        className="border border-border/80 bg-card shadow-sm hover:border-primary/40 transition-all"
                      >
                        <CardContent className="p-4 space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <span
                              className={cn(
                                "inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase",
                                pBadge.className
                              )}
                            >
                              {pBadge.label}
                            </span>

                            <button
                              type="button"
                              onClick={() => {
                                deleteTask(task.id);
                                toast({
                                  title: "Task rimosso",
                                  description: `"${task.title}" è stato eliminato.`,
                                });
                              }}
                              className="text-muted-foreground hover:text-destructive transition-colors"
                              title="Elimina task"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          <div className="space-y-1">
                            <h4
                              className={cn(
                                "text-sm font-bold leading-snug",
                                task.status === "done" &&
                                  "line-through text-muted-foreground"
                              )}
                            >
                              {task.title}
                            </h4>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              {task.description}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-border/60 text-[11px] text-muted-foreground">
                            <span className="inline-flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {task.assignee}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {task.dueDate}
                            </span>
                          </div>

                          {/* Status Move Buttons */}
                          <div className="flex items-center justify-between gap-2 pt-1">
                            {task.status !== "todo" ? (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-7 text-[11px] px-2 gap-1"
                                onClick={() =>
                                  updateTaskStatus(
                                    task.id,
                                    task.status === "done"
                                      ? "in_progress"
                                      : "todo"
                                  )
                                }
                              >
                                <ArrowLeft className="h-3 w-3" />
                                <span>Indietro</span>
                              </Button>
                            ) : (
                              <div />
                            )}

                            {task.status !== "done" && (
                              <Button
                                type="button"
                                size="sm"
                                className="h-7 text-[11px] px-2.5 gap-1 ml-auto"
                                onClick={() =>
                                  updateTaskStatus(
                                    task.id,
                                    task.status === "todo"
                                      ? "in_progress"
                                      : "done"
                                  )
                                }
                              >
                                <span>
                                  {task.status === "todo"
                                    ? "Avvia Lavoro"
                                    : "Segna Completato"}
                                </span>
                                <ArrowRight className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TasksPage;
