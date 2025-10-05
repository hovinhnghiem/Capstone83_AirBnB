import { LayoutDashboard, Menu, Search, Bell, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SheetTrigger } from "@/components/ui/sheet";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth.slice";

type HeaderProps = {
  onOpenSidebar: () => void;
};

export default function Header({ onOpenSidebar }: HeaderProps) {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/auth/login", { replace: true });
  };

  const goToDashboard = () => {
    navigate("/admin/dashboard");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="flex h-14 items-center gap-2 px-3 md:px-6">
        <div className="flex items-center gap-2 md:hidden">
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" onClick={onOpenSidebar}>
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open sidebar</span>
            </Button>
          </SheetTrigger>
        </div>

        <div
          className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors"
          onClick={goToDashboard}
        >
          <LayoutDashboard className="h-5 w-5" />
          <span className="font-semibold">Admin</span>
          <Separator orientation="vertical" className="mx-2 h-6" />
          <span className="text-sm text-muted-foreground hidden sm:inline">
            Dashboard
          </span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <div className="relative hidden sm:flex items-center">
            <Search className="absolute left-2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-8 w-64" placeholder="Search…" />
          </div>

          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src="" alt="You" />
                  <AvatarFallback>YY</AvatarFallback>
                </Avatar>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={handleLogout}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
