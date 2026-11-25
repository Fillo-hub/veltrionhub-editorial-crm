"use client";

import React from "react";
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
import { useDashboard } from "@/components/providers/DashboardProvider";
import { useToast } from "@/components/ui/use-toast";
import { PostStatus } from "@/types/posts";
import { PlusCircle, Sparkles, Clock, Star } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(3, "Il titolo deve avere almeno 3 caratteri"),
  excerpt: z.string().min(5, "Inserisci un breve sommario dell'articolo"),
  body: z.string().min(15, "Il corpo dell'articolo deve avere almeno 15 caratteri"),
  author: z.string().min(2, "L'autore è obbligatorio"),
  date: z.string().min(1, "La data è obbligatoria"),
  category: z.string().min(1, "Seleziona una categoria"),
  status: z.enum(["published", "draft", "review", "archived"]),
  tagsInput: z.string().optional(),
  featured: z.boolean().optional(),
});

const NewPostPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { addPost, categories, user } = useDashboard();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      excerpt: "",
      body: "",
      author: user.name,
      date: new Date().toISOString().split("T")[0],
      category: categories[0]?.name || "Intelligenza Artificiale",
      status: "published",
      tagsInput: "Innovazione, Tech",
      featured: false,
    },
  });

  const watchedBody = form.watch("body") || "";
  const wordCount = watchedBody.trim()
    ? watchedBody.trim().split(/\s+/).length
    : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const tags = (values.tagsInput || "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const created = addPost({
      title: values.title,
      excerpt: values.excerpt,
      body: values.body,
      author: values.author,
      date: values.date,
      category: values.category,
      status: values.status as PostStatus,
      tags,
      featured: values.featured,
      views: values.status === "published" ? 1 : 0,
    });

    toast({
      title: "Nuovo articolo creato!",
      description: `"${created.title}" è stato aggiunto al catalogo.`,
    });

    router.push("/posts");
  };

  return (
    <div className="space-y-6">
      <div>
        <BackButton text="Torna al Catalogo Articoli" link="/posts" />
        <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary mb-1">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Redazione Contenuti</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Crea Nuovo Articolo
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Redigi un nuovo contenuto, assegna la categoria e scegli se pubblicarlo subito o salvarlo in bozza.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          <div className="lg:col-span-2 space-y-6">
            <Card className="border border-border/80 shadow-sm">
              <CardHeader className="pb-3 border-b border-border/60">
                <CardTitle className="text-base font-bold">
                  Testo & Contenuto
                </CardTitle>
                <CardDescription className="text-xs">
                  Compila titolo, sommario e corpo principale dell&apos;articolo
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-5 space-y-5">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Titolo
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Es. Guida alle architetture cloud-native nel 2025"
                          className="h-11 text-base font-semibold"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Sommario Breve
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Una frase riassuntiva che invogli alla lettura..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                          {wordCount} parole (~{readingTime} min di lettura)
                        </span>
                      </div>
                      <FormControl>
                        <Textarea
                          rows={12}
                          placeholder="Inizia a scrivere il contenuto dell'articolo..."
                          className="leading-relaxed"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border border-border/80 shadow-sm">
              <CardHeader className="pb-3 border-b border-border/60">
                <CardTitle className="text-base font-bold">
                  Dettagli di Pubblicazione
                </CardTitle>
                <CardDescription className="text-xs">
                  Configura visibilità e classificazione
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-5 space-y-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Stato Iniziale
                      </FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                        >
                          <option value="published">🟢 Pubblica Subito</option>
                          <option value="review">🟡 Invia in Revisione</option>
                          <option value="draft">⚪ Salva come Bozza</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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

                <FormField
                  control={form.control}
                  name="author"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Autore
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Data
                      </FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tagsInput"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Tag (separati da virgola)
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="AI, Cloud, Frontend" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-xl border border-border p-3">
                      <div className="space-y-0.5">
                        <FormLabel className="text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
                          <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                          <span>Metti In Evidenza</span>
                        </FormLabel>
                        <p className="text-[11px] text-muted-foreground">
                          Articolo prioritario in cima alle liste
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
                  <PlusCircle className="h-4 w-4" />
                  <span>Salva Nuovo Articolo</span>
                </Button>
              </CardContent>
            </Card>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default NewPostPage;
