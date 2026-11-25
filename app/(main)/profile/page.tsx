"use client";

import React, { useEffect, useState } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDashboard } from "@/components/providers/DashboardProvider";
import { useToast } from "@/components/ui/use-toast";
import { Save, Mail, Briefcase, Building2, Award, Newspaper } from "lucide-react";

const ProfilePage = () => {
  const { user, updateUser, posts, tasks } = useDashboard();
  const { toast } = useToast();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);
  const [company, setCompany] = useState(user.company);
  const [bio, setBio] = useState(user.bio);
  const [avatar, setAvatar] = useState(user.avatar);

  useEffect(() => {
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setCompany(user.company);
    setBio(user.bio);
    setAvatar(user.avatar);
  }, [user]);

  const myPosts = posts.filter(
    (p) => p.author.toLowerCase() === user.name.toLowerCase()
  );
  const myViews = myPosts.reduce((s, p) => s + (p.views || 0), 0);
  const myTasks = tasks.filter(
    (t) => t.assignee.toLowerCase() === user.name.toLowerCase()
  );

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name: name.trim() || user.name,
      email: email.trim() || user.email,
      role: role.trim() || user.role,
      company: company.trim() || user.company,
      bio: bio.trim(),
      avatar: avatar.trim(),
    });
    toast({
      title: "Profilo aggiornato!",
      description: "Le tue informazioni personali sono state salvate.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <BackButton text="Torna alla Dashboard" link="/" />
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Profilo Utente & Autore
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Gestisci la tua identità pubblica, le credenziali autore e consulta il tuo riepilogo personale.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Profile Overview Card */}
        <Card className="border border-border/80 shadow-sm h-fit">
          <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
            <Avatar className="h-24 w-24 border-2 border-primary/40 shadow-md">
              <AvatarImage src={avatar} alt={name} />
              <AvatarFallback className="text-xl font-bold bg-primary/10 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-1">
              <h2 className="text-xl font-bold text-foreground">{name}</h2>
              <p className="text-xs font-semibold text-primary">{role}</p>
              <p className="text-xs text-muted-foreground">{company}</p>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed border-y border-border/60 py-3">
              {bio}
            </p>

            <div className="w-full grid grid-cols-3 gap-2 pt-1">
              <div className="rounded-xl bg-secondary/50 p-2.5">
                <p className="text-lg font-bold text-foreground">
                  {myPosts.length}
                </p>
                <p className="text-[10px] uppercase font-semibold text-muted-foreground">
                  Articoli
                </p>
              </div>
              <div className="rounded-xl bg-secondary/50 p-2.5">
                <p className="text-lg font-bold text-foreground">
                  {myViews.toLocaleString("it-IT")}
                </p>
                <p className="text-[10px] uppercase font-semibold text-muted-foreground">
                  Letture
                </p>
              </div>
              <div className="rounded-xl bg-secondary/50 p-2.5">
                <p className="text-lg font-bold text-foreground">
                  {myTasks.length}
                </p>
                <p className="text-[10px] uppercase font-semibold text-muted-foreground">
                  Task
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Edit Profile Form */}
        <Card className="lg:col-span-2 border border-border/80 shadow-sm">
          <CardHeader className="pb-3 border-b border-border/60">
            <CardTitle className="text-base font-bold">
              Modifica Informazioni Profilo
            </CardTitle>
            <CardDescription className="text-xs">
              I dati inseriti qui vengono mostrati nella barra di navigazione e come autore predefinito dei nuovi post
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-5">
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Award className="h-3.5 w-3.5" />
                    <span>Nome e Cognome</span>
                  </label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5" />
                    <span>Indirizzo Email</span>
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Briefcase className="h-3.5 w-3.5" />
                    <span>Ruolo in Redazione</span>
                  </label>
                  <Input
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5" />
                    <span>Organizzazione / Team</span>
                  </label>
                  <Input
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  URL Immagine Avatar
                </label>
                <Input
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Newspaper className="h-3.5 w-3.5" />
                  <span>Biografia Autore</span>
                </label>
                <Textarea
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>

              <Button type="submit" className="gap-2">
                <Save className="h-4 w-4" />
                <span>Salva Profilo</span>
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
