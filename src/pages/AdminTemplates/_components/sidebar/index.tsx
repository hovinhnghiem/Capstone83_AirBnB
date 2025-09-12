import { Link } from "react-router-dom";
import { MapPin, Home, Wrench, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

type SidebarProps = {
  onNavigate?: () => void;
};
export default function Sidebar({ onNavigate }: SidebarProps) {
  return (
    <div className="h-full">
      <ScrollArea className="h-[calc(100vh-56px)] p-2">
        <nav className="mt-2 grid gap-1">
          <NavItem
            to="/admin/location"
            icon={<MapPin className="h-4 w-4" />}
            onClick={onNavigate}
          >
            Location Information
          </NavItem>

          <NavItem
            to="/admin/room-info"
            icon={<Home className="h-4 w-4" />}
            onClick={onNavigate}
          >
            Room Information
          </NavItem>

          <NavItem
            to="/admin/room-management"
            icon={<Wrench className="h-4 w-4" />}
            onClick={onNavigate}
          >
            Room Management
          </NavItem>

          <NavItem
            to="/admin/user-management"
            icon={<Users className="h-4 w-4" />}
            onClick={onNavigate}
          >
            User Management
          </NavItem>
        </nav>
      </ScrollArea>
    </div>
  );
}


function NavItem({
  to,
  icon,
  children,
  onClick,
}: {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Button
      asChild
      variant="ghost"
      className="justify-start gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent"
      onClick={onClick}
    >
      <Link to={to}>
        {icon}
        {children}
      </Link>
    </Button>
  );
}
