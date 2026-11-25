"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Plus,
  Bell,
  Menu,
  LayoutDashboard,
  Newspaper,
  FolderKanban,
  CheckSquare,
  BarChart3,
  User,
  Settings,
  LogOut,
  FileText,
  Download,
  Sparkles,
  Sun,
  Moon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ThemeToggler from "@/components/ThemeToggler";
import Sidebar from "@/components/Sidebar";
import { useDashboard } from "@/components/providers/DashboardProvider";
import { useTheme } from "next-themes";

const Navbar = () => {
  const router = useRouter();
  const {
    posts,
    tasks,
    user,
    exportWorkspaceJson,
    exportPostsCsv,
    exportTasksCsv,
  } = useDashboard();
  const { setTheme } = useTheme();
  const [commandOpen, setCommandOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Keyboard shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const reviewPosts = posts.filter((p) => p.status === "review");
  const urgentTasks = tasks.filter(
    (t) => t.status !== "done" && t.priority === "high"
  );
  const notificationCount = reviewPosts.length + urgentTasks.length;

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const runCommand = (callback: () => void) => {
    setCommandOpen(false);
    callback();
  };

  return (
    <>
      <header className="sticky top-0 z-40 h-16 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="flex h-full items-center justify-between px-4 md:px-6">
          {/* Left: Mobile Menu Trigger + Brand */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-9 w-9 rounded-lg border border-border/60"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Apri menu di navigazione"
            >
              <Menu className="h-5 w-5" />
            </Button>

            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-sm shadow-indigo-500/30 transition-transform group-hover:scale-105">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-base tracking-tight text-foreground">
                    VeltrionHub
                  </span>
                  <span className="hidden sm:inline-block rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                    Studio
                  </span>
                </div>
                <span className="hidden sm:block text-[11px] text-muted-foreground leading-none">
                  Editorial & Task Hub
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Global Search / Command Palette Trigger */}
          <div className="flex-1 max-w-md mx-3 sm:mx-6">
            <button
              type="button"
              onClick={() => setCommandOpen(true)}
              className="w-full flex items-center justify-between gap-2 px-3 py-2 text-xs sm:text-sm text-muted-foreground bg-secondary/60 hover:bg-secondary border border-border/80 rounded-xl transition-colors"
            >
              <span className="flex items-center gap-2 truncate">
                <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="truncate">
                  Cerca articoli, task o comandi...
                </span>
              </span>
              <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                Ctrl K
              </kbd>
            </button>
          </div>

          {/* Right: Actions, Notifications, Theme & Profile */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <Link href="/posts/new" className="hidden sm:block">
              <Button size="sm" className="h-9 rounded-lg gap-1.5 shadow-sm">
                <Plus className="h-4 w-4" />
                <span>Nuovo Articolo</span>
              </Button>
            </Link>

            {/* Notifications Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative h-9 w-9 rounded-lg border border-border/60 bg-background/60 hover:bg-accent"
                  title="Notifiche"
                >
                  <Bell className="h-4 w-4" />
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white">
                      {notificationCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 p-2">
                <DropdownMenuLabel className="flex items-center justify-between px-2 py-1.5">
                  <span className="font-semibold text-sm">Centro Notifiche</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    {notificationCount} avvisi attivi
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notificationCount === 0 ? (
                  <div className="py-6 text-center text-xs text-muted-foreground">
                    Tutto aggiornato! Nessuna notifica in sospeso.
                  </div>
                ) : (
                  <div className="max-h-72 overflow-y-auto space-y-1">
                    {urgentTasks.map((task) => (
                      <DropdownMenuItem
                        key={task.id}
                        onClick={() => router.push("/tasks")}
                        className="flex flex-col items-start gap-1 p-2.5 rounded-lg cursor-pointer"
                      >
                        <div className="flex items-center gap-2 w-full">
                          <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0" />
                          <span className="text-xs font-semibold truncate">
                            Task Priorità Alta: {task.title}
                          </span>
                        </div>
                        <span className="text-[11px] text-muted-foreground pl-4">
                          Scadenza: {task.dueDate} • Assegnato a {task.assignee}
                        </span>
                      </DropdownMenuItem>
                    ))}
                    {reviewPosts.map((post) => (
                      <DropdownMenuItem
                        key={post.id}
                        onClick={() => router.push(`/posts/edit/${post.id}`)}
                        className="flex flex-col items-start gap-1 p-2.5 rounded-lg cursor-pointer"
                      >
                        <div className="flex items-center gap-2 w-full">
                          <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0" />
                          <span className="text-xs font-semibold truncate">
                            In attesa di revisione: {post.title}
                          </span>
                        </div>
                        <span className="text-[11px] text-muted-foreground pl-4">
                          Autore: {post.author} • {post.category}
                        </span>
                      </DropdownMenuItem>
                    ))}
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <ThemeToggler />

            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <div className="flex items-center gap-2.5 pl-1 pr-1.5 py-1 rounded-full hover:bg-accent transition-colors border border-transparent hover:border-border">
                  <Avatar className="h-8 w-8 border border-border">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden lg:flex flex-col items-start text-left">
                    <span className="text-xs font-semibold leading-tight text-foreground">
                      {user.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground leading-tight">
                      {user.role}
                    </span>
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold leading-none">
                      {user.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => router.push("/profile")}
                  className="cursor-pointer gap-2"
                >
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>Il mio Profilo</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push("/posts/new")}
                  className="cursor-pointer gap-2 sm:hidden"
                >
                  <Plus className="h-4 w-4 text-muted-foreground" />
                  <span>Nuovo Articolo</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push("/settings")}
                  className="cursor-pointer gap-2"
                >
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  <span>Impostazioni & Backup</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => router.push("/auth")}
                  className="cursor-pointer gap-2 text-destructive focus:text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Disconnetti</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Dialog */}
      <Dialog open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <DialogContent className="p-0 max-w-[270px] h-[100dvh] left-0 top-0 translate-x-0 translate-y-0 rounded-none border-r border-border data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left">
          <DialogTitle className="sr-only">Menu di navigazione</DialogTitle>
          <div className="flex h-14 items-center px-4 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="font-bold text-sm">VeltrionHub</span>
            </div>
          </div>
          <div className="h-[calc(100dvh-3.5rem)] overflow-hidden">
            <Sidebar
              onNavigate={() => setMobileMenuOpen(false)}
              className="w-full border-r-0"
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Command Palette (Ctrl+K) */}
      <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
        <CommandInput placeholder="Cerca articoli, pagine, task o azioni rapide..." />
        <CommandList>
          <CommandEmpty>Nessun risultato trovato.</CommandEmpty>
          <CommandGroup heading="Navigazione Rapida">
            <CommandItem onSelect={() => runCommand(() => router.push("/"))}>
              <LayoutDashboard className="mr-2 h-4 w-4 text-primary" />
              <span>Vai alla Panoramica Dashboard</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/posts/new"))}
            >
              <Plus className="mr-2 h-4 w-4 text-emerald-500" />
              <span>Crea Nuovo Articolo</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/posts"))}
            >
              <Newspaper className="mr-2 h-4 w-4 text-indigo-500" />
              <span>Tutti gli Articoli ({posts.length})</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/categories"))}
            >
              <FolderKanban className="mr-2 h-4 w-4 text-amber-500" />
              <span>Gestione Categorie</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/tasks"))}
            >
              <CheckSquare className="mr-2 h-4 w-4 text-sky-500" />
              <span>Task & Board Redazionale</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/analytics"))}
            >
              <BarChart3 className="mr-2 h-4 w-4 text-violet-500" />
              <span>Statistiche & Analytics</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Articoli Recenti">
            {posts.slice(0, 6).map((post) => (
              <CommandItem
                key={post.id}
                onSelect={() =>
                  runCommand(() => router.push(`/posts/edit/${post.id}`))
                }
              >
                <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="truncate">{post.title}</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {post.category}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Azioni & Esportazioni">
            <CommandItem onSelect={() => runCommand(() => exportPostsCsv())}>
              <Download className="mr-2 h-4 w-4 text-emerald-500" />
              <span>Esporta Tabella Articoli (CSV per Excel)</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => exportTasksCsv())}>
              <Download className="mr-2 h-4 w-4 text-sky-500" />
              <span>Esporta Task Redazione (CSV per Excel)</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => exportWorkspaceJson())}
            >
              <Download className="mr-2 h-4 w-4 text-indigo-500" />
              <span>Scarica Backup Completo (JSON)</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
              <Sun className="mr-2 h-4 w-4 text-amber-500" />
              <span>Attiva Tema Chiaro</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
              <Moon className="mr-2 h-4 w-4 text-indigo-400" />
              <span>Attiva Tema Scuro</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default Navbar;
