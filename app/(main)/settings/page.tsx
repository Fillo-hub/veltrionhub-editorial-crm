"use client";

import React, { useRef } from "react";
import BackButton from "@/components/BackButton";
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
import { useTheme } from "next-themes";
import {
  Download,
  Upload,
  RotateCcw,
  Sun,
  Moon,
  Monitor,
  Database,
  FileSpreadsheet,
  ShieldCheck,
} from "lucide-react";

const SettingsPage = () => {
  const {
    posts,
    categories,
    tasks,
    exportWorkspaceJson,
    exportPostsCsv,
    exportTasksCsv,
    exportAnalyticsCsv,
    importWorkspaceJson,
    resetWorkspace,
  } = useDashboard();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const ok = importWorkspaceJson(content);
      if (ok) {
        toast({
          title: "Backup importato con successo!",
          description:
            "Articoli, categorie, task e profilo sono stati ripristinati.",
        });
      } else {
        toast({
          title: "Errore durante l'importazione",
          description: "Il file selezionato non è un backup JSON valido.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleReset = () => {
    resetWorkspace();
    toast({
      title: "Workspace ripristinato ai dati iniziali",
      description: "Tutti i dati demo predefiniti sono stati ricaricati.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <BackButton text="Torna alla Dashboard" link="/" />
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Impostazioni & Gestione Dati
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Personalizza l&apos;aspetto dell&apos;interfaccia, esporta i tuoi dati in fogli CSV ordinati per Excel o salva un backup JSON.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Theme & Appearance */}
        <Card className="border border-border/80 shadow-sm h-fit">
          <CardHeader className="pb-3 border-b border-border/60">
            <CardTitle className="text-base font-bold">
              Aspetto & Tema Interfaccia
            </CardTitle>
            <CardDescription className="text-xs">
              Scegli la modalità visiva preferita per lavorare comodamente di giorno o di sera
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-5 space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setTheme("light")}
                className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-xs font-semibold transition-all ${
                  theme === "light"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-background hover:bg-accent"
                }`}
              >
                <Sun className="h-5 w-5 text-amber-500" />
                <span>Chiaro</span>
              </button>

              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-xs font-semibold transition-all ${
                  theme === "dark"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-background hover:bg-accent"
                }`}
              >
                <Moon className="h-5 w-5 text-indigo-400" />
                <span>Scuro</span>
              </button>

              <button
                type="button"
                onClick={() => setTheme("system")}
                className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-xs font-semibold transition-all ${
                  theme === "system"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-background hover:bg-accent"
                }`}
              >
                <Monitor className="h-5 w-5 text-muted-foreground" />
                <span>Sistema</span>
              </button>
            </div>

            <div className="rounded-xl border border-border/70 bg-secondary/30 p-3.5 flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
              <div className="text-xs text-muted-foreground space-y-1">
                <p className="font-semibold text-foreground">
                  Salvataggio Automatico & Compatibilità Excel
                </p>
                <p>
                  Ogni modifica viene salvata nel browser (`localStorage`). I file CSV esportati includono codifica UTF-8 BOM e separatore `;` nativo per aprire automaticamente ogni dato nella giusta colonna su Microsoft Excel.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Portability: Backup, Export & Reset */}
        <Card className="border border-border/80 shadow-sm">
          <CardHeader className="pb-3 border-b border-border/60">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Database className="h-4 w-4 text-primary" />
              <span>Portabilità Dati, Fogli Excel & Backup</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Stato attuale: {posts.length} articoli, {categories.length} categorie, {tasks.length} task
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-5 space-y-3">
            <div className="flex items-center justify-between gap-2 rounded-xl border border-border p-3.5">
              <div>
                <p className="text-xs font-bold">
                  Esporta Catalogo Articoli (CSV per Excel)
                </p>
                <p className="text-[11px] text-muted-foreground">
                  13 colonne ordinate: Codice, Titolo, Categoria, Stato, Data, Letture, Parole...
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  exportPostsCsv();
                  toast({
                    title: "Catalogo Articoli CSV esportato",
                    description: "Pronto per l'apertura in Excel con colonne separate.",
                  });
                }}
                className="gap-1.5 shrink-0"
              >
                <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-500" />
                <span>CSV Articoli</span>
              </Button>
            </div>

            <div className="flex items-center justify-between gap-2 rounded-xl border border-border p-3.5">
              <div>
                <p className="text-xs font-bold">
                  Esporta Board Task & Attività (CSV per Excel)
                </p>
                <p className="text-[11px] text-muted-foreground">
                  8 colonne ordinate: Codice, Titolo, Stato, Priorità, Assegnatario, Scadenza...
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  exportTasksCsv();
                  toast({
                    title: "Report Task CSV esportato",
                    description: "Pronto per l'apertura in Excel con colonne separate.",
                  });
                }}
                className="gap-1.5 shrink-0"
              >
                <FileSpreadsheet className="h-3.5 w-3.5 text-sky-500" />
                <span>CSV Task</span>
              </Button>
            </div>

            <div className="flex items-center justify-between gap-2 rounded-xl border border-border p-3.5">
              <div>
                <p className="text-xs font-bold">
                  Esporta Serie Storica Analytics (CSV per Excel)
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Dati mensili di Visualizzazioni, Visitatori Unici, Iscritti ed Engagement
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  exportAnalyticsCsv();
                  toast({
                    title: "Report Analytics CSV esportato",
                    description: "Pronto per l'apertura in Excel con colonne separate.",
                  });
                }}
                className="gap-1.5 shrink-0"
              >
                <FileSpreadsheet className="h-3.5 w-3.5 text-indigo-500" />
                <span>CSV Analytics</span>
              </Button>
            </div>

            <div className="flex items-center justify-between gap-2 rounded-xl border border-border p-3.5">
              <div>
                <p className="text-xs font-bold">
                  Backup Completo Workspace (JSON)
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Salva o trasferisci l&apos;intero stato dell&apos;applicazione
                </p>
              </div>
              <Button
                size="sm"
                onClick={exportWorkspaceJson}
                className="gap-1.5 shrink-0"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Scarica JSON</span>
              </Button>
            </div>

            <div className="flex items-center justify-between gap-2 rounded-xl border border-border p-3.5">
              <div>
                <p className="text-xs font-bold">Importa Backup (JSON)</p>
                <p className="text-[11px] text-muted-foreground">
                  Ripristina i dati da un file salvato in precedenza
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileImport}
                className="hidden"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="gap-1.5 shrink-0"
              >
                <Upload className="h-3.5 w-3.5" />
                <span>Carica File</span>
              </Button>
            </div>

            <div className="flex items-center justify-between gap-2 rounded-xl border border-destructive/30 bg-destructive/5 p-3.5">
              <div>
                <p className="text-xs font-bold text-destructive">
                  Ripristina Dati Demo Iniziali
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Reimposta articoli, task e categorie ai valori predefiniti
                </p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleReset}
                className="gap-1.5 shrink-0"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset Demo</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
