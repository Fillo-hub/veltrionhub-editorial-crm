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
import { UserPlus } from "lucide-react";

const formSchema = z
  .object({
    name: z.string().min(2, { message: "Inserisci il tuo nome e cognome" }),
    email: z
      .string()
      .min(1, { message: "L'email è obbligatoria" })
      .email({ message: "Inserisci un indirizzo email valido" }),
    password: z
      .string()
      .min(6, { message: "La password deve avere almeno 6 caratteri" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Conferma la tua password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Le password non coincidono",
    path: ["confirmPassword"],
  });

const RegisterForm = () => {
  const router = useRouter();
  const { updateUser } = useDashboard();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    updateUser({
      name: data.name.trim(),
      email: data.email.trim(),
      role: "Autore & Editor",
    });

    toast({
      title: "Account creato con successo!",
      description: `Benvenuto in VeltrionHub, ${data.name}!`,
    });

    router.push("/");
  };

  return (
    <Card className="border border-border/80 shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl font-bold">Crea Nuovo Account</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Configura il tuo profilo autore per iniziare a pubblicare
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Nome e Cognome
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Es. Giulia Bianchi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="giulia@veltrionhub.it" {...field} />
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
                      placeholder="Minimo 6 caratteri"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Conferma Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Ripeti la password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full gap-2">
              <UserPlus className="h-4 w-4" />
              <span>Registrati e Inizia</span>
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;
