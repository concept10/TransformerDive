import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserIcon, LogIn, Settings, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function UserMenu() {
  const { user, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
    });
  };

  // If not authenticated, show login button
  if (!isAuthenticated) {
    return (
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => setLocation("/login")}
        className="flex items-center"
      >
        <LogIn className="h-4 w-4 mr-2" />
        <span>Login</span>
      </Button>
    );
  }

  // Get initials for avatar
  const getInitials = () => {
    if (!user?.username) return "U";
    return user.username.charAt(0).toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.username}</p>
            {user?.email && (
              <p className="text-xs leading-none text-neutral-500">{user.email}</p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setLocation("/dashboard")}>
          <UserIcon className="h-4 w-4 mr-2" />
          <span>Your Dashboard</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLocation("/settings")}>
          <Settings className="h-4 w-4 mr-2" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}