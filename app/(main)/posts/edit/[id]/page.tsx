"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import BackButton from "@/components/BackButton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDashboard } from "@/components/providers/DashboardProvider";
import { useToast } from "@/components/ui/use-toast";
import { PostStatus } from "@/types/posts";
import {
  Save,
  Trash2,
  Eye,
  FileText,
  MessageSquare,
  Plus,
  Clock,
  Star,
  Tag,
} from "lucide-react";

const formSchema = z.object({
  title: z.string().min(3, {
    message: "Il titolo deve contenere almeno 3 caratteri",
  }),
  excerpt: z.string().optional(),
  body: z.string().min(10, {
    message: "Il contenuto dell'articolo deve contenere almeno 10 caratteri",
  }),
  author: z.string().min(2, {
    message: "Il nome dell'autore è obbligatorio",
  }),
  date: z.string().min(1, {
    message: "La data è obbligatoria",
  }),
  category: z.string().min(1, {
    message: "Seleziona una categoria",
  }),
  status: z.enum(["published", "draft", "review", "archived"]),
  tagsInput: z.string().optional(),
  featured: z.boolean().optional(),
});

interface PostEditPageProps {
  params: {
    id: string;
  };
}

const PostEditPage = ({ params }: PostEditPageProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const {
    posts,
    categories,
    user,
    updatePost,
    deletePost,
    addComment,
    deleteComment,
  } = useDashboard();

  const post = posts.find((p) => p.id === params.id);
  const [commentText, setCommentText] = useState("");
  const [commentAuthor, setCommentAuthor] = useState(user.name);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: post?.title || "",
      excerpt: post?.excerpt || "",
      body: post?.body || "",
      author: post?.author || user.name,
      date: post?.date || new Date().toISOString().split("T")[0],
      category: post?.category || categories[0]?.name || "Intelligenza Artificiale",
      status: post?.status || "published",
      tagsInput: post?.tags?.join(", ") || "",
      featured: post?.featured || false,
    },
  });

  // Sync form when localStorage finishes hydrating
  useEffect(() => {
    if (post) {
      form.reset({
        title: post.title,
        excerpt: post.excerpt || "",
        body: post.body,
        author: post.author,
        date: post.date,
        category: post.category,
        status: post.status || "published",
        tagsInput: post.tags?.join(", ") || "",
        featured: Boolean(post.featured),
      });
    }
  }, [post?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const watchedBody = form.watch("body") || "";
  const watchedTitle = form.watch("title") || "";
  const watchedExcerpt = form.watch("excerpt") || "";
  const watchedTags = (form.watch("tagsInput") || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const wordCount = watchedBody.trim()
    ? watchedBody.trim().split(/\s+/).length
    : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  if (!post) {
    return (
      <div className="py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold">Articolo non trovato</h2>
        <p className="text-sm text-muted-foreground">
          L&apos;articolo richiesto non esiste o è stato rimosso.
        </p>
        <Button onClick={() => router.push("/posts")}>
          Torna agli Articoli
        </Button>
      </div>
    );
  }

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const parsedTags = (values.tagsInput || "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    updatePost(post.id, {
      title: values.title,
      excerpt: values.excerpt,
      body: values.body,
      author: values.author,
      date: values.date,
      category: values.category,
      status: values.status as PostStatus,
      tags: parsedTags,
      featured: values.featured,
    });

    toast({
      title: "Modifiche salvate con successo",
      description: `"${values.title}" è stato aggiornato da ${values.author}.`,
    });
  };

  const handleDeletePost = () => {
    deletePost(post.id);
    toast({
      title: "Articolo eliminato",
      description: `"${post.title}" è stato rimosso definitivamente.`,
    });
    router.push("/posts");
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(post.id, commentAuthor || user.name, commentText);
    setCommentText("");
    toast({
      title: "Commento aggiunto",
      description: "La nota o commento è stato registrato sull'articolo.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <BackButton text="Torna al Catalogo Articoli" link="/posts" />
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Editor Articolo
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            ID #{post.id} • {wordCount} parole • Tempo di lettura stimato: ~{readingTime} min
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleDeletePost}
            className="text-destructive hover:bg-destructive/10 hover:text-destructive gap-1.5"
          >
            <Trash2 className="h-4 w-4" />
            <span>Elimina</span>
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={form.handleSubmit(handleSubmit)}
            className="gap-1.5 shadow-sm"
          >
            <Save className="h-4 w-4" />
            <span>Salva Modifiche</span>
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Left Column: Content & Live Preview */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border border-border/80 shadow-sm">
              <Tabs defaultValue="editor" className="w-full">
                <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-bold">
                      Contenuto Principale
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Modifica il testo o passa all&apos;anteprima di lettura
                    </CardDescription>
                  </div>
                  <TabsList className="h-8">
                    <TabsTrigger value="editor" className="text-xs gap-1.5 px-2.5 py-1">
                      <FileText className="h-3.5 w-3.5" />
                      <span>Editor</span>
                    </TabsTrigger>
                    <TabsTrigger value="preview" className="text-xs gap-1.5 px-2.5 py-1">
                      <Eye className="h-3.5 w-3.5" />
                      <span>Anteprima</span>
                    </TabsTrigger>
                  </TabsList>
                </CardHeader>

                <CardContent className="pt-5">
                  <TabsContent value="editor" className="space-y-5 mt-0">
                    {/* Title */}
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Titolo dell&apos;Articolo
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Inserisci un titolo chiaro e incisivo..."
                              className="text-base font-semibold h-11"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Excerpt */}
                    <FormField
                      control={form.control}
                      name="excerpt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Sommario / Sottotitolo (Excerpt)
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Breve riassunto visibile nelle anteprime e nelle tabelle..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Body */}
                    <FormField
                      control={form.control}
                      name="body"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                              Corpo dell&apos;Articolo
                            </FormLabel>
                            <span className="text-[11px] text-muted-foreground inline-flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {wordCount} parole (~{readingTime} min)
                            </span>
                          </div>
                          <FormControl>
                            <Textarea
                              rows={12}
                              placeholder="Scrivi qui il contenuto completo dell'articolo..."
                              className="leading-relaxed resize-y font-normal"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>

                  <TabsContent value="preview" className="mt-0">
                    <div className="rounded-xl border border-border/60 bg-background/60 p-6 space-y-4">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="rounded-md bg-primary/10 px-2 py-0.5 font-semibold text-primary">
                          {form.watch("category")}
                        </span>
                        <span>•</span>
                        <span>{form.watch("date")}</span>
                        <span>•</span>
                        <span>Di {form.watch("author")}</span>
                      </div>

                      <h2 className="text-2xl font-bold tracking-tight text-foreground">
                        {watchedTitle || "Titolo dell'articolo..."}
                      </h2>

                      {watchedExcerpt && (
                        <p className="text-sm font-medium text-muted-foreground italic border-l-2 border-primary pl-3">
                          {watchedExcerpt}
                        </p>
                      )}

                      <div className="prose dark:prose-invert max-w-none text-sm leading-7 whitespace-pre-line pt-2 border-t border-border/50">
                        {watchedBody || "Nessun contenuto inserito."}
                      </div>

                      {watchedTags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-4 border-t border-border/50">
                          {watchedTags.map((t, idx) => (
                            <span
                              key={idx}
                              className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>

            {/* Comments & Editorial Notes Section */}
            <Card className="border border-border/80 shadow-sm">
              <CardHeader className="pb-3 border-b border-border/60">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  <span>Commenti & Note Redazionali ({post.comments.length})</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Modera i commenti dei lettori o aggiungi una nota di revisione
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    value={commentAuthor}
                    onChange={(e) => setCommentAuthor(e.target.value)}
                    placeholder="Tuo nome"
                    className="sm:w-40 h-9 text-xs"
                  />
                  <Input
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Aggiungi un commento o nota editoriale..."
                    className="flex-1 h-9 text-xs"
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleAddComment}
                    className="h-9 gap-1.5 shrink-0"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Aggiungi</span>
                  </Button>
                </div>

                {post.comments.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-4 text-center">
                    Nessun commento presente per questo articolo.
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {post.comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="flex items-start justify-between gap-3 rounded-xl border border-border/70 bg-secondary/20 p-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-foreground">
                              @{comment.username}
                            </span>
                            {comment.date && (
                              <span className="text-[10px] text-muted-foreground">
                                {comment.date}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {comment.text}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteComment(post.id, comment.id)}
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          title="Elimina commento"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Publishing Metadata */}
          <div className="space-y-6">
            <Card className="border border-border/80 shadow-sm">
              <CardHeader className="pb-3 border-b border-border/60">
                <CardTitle className="text-base font-bold">
                  Impostazioni Pubblicazione
                </CardTitle>
                <CardDescription className="text-xs">
                  Stato visibilità, categoria e metadati autore
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-5 space-y-4">
                {/* Status */}
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Stato Articolo
                      </FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                        >
                          <option value="published">🟢 Pubblicato</option>
                          <option value="review">🟡 In Revisione</option>
                          <option value="draft">⚪ Bozza</option>
                          <option value="archived">🔴 Archiviato</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Category */}
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Categoria
                      </FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                        >
                          {categories.map((c) => (
                            <option key={c.id} value={c.name}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Author */}
                <FormField
                  control={form.control}
                  name="author"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Autore
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Nome autore" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Date */}
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Data di Pubblicazione
                      </FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Tags */}
                <FormField
                  control={form.control}
                  name="tagsInput"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        <span>Tag (separati da virgola)</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Es. Next.js, AI, Design"
                          {...field}
                        />
                      </FormControl>
                      {watchedTags.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {watchedTags.map((tag, i) => (
                            <span
                              key={i}
                              className="rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Featured Checkbox */}
                <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-xl border border-border p-3">
                      <div className="space-y-0.5">
                        <FormLabel className="text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
                          <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                          <span>Articolo In Evidenza</span>
                        </FormLabel>
                        <p className="text-[11px] text-muted-foreground">
                          Mostra con stella prioritaria nel catalogo
                        </p>
                      </div>
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-4 w-4 accent-indigo-600 rounded cursor-pointer"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full gap-2 shadow-sm">
                  <Save className="h-4 w-4" />
                  <span>Salva e Aggiorna Articolo</span>
                </Button>
              </CardContent>
            </Card>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PostEditPage;
