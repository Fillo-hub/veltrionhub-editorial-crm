import ThemeToggler from "@/components/ThemeToggler";
import { Sparkles } from "lucide-react";
import Link from "next/link";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-indigo-500/10 via-background to-violet-500/10 p-4 sm:p-6">
      <div className="flex items-center justify-between max-w-6xl w-full mx-auto">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-sm">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="font-bold text-lg tracking-tight">VeltrionHub</span>
        </Link>
        <ThemeToggler />
      </div>

      <div className="flex-1 flex items-center justify-center py-8">
        {children}
      </div>

      <p className="text-center text-xs text-muted-foreground">
        VeltrionHub Editorial & Task Studio • Piattaforma Gestionale
      </p>
    </div>
  );
};

export default AuthLayout;
