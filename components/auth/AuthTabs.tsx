import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

const AuthTabs = () => {
  return (
    <Tabs defaultValue="login" className="w-full max-w-[420px]">
      <TabsList className="grid w-full grid-cols-2 h-11 mb-2">
        <TabsTrigger value="login" className="text-xs sm:text-sm font-semibold">
          Accedi
        </TabsTrigger>
        <TabsTrigger value="register" className="text-xs sm:text-sm font-semibold">
          Crea Account
        </TabsTrigger>
      </TabsList>
      <TabsContent value="login">
        <LoginForm />
      </TabsContent>
      <TabsContent value="register">
        <RegisterForm />
      </TabsContent>
    </Tabs>
  );
};

export default AuthTabs;
