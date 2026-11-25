"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useDashboard } from "@/components/providers/DashboardProvider";
import { useToast } from "@/components/ui/use-toast";
import { LogIn, Sparkles } from "lucide-react";

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "L'email è obbligatoria" })
    .email({ message: "Inserisci un indirizzo email valido" }),
  password: z
    .string()
    .min(4, { message: "La password deve contenere almeno 4 caratteri" }),
});

const LoginForm = () => {
  const router = useRouter();
  const { user, updateUser } = useDashboard();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: user.email || "marco.rossi@veltrionhub.it",
      password: "password123",
    },
  });

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    updateUser({ email: data.email });
    toast({
      title: "Accesso effettuato",
      description: `Bentornato nel tuo workspace, ${user.name}!`,
    });
    router.push("/");
  };

  const handleDemoLogin = () => {
    toast({
      title: "Sessione Demo avviata",
      description: "Accesso rapido eseguito come Caporedattore.",
    });
    router.push("/");
  };

  return (
    <Card className="border border-border/80 shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl font-bold">Bentornato</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Inserisci le tue credenziali per accedere alla dashboard editoriale
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="nome@azienda.it" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full gap-2">
              <LogIn className="h-4 w-4" />
              <span>Accedi al Workspace</span>
            </Button>
          </form>
        </Form>

        <div className="relative py-1">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-[11px] uppercase">
            <span className="bg-card px-2 text-muted-foreground">oppure</span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleDemoLogin}
          className="w-full gap-2 text-xs"
        >
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span>Accesso Rapido Demo (1-Click)</span>
        </Button>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
