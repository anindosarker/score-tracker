"use client";

import { authClient } from "@/lib/auth-client";
import { Home, LogIn, LogOut, Trophy } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Menu items.
const privateItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "My Matches",
    url: "/dashboard",
    icon: Trophy,
  },
];

const publicItems = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
];

export function AppSidebar() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/";
        },
      },
    });
  };

  const items = session ? privateItems : publicItems;

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b">
        <Link href="/" className="flex items-center gap-2">
          <Trophy className="h-6 w-6" />
          <h2 className="text-xl font-bold tracking-tight">Score Tracker</h2>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t gap-4">
        <div className="flex items-center justify-between gap-2">
          {session ? (
            <div className="flex items-center gap-2 overflow-hidden">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${session.user.name}`}
                  alt={session.user.name}
                />
                <AvatarFallback>{session.user.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium truncate">
                  {session.user.name}
                </span>
                <span className="text-xs text-muted-foreground truncate">
                  {session.user.email}
                </span>
              </div>
            </div>
          ) : (
            <span className="text-sm font-medium text-muted-foreground">
              Guest
            </span>
          )}
        </div>
        {session ? (
          <SidebarMenuButton
            onClick={handleSignOut}
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign Out</span>
          </SidebarMenuButton>
        ) : (
          <SidebarMenuButton
            asChild
            className="w-full justify-start text-primary"
          >
            <Link href="/">
              <LogIn className="mr-2 h-4 w-4" />
              <span>Sign In</span>
            </Link>
          </SidebarMenuButton>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
