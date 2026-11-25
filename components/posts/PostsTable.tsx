"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboard } from "@/components/providers/DashboardProvider";
import { Post, PostStatus } from "@/types/posts";
import PostsPagination from "./PostsPagination";
import { useToast } from "@/components/ui/use-toast";
import {
  Search,
  Plus,
  MoreHorizontal,
  Edit3,
  Copy,
  Trash2,
  Star,
  Eye,
  MessageSquare,
  ArrowUpDown,
  Filter,
  Download,
  BookOpen,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PostsTableProps {
  limit?: number;
  title?: string;
  showControls?: boolean;
  pageSize?: number;
}

const statusConfig: Record<
  PostStatus,
  { label: string; badgeClass: string; dotClass: string }
> = {
  published: {
    label: "Pubblicato",
    badgeClass:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    dotClass: "bg-emerald-500",
  },
  review: {
    label: "In Revisione",
    badgeClass:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    dotClass: "bg-amber-500",
  },
  draft: {
    label: "Bozza",
    badgeClass:
      "bg-slate-500/10 text-slate-600 dark:text-slate-300 border-slate-500/20",
    dotClass: "bg-slate-400",
  },
  archived: {
    label: "Archiviato",
    badgeClass:
      "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    dotClass: "bg-rose-500",
  },
};

const PostsTable = ({
  limit,
  title,
  showControls = true,
  pageSize = 6,
}: PostsTableProps) => {
  const {
    posts,
    categories,
    deletePost,
    duplicatePost,
    updatePostStatus,
    togglePostFeatured,
    exportPostsCsv,
  } = useDashboard();
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "views" | "title">("date");
  const [currentPage, setCurrentPage] = useState(1);
  const [previewPost, setPreviewPost] = useState<Post | null>(null);

  const filteredAndSorted = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = posts.filter((post) => {
      const matchesQuery =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.author.toLowerCase().includes(q) ||
        post.category.toLowerCase().includes(q) ||
        (post.tags && post.tags.some((t) => t.toLowerCase().includes(q)));

      const matchesStatus =
        statusFilter === "all" || post.status === statusFilter;
      const matchesCategory =
        categoryFilter === "all" || post.category === categoryFilter;

      return matchesQuery && matchesStatus && matchesCategory;
    });

    return list.sort((a, b) => {
      if (sortBy === "views") return (b.views || 0) - (a.views || 0);
      if (sortBy === "title") return a.title.localeCompare(b.title);
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [posts, search, statusFilter, categoryFilter, sortBy]);

  const totalPages = limit
    ? 1
    : Math.max(1, Math.ceil(filteredAndSorted.length / pageSize));

  const safePage = Math.min(currentPage, totalPages);

  const displayedPosts = useMemo(() => {
    if (limit) return filteredAndSorted.slice(0, limit);
    const start = (safePage - 1) * pageSize;
    return filteredAndSorted.slice(start, start + pageSize);
  }, [filteredAndSorted, limit, safePage, pageSize]);

  const handleDelete = (id: string, postTitle: string) => {
    deletePost(id);
    toast({
      title: "Articolo eliminato",
      description: `"${postTitle}" è stato rimosso dal catalogo.`,
    });
  };

  const handleDuplicate = (id: string) => {
    const copy = duplicatePost(id);
    if (copy) {
      toast({
        title: "Articolo duplicato",
        description: `Creata bozza "${copy.title}".`,
      });
    }
  };

  const handleStatusChange = (id: string, status: PostStatus) => {
    updatePostStatus(id, status);
    toast({
      title: "Stato aggiornato",
      description: `Lo stato dell'articolo è ora "${statusConfig[status].label}".`,
    });
  };

  const handleExportCsv = () => {
    exportPostsCsv(filteredAndSorted);
    toast({
      title: "Report CSV esportato con successo",
      description: `${filteredAndSorted.length} articoli esportati con colonne formattate per Excel.`,
    });
  };

  return (
    <>
      <Card className="border border-border/80 shadow-sm">
        <CardHeader className="pb-4 border-b border-border/60">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-bold">
                {title ? title : "Catalogo Articoli & Pubblicazioni"}
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                {filteredAndSorted.length} articol
                {filteredAndSorted.length === 1 ? "o" : "i"} trovat
                {filteredAndSorted.length === 1 ? "o" : "i"}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportCsv}
                className="h-9 text-xs gap-1.5"
              >
                <Download className="h-3.5 w-3.5 text-emerald-500" />
                <span>Esporta CSV (Excel)</span>
              </Button>
              <Link href="/posts/new">
                <Button size="sm" className="h-9 text-xs gap-1.5">
                  <Plus className="h-3.5 w-3.5" />
                  <span>Nuovo Articolo</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Search & Filters Bar */}
          {showControls && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-2">
              <div className="relative sm:col-span-2 lg:col-span-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Cerca titolo, autore o tag..."
                  className="pl-9 h-9 text-xs bg-background"
                />
              </div>

              <div className="flex items-center gap-1.5">
                <Filter className="h-3.5 w-3.5 text-muted-foreground shrink-0 hidden sm:block" />
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  aria-label="Filtra per stato"
                  className="w-full h-9 rounded-lg border border-input bg-background px-2.5 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="all">Tutti gli stati</option>
                  <option value="published">Pubblicati</option>
                  <option value="review">In Revisione</option>
                  <option value="draft">Bozze</option>
                  <option value="archived">Archiviati</option>
                </select>
              </div>

              <div>
                <select
                  value={categoryFilter}
                  onChange={(e) => {
                    setCategoryFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  aria-label="Filtra per categoria"
                  className="w-full h-9 rounded-lg border border-input bg-background px-2.5 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="all">Tutte le categorie</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground shrink-0 hidden sm:block" />
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value as "date" | "views" | "title")
                  }
                  aria-label="Ordina per"
                  className="w-full h-9 rounded-lg border border-input bg-background px-2.5 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="date">Ordina: Più recenti</option>
                  <option value="views">Ordina: Più letti</option>
                  <option value="title">Ordina: Titolo (A-Z)</option>
                </select>
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent className="p-0">
          {displayedPosts.length === 0 ? (
            <div className="py-12 px-4 text-center space-y-3">
              <p className="text-sm font-medium text-muted-foreground">
                Nessun articolo corrisponde ai filtri selezionati.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("all");
                  setCategoryFilter("all");
                }}
              >
                Reimposta filtri
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead className="w-[40px] text-center">★</TableHead>
                    <TableHead className="min-w-[240px]">Articolo</TableHead>
                    <TableHead className="hidden lg:table-cell">
                      Categoria
                    </TableHead>
                    <TableHead>Stato</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Autore
                    </TableHead>
                    <TableHead className="hidden sm:table-cell text-right">
                      Metriche
                    </TableHead>
                    <TableHead className="hidden xl:table-cell text-right">
                      Data
                    </TableHead>
                    <TableHead className="text-right pr-4">Azioni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedPosts.map((post) => {
                    const st = statusConfig[post.status || "published"];
                    return (
                      <TableRow
                        key={post.id}
                        className="group transition-colors hover:bg-muted/40"
                      >
                        <TableCell className="text-center">
                          <button
                            type="button"
                            onClick={() => togglePostFeatured(post.id)}
                            title={
                              post.featured
                                ? "Rimuovi da In Evidenza"
                                : "Metti In Evidenza"
                            }
                            className="p-1 rounded hover:bg-accent transition-colors"
                          >
                            <Star
                              className={cn(
                                "h-4 w-4 transition-colors",
                                post.featured
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-muted-foreground/40 hover:text-amber-400"
                              )}
                            />
                          </button>
                        </TableCell>

                        <TableCell>
                          <div className="flex flex-col gap-0.5 max-w-md">
                            <Link
                              href={`/posts/edit/${post.id}`}
                              className="font-semibold text-sm text-foreground hover:text-primary transition-colors line-clamp-1"
                            >
                              {post.title}
                            </Link>
                            {post.excerpt && (
                              <p className="text-xs text-muted-foreground line-clamp-1">
                                {post.excerpt}
                              </p>
                            )}
                            <div className="flex items-center gap-1.5 mt-1 lg:hidden">
                              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground">
                                {post.category}
                              </span>
                              <span className="text-[10px] text-muted-foreground md:hidden">
                                • {post.author}
                              </span>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="hidden lg:table-cell">
                          <span className="inline-flex items-center rounded-md bg-secondary/80 px-2 py-1 text-xs font-medium text-secondary-foreground">
                            {post.category}
                          </span>
                        </TableCell>

                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger className="focus:outline-none">
                              <span
                                className={cn(
                                  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-opacity hover:opacity-80",
                                  st.badgeClass
                                )}
                              >
                                <span
                                  className={cn(
                                    "h-1.5 w-1.5 rounded-full",
                                    st.dotClass
                                  )}
                                />
                                {st.label}
                              </span>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-40">
                              <DropdownMenuLabel className="text-xs">
                                Cambia Stato
                              </DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              {(Object.keys(statusConfig) as PostStatus[]).map(
                                (statusKey) => (
                                  <DropdownMenuItem
                                    key={statusKey}
                                    onClick={() =>
                                      handleStatusChange(post.id, statusKey)
                                    }
                                    className="text-xs cursor-pointer gap-2"
                                  >
                                    <span
                                      className={cn(
                                        "h-2 w-2 rounded-full",
                                        statusConfig[statusKey].dotClass
                                      )}
                                    />
                                    <span>{statusConfig[statusKey].label}</span>
                                  </DropdownMenuItem>
                                )
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>

                        <TableCell className="hidden md:table-cell text-xs font-medium text-muted-foreground">
                          {post.author}
                        </TableCell>

                        <TableCell className="hidden sm:table-cell text-right">
                          <div className="inline-flex items-center justify-end gap-3 text-xs text-muted-foreground">
                            <span
                              className="inline-flex items-center gap-1"
                              title="Visualizzazioni"
                            >
                              <Eye className="h-3.5 w-3.5 text-indigo-500" />
                              {(post.views || 0).toLocaleString("it-IT")}
                            </span>
                            <span
                              className="inline-flex items-center gap-1"
                              title="Commenti"
                            >
                              <MessageSquare className="h-3.5 w-3.5 text-emerald-500" />
                              {post.comments?.length || 0}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="hidden xl:table-cell text-right text-xs text-muted-foreground whitespace-nowrap">
                          {post.date}
                        </TableCell>

                        <TableCell className="text-right pr-4">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setPreviewPost(post)}
                              title="Lettura Rapida"
                              className="h-8 w-8 text-muted-foreground hover:text-primary"
                            >
                              <BookOpen className="h-3.5 w-3.5" />
                            </Button>

                            <Link href={`/posts/edit/${post.id}`}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2.5 text-xs font-medium hover:bg-primary/10 hover:text-primary"
                              >
                                <Edit3 className="h-3.5 w-3.5 sm:mr-1" />
                                <span className="hidden sm:inline">
                                  Modifica
                                </span>
                              </Button>
                            </Link>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem
                                  onClick={() => setPreviewPost(post)}
                                  className="text-xs cursor-pointer gap-2"
                                >
                                  <BookOpen className="h-3.5 w-3.5" />
                                  <span>Lettura Rapida Articolo</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  asChild
                                  className="text-xs cursor-pointer gap-2"
                                >
                                  <Link href={`/posts/edit/${post.id}`}>
                                    <Edit3 className="h-3.5 w-3.5" />
                                    <span>Apri Editor Completo</span>
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDuplicate(post.id)}
                                  className="text-xs cursor-pointer gap-2"
                                >
                                  <Copy className="h-3.5 w-3.5" />
                                  <span>Duplica come Bozza</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleDelete(post.id, post.title)
                                  }
                                  className="text-xs cursor-pointer gap-2 text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                  <span>Elimina Articolo</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}

          {!limit && totalPages > 1 && (
            <div className="pb-5 pt-2 border-t border-border/60">
              <PostsPagination
                currentPage={safePage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Reader Preview Dialog */}
      <Dialog
        open={Boolean(previewPost)}
        onOpenChange={(open) => !open && setPreviewPost(null)}
      >
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {previewPost && (
            <>
              <DialogHeader className="space-y-2 text-left">
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span className="rounded-md bg-primary/10 px-2 py-0.5 font-semibold text-primary">
                    {previewPost.category}
                  </span>
                  <span>•</span>
                  <span>{previewPost.date}</span>
                  <span>•</span>
                  <span>Di {previewPost.author}</span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {Math.max(
                      1,
                      Math.ceil(
                        (previewPost.body?.trim().split(/\s+/).length || 0) /
                          200
                      )
                    )}{" "}
                    min lettura
                  </span>
                </div>
                <DialogTitle className="text-xl sm:text-2xl font-bold leading-snug">
                  {previewPost.title}
                </DialogTitle>
                {previewPost.excerpt && (
                  <DialogDescription className="text-xs sm:text-sm italic border-l-2 border-primary pl-3">
                    {previewPost.excerpt}
                  </DialogDescription>
                )}
              </DialogHeader>

              <div className="py-4 border-y border-border/60 text-sm leading-7 whitespace-pre-line text-foreground">
                {previewPost.body}
              </div>

              {previewPost.tags && previewPost.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {previewPost.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2.5 py-0.5 rounded-full bg-secondary text-secondary-foreground font-medium"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-muted-foreground">
                  {(previewPost.views || 0).toLocaleString("it-IT")} letture •{" "}
                  {previewPost.comments?.length || 0} commenti
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPreviewPost(null)}
                  >
                    Chiudi
                  </Button>
                  <Link href={`/posts/edit/${previewPost.id}`}>
                    <Button size="sm" className="gap-1.5">
                      <Edit3 className="h-3.5 w-3.5" />
                      <span>Modifica nell&apos;Editor</span>
                    </Button>
                  </Link>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PostsTable;
