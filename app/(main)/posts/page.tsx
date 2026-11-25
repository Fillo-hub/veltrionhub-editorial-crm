"use client";

import React from "react";
import BackButton from "@/components/BackButton";
import PostsTable from "@/components/posts/PostsTable";
import { useDashboard } from "@/components/providers/DashboardProvider";
import { CheckCircle2, Clock, FileEdit, Archive } from "lucide-react";

const PostsPage = () => {
  const { posts } = useDashboard();

  const counts = {
    published: posts.filter((p) => p.status === "published").length,
    review: posts.filter((p) => p.status === "review").length,
    draft: posts.filter((p) => p.status === "draft").length,
    archived: posts.filter((p) => p.status === "archived").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <BackButton text="Torna alla Dashboard" link="/" />
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Gestione Articoli
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Cerca, filtra, modifica lo stato di pubblicazione o crea nuovi contenuti editoriali.
          </p>
        </div>
      </div>

      {/* Status Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="flex items-center gap-3 rounded-xl border border-border/80 bg-card p-3.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-bold leading-none">{counts.published}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Pubblicati</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-border/80 bg-card p-3.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-bold leading-none">{counts.review}</p>
            <p className="text-xs text-muted-foreground mt-0.5">In Revisione</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-border/80 bg-card p-3.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-500/10 text-slate-500">
            <FileEdit className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-bold leading-none">{counts.draft}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Bozze</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-border/80 bg-card p-3.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-500/10 text-rose-500">
            <Archive className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-bold leading-none">{counts.archived}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Archiviati</p>
          </div>
        </div>
      </div>

      <PostsTable showControls={true} pageSize={6} />
    </div>
  );
};

export default PostsPage;
