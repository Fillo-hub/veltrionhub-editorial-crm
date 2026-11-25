"use client";

import React, { useState } from "react";
import Link from "next/link";
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
import { Textarea } from "@/components/ui/textarea";
import { useDashboard } from "@/components/providers/DashboardProvider";
import { useToast } from "@/components/ui/use-toast";
import { CategoryItem } from "@/types/posts";
import {
  FolderKanban,
  Plus,
  Trash2,
  Edit3,
  Newspaper,
  Eye,
  ArrowUpRight,
  X,
  Save,
} from "lucide-react";

const presetColors = [
  "#6366f1", // Indigo
  "#0ea5e9", // Sky
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#ec4899", // Pink
  "#8b5cf6", // Violet
  "#ef4444", // Red
];

const CategoriesPage = () => {
  const {
    categories,
    posts,
    addCategory,
    updateCategory,
    deleteCategory,
  } = useDashboard();
  const { toast } = useToast();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(presetColors[0]);

  const startEdit = (cat: CategoryItem) => {
    setEditingId(cat.id);
    setName(cat.name);
    setDescription(cat.description);
    setColor(cat.color);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setName("");
    setDescription("");
    setColor(presetColors[0]);
  };

  const handleSubmitCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const slug = name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    if (editingId) {
      updateCategory(editingId, {
        name: name.trim(),
        slug,
        description:
          description.trim() ||
          "Categoria tematica per la classificazione degli articoli.",
        color,
      });
      toast({
        title: "Categoria aggiornata",
        description: `Le modifiche a "${name.trim()}" sono state salvate.`,
      });
      cancelEdit();
    } else {
      addCategory({
        name: name.trim(),
        slug,
        description:
          description.trim() ||
          "Categoria tematica per la classificazione degli articoli.",
        color,
      });

      toast({
        title: "Categoria creata",
        description: `La categoria "${name.trim()}" è ora disponibile.`,
      });

      setName("");
      setDescription("");
    }
  };

  const handleDelete = (id: string, catName: string) => {
    if (editingId === id) cancelEdit();
    deleteCategory(id);
    toast({
      title: "Categoria rimossa",
      description: `"${catName}" è stata eliminata.`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <BackButton text="Torna alla Dashboard" link="/" />
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Categorie & Tassonomia
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Organizza i contenuti per area tematica, modifica i colori e monitora le letture generate da ciascuna sezione.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Add / Edit Category Form */}
        <Card className="border border-border/80 shadow-sm h-fit">
          <CardHeader className="pb-3 border-b border-border/60">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <FolderKanban className="h-4 w-4 text-primary" />
                <span>
                  {editingId ? "Modifica Categoria" : "Nuova Categoria"}
                </span>
              </CardTitle>
              {editingId && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={cancelEdit}
                  className="h-7 w-7"
                  title="Annulla modifica"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <CardDescription className="text-xs">
              {editingId
                ? "Aggiorna nome, descrizione o colore identificativo"
                : "Aggiungi una nuova sezione editoriale al workspace"}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-5">
            <form onSubmit={handleSubmitCategory} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Nome Categoria
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Es. Data Science & Analytics"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Descrizione
                </label>
                <Textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descrivi gli argomenti trattati in questa categoria..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Colore Identificativo
                </label>
                <div className="flex items-center gap-2">
                  {presetColors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className="h-7 w-7 rounded-full transition-transform flex items-center justify-center"
                      style={{
                        backgroundColor: c,
                        transform: color === c ? "scale(1.15)" : "scale(1)",
                        boxShadow:
                          color === c
                            ? `0 0 0 2px hsl(var(--background)), 0 0 0 4px ${c}`
                            : "none",
                      }}
                      aria-label={`Seleziona colore ${c}`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                {editingId && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={cancelEdit}
                    className="flex-1"
                  >
                    Annulla
                  </Button>
                )}
                <Button type="submit" className="flex-1 gap-1.5">
                  {editingId ? (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Salva Modifiche</span>
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      <span>Crea Categoria</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Right: Categories Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categories.map((cat) => {
            const catPosts = posts.filter((p) => p.category === cat.name);
            const totalViews = catPosts.reduce(
              (sum, p) => sum + (p.views || 0),
              0
            );

            return (
              <Card
                key={cat.id}
                className="border border-border/80 shadow-sm flex flex-col justify-between hover:border-primary/30 transition-all"
              >
                <div>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="h-3.5 w-3.5 rounded-full shrink-0"
                          style={{ backgroundColor: cat.color }}
                        />
                        <CardTitle className="text-base font-bold">
                          {cat.name}
                        </CardTitle>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => startEdit(cat)}
                          className="h-7 w-7 text-muted-foreground hover:text-primary"
                          title="Modifica categoria"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(cat.id, cat.name)}
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          title="Elimina categoria"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                    <CardDescription className="text-xs pt-1">
                      {cat.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-3 pt-2">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground border-y border-border/60 py-2.5">
                      <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                        <Newspaper className="h-3.5 w-3.5 text-indigo-500" />
                        {catPosts.length} articol
                        {catPosts.length === 1 ? "o" : "i"}
                      </span>
                      <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                        <Eye className="h-3.5 w-3.5 text-sky-500" />
                        {totalViews.toLocaleString("it-IT")} letture
                      </span>
                    </div>

                    {catPosts.length > 0 ? (
                      <div className="space-y-1.5">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                          Ultimi articoli:
                        </p>
                        {catPosts.slice(0, 2).map((p) => (
                          <Link
                            key={p.id}
                            href={`/posts/edit/${p.id}`}
                            className="flex items-center justify-between text-xs text-muted-foreground hover:text-primary transition-colors py-0.5"
                          >
                            <span className="truncate pr-2">{p.title}</span>
                            <ArrowUpRight className="h-3 w-3 shrink-0" />
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground italic">
                        Nessun articolo associato.
                      </p>
                    )}
                  </CardContent>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
