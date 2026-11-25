"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  Post,
  PostStatus,
  CategoryItem,
  EditorialTask,
  TaskStatus,
  TaskPriority,
  UserProfile,
} from "@/types/posts";
import initialPosts, {
  defaultCategories,
  defaultTasks,
  defaultUserProfile,
} from "@/data/posts";
import analyticsData from "@/data/analytics";

interface DashboardContextType {
  posts: Post[];
  categories: CategoryItem[];
  tasks: EditorialTask[];
  user: UserProfile;
  isHydrated: boolean;
  // Post actions
  addPost: (
    post: Omit<Post, "id" | "comments" | "views"> & { views?: number }
  ) => Post;
  updatePost: (id: string, updated: Partial<Post>) => void;
  deletePost: (id: string) => void;
  duplicatePost: (id: string) => Post | undefined;
  updatePostStatus: (id: string, status: PostStatus) => void;
  togglePostFeatured: (id: string) => void;
  addComment: (postId: string, username: string, text: string) => void;
  deleteComment: (postId: string, commentId: string) => void;
  // Category actions
  addCategory: (cat: Omit<CategoryItem, "id">) => void;
  updateCategory: (id: string, cat: Partial<CategoryItem>) => void;
  deleteCategory: (id: string) => void;
  // Task actions
  addTask: (task: Omit<EditorialTask, "id">) => void;
  updateTask: (id: string, updated: Partial<EditorialTask>) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  deleteTask: (id: string) => void;
  // User & Workspace actions
  updateUser: (updated: Partial<UserProfile>) => void;
  resetWorkspace: () => void;
  exportWorkspaceJson: () => void;
  exportPostsCsv: (customPosts?: Post[]) => void;
  exportTasksCsv: () => void;
  exportAnalyticsCsv: () => void;
  importWorkspaceJson: (jsonString: string) => boolean;
}

const STORAGE_KEYS = {
  POSTS: "veltrion_dashboard_posts_v1",
  CATEGORIES: "veltrion_dashboard_categories_v1",
  TASKS: "veltrion_dashboard_tasks_v1",
  USER: "veltrion_dashboard_user_v1",
};

const statusLabels: Record<PostStatus, string> = {
  published: "Pubblicato",
  review: "In Revisione",
  draft: "Bozza",
  archived: "Archiviato",
};

const taskStatusLabels: Record<TaskStatus, string> = {
  todo: "Da Fare",
  in_progress: "In Lavorazione",
  done: "Completato",
};

const taskPriorityLabels: Record<TaskPriority, string> = {
  high: "Alta",
  medium: "Media",
  low: "Bassa",
};

/**
 * Formats a value as a clean CSV cell for Italian/European Excel (; separator).
 * - Numbers are kept unquoted so Excel recognizes them as numeric cells.
 * - Strings have newlines/tabs collapsed and double quotes escaped.
 */
