"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authClient } from "@/lib/auth-client";
import { Loader2, LogIn, Trophy, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await authClient.signUp.email(
      { email, password, name },
      {
        onSuccess: () => {
          toast.success("Account created successfully!");
          router.push("/dashboard");
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
          setLoading(false);
        },
      }
    );
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await authClient.signIn.email(
      { email, password },
      {
        onSuccess: () => {
          toast.success("Welcome back!");
          router.push("/dashboard");
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
          setLoading(false);
        },
      }
    );
  };

  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (session) {
    router.push("/dashboard");
    return null;
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-primary/20 via-background to-accent/20 p-4 lg:p-8">
      <div className="grid w-full max-w-6xl grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
        <div className="space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center justify-center rounded-2xl bg-primary/10 p-3 lg:justify-start">
            <Trophy className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter sm:text-6xl md:text-7xl">
            Score <span className="text-primary">Tracker</span>
          </h1>
          <p className="mx-auto max-w-md text-muted-foreground md:text-xl lg:mx-0">
            The ultimate realtime scoring platform. Track matches, share live
            scores, and engage with your audience instantly.
          </p>
          <div className="flex flex-wrap justify-center gap-4 lg:justify-start">
            <div className="rounded-lg bg-card/50 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur-md">
              🏏 Cricket
            </div>
            <div className="rounded-lg bg-card/50 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur-md">
              ⚽ Football
            </div>
            <div className="rounded-lg bg-card/50 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur-md">
              🏀 Basketball
            </div>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <Card className="w-full max-w-md border-primary/10 bg-background/60 shadow-2xl backdrop-blur-xl transition-all hover:border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Get Started</CardTitle>
              <CardDescription>
                Join thousands of sports enthusiasts today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="signin">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                <TabsContent value="signin">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="hello@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-background/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="bg-background/50"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full h-11 text-base font-semibold transition-all hover:scale-[1.02]"
                      disabled={loading}
                    >
                      {loading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <LogIn className="mr-2 h-4 w-4" />
                      )}
                      Sign In
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="bg-background/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="su-email">Email</Label>
                      <Input
                        id="su-email"
                        type="email"
                        placeholder="hello@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-background/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="su-password">Password</Label>
                      <Input
                        id="su-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="bg-background/50"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full h-11 text-base font-semibold transition-all hover:scale-[1.02]"
                      disabled={loading}
                    >
                      {loading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <UserPlus className="mr-2 h-4 w-4" />
                      )}
                      Create Account
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-center text-xs text-muted-foreground pb-6">
              Protected by reCAPTCHA & Terms of Service apply.
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