function toCsvCell(value: string | number | boolean | undefined | null): string {
  if (value === null || value === undefined) return '""';
  if (typeof value === "number") return String(value);
  if (typeof value === "boolean") return value ? '"Sì"' : '"No"';
  const cleaned = String(value)
    .replace(/[\r\n\t]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/"/g, '""');
  return `"${cleaned}"`;
}

/**
 * Converts YYYY-MM-DD to DD/MM/YYYY for clean Excel date recognition in Italy.
 */
function formatItalianDate(isoDate: string): string {
  if (!isoDate) return "";
  const parts = isoDate.split("-");
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return isoDate;
}

/**
 * Triggers a browser download of a CSV file with UTF-8 BOM (\uFEFF) and CRLF (\r\n)
 * so Microsoft Excel, LibreOffice Calc, and Google Sheets open all columns and accents properly.
 */
function downloadCsvFile(filename: string, headers: string[], rows: (string | number | boolean)[][]) {
  const delimiter = ";";
  const headerLine = headers.map((h) => toCsvCell(h)).join(delimiter);
  const dataLines = rows.map((row) =>
    row.map((cell) => toCsvCell(cell)).join(delimiter)
  );
  // Prepend UTF-8 BOM (\uFEFF) and join with Windows CRLF (\r\n)
  const csvContent = "\uFEFF" + [headerLine, ...dataLines].join("\r\n") + "\r\n";
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

export const DashboardProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [categories, setCategories] =
    useState<CategoryItem[]>(defaultCategories);
  const [tasks, setTasks] = useState<EditorialTask[]>(defaultTasks);
  const [user, setUser] = useState<UserProfile>(defaultUserProfile);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage on client mount
  useEffect(() => {
    try {
      const savedPosts = localStorage.getItem(STORAGE_KEYS.POSTS);
      if (savedPosts) setPosts(JSON.parse(savedPosts));

      const savedCategories = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (savedCategories) setCategories(JSON.parse(savedCategories));

      const savedTasks = localStorage.getItem(STORAGE_KEYS.TASKS);
      if (savedTasks) setTasks(JSON.parse(savedTasks));

      const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
      if (savedUser) setUser(JSON.parse(savedUser));
    } catch (e) {
      console.error("Failed to load state from localStorage", e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Persist changes after hydration
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
    } catch (e) {
      console.error(e);
    }
  }, [posts, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (e) {
      console.error(e);
    }
  }, [categories, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (e) {
      console.error(e);
    }
  }, [tasks, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
  }, [user, isHydrated]);

  // Post operations
  const addPost = (
    newPostData: Omit<Post, "id" | "comments" | "views"> & { views?: number }
  ) => {
    const newPost: Post = {
      ...newPostData,
      id: Date.now().toString(),
      views: newPostData.views ?? 0,
      comments: [],
    };
    setPosts((prev) => [newPost, ...prev]);
    return newPost;
  };

  const updatePost = (id: string, updated: Partial<Post>) => {
    setPosts((prev) =>
      prev.map((post) => (post.id === id ? { ...post, ...updated } : post))
    );
  };

  const deletePost = (id: string) => {
    setPosts((prev) => prev.filter((post) => post.id !== id));
  };

  const duplicatePost = (id: string) => {
    const original = posts.find((p) => p.id === id);
    if (!original) return undefined;
    const copy: Post = {
      ...original,
      id: Date.now().toString(),
      title: `${original.title} (Copia)`,
      status: "draft",
      date: new Date().toISOString().split("T")[0],
      views: 0,
      comments: [],
    };
    setPosts((prev) => [copy, ...prev]);
    return copy;
  };

  const updatePostStatus = (id: string, status: PostStatus) => {
    updatePost(id, { status });
  };

  const togglePostFeatured = (id: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id ? { ...post, featured: !post.featured } : post
      )
    );
  };

  const addComment = (postId: string, username: string, text: string) => {
    const today = new Date().toISOString().split("T")[0];
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [
                ...post.comments,
                {
                  id: `c-${Date.now()}`,
                  username: username.trim() || "Utente",
                  text: text.trim(),
                  date: today,
                },
              ],
            }
          : post
      )
    );
  };

  const deleteComment = (postId: string, commentId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: post.comments.filter((c) => c.id !== commentId),
            }
          : post
      )
    );
  };

  // Category operations
  const addCategory = (cat: Omit<CategoryItem, "id">) => {
    const newCat: CategoryItem = {
      ...cat,
      id: `cat-${Date.now()}`,
    };
    setCategories((prev) => [...prev, newCat]);
  };

  const updateCategory = (id: string, updated: Partial<CategoryItem>) => {
    const existing = categories.find((c) => c.id === id);
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, ...updated } : cat))
    );
    if (existing && updated.name && updated.name !== existing.name) {
      const oldName = existing.name;
      const newName = updated.name;
      setPosts((prev) =>
        prev.map((p) => (p.category === oldName ? { ...p, category: newName } : p))
      );
      setTasks((prev) =>
        prev.map((t) => (t.category === oldName ? { ...t, category: newName } : t))
      );
    }
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
  };

  // Task operations
  const addTask = (task: Omit<EditorialTask, "id">) => {
    const newTask: EditorialTask = {
      ...task,
      id: `task-${Date.now()}`,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const updateTask = (id: string, updated: Partial<EditorialTask>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updated } : t))
    );
  };

  const updateTaskStatus = (id: string, status: TaskStatus) => {
    updateTask(id, { status });
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // User & Workspace operations
  const updateUser = (updated: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updated }));
  };

  const resetWorkspace = () => {
    setPosts(initialPosts);
    setCategories(defaultCategories);
    setTasks(defaultTasks);
    setUser(defaultUserProfile);
    localStorage.removeItem(STORAGE_KEYS.POSTS);
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.TASKS);
    localStorage.removeItem(STORAGE_KEYS.USER);
  };

  const exportWorkspaceJson = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      version: "1.0",
      user,
      categories,
      posts,
      tasks,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `veltrionhub-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPostsCsv = (customPosts?: Post[]) => {
    const source = customPosts ?? posts;
    const headers = [
      "Codice Articolo",
      "Titolo",
      "Categoria",
      "Stato",
      "In Evidenza",
      "Autore",
      "Data Pubblicazione",
      "Visualizzazioni",
      "Commenti",
      "Parole",
      "Tempo Lettura (min)",
      "Tag",
      "Sommario",
    ];

    const rows = source.map((p, index) => {
      const words = p.body?.trim() ? p.body.trim().split(/\s+/).length : 0;
      const readingMin = Math.max(1, Math.ceil(words / 200));
      const code = `ART-${String(index + 1).padStart(3, "0")}`;

      return [
        code,
        p.title,
        p.category,
        statusLabels[p.status] || p.status,
        Boolean(p.featured),
        p.author,
        formatItalianDate(p.date),
        p.views ?? 0,
        p.comments?.length ?? 0,
        words,
        readingMin,
        p.tags && p.tags.length > 0 ? p.tags.join(" | ") : "-",
        p.excerpt || p.body.slice(0, 120) + "...",
      ];
    });

    downloadCsvFile(
      `report-articoli-${new Date().toISOString().split("T")[0]}.csv`,
      headers,
      rows
    );
  };

  const exportTasksCsv = () => {
    const headers = [
      "Codice Task",
      "Titolo Attività",
      "Stato",
      "Priorità",
      "Assegnatario",
      "Categoria",
      "Scadenza",
      "Descrizione",
    ];

    const rows = tasks.map((t, index) => [
      `TSK-${String(index + 1).padStart(3, "0")}`,
      t.title,
      taskStatusLabels[t.status] || t.status,
      taskPriorityLabels[t.priority] || t.priority,
      t.assignee,
      t.category || "Generale",
      formatItalianDate(t.dueDate),
      t.description,
    ]);

    downloadCsvFile(
      `report-task-redazione-${new Date().toISOString().split("T")[0]}.csv`,
      headers,
      rows
    );
  };

  const exportAnalyticsCsv = () => {
    const headers = [
      "Mese",
      "Visualizzazioni Pagina",
      "Visitatori Unici",
      "Nuovi Iscritti Newsletter",
      "Tasso Engagement (%)",
    ];

    const rows = analyticsData.map((item) => [
      item.name,
      item.pv,
      item.uv,
      item.subscribers ?? 0,
      item.engagement ?? 0,
    ]);

    downloadCsvFile(
      `report-analytics-mensile-${new Date().toISOString().split("T")[0]}.csv`,
      headers,
      rows
    );
  };

  const importWorkspaceJson = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed.posts)) setPosts(parsed.posts);
      if (Array.isArray(parsed.categories)) setCategories(parsed.categories);
      if (Array.isArray(parsed.tasks)) setTasks(parsed.tasks);
      if (parsed.user && typeof parsed.user === "object") setUser(parsed.user);
      return true;
    } catch (e) {
      console.error("Invalid workspace JSON", e);
      return false;
    }
  };

  return (
    <DashboardContext.Provider
      value={{
        posts,
        categories,
        tasks,
        user,
        isHydrated,
        addPost,
        updatePost,
        deletePost,
        duplicatePost,
        updatePostStatus,
        togglePostFeatured,
        addComment,
        deleteComment,
        addCategory,
        updateCategory,
        deleteCategory,
        addTask,
        updateTask,
        updateTaskStatus,
        deleteTask,
        updateUser,
        resetWorkspace,
        exportWorkspaceJson,
        exportPostsCsv,
        exportTasksCsv,
        exportAnalyticsCsv,
        importWorkspaceJson,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
};
