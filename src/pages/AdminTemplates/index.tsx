import { Outlet } from "react-router-dom";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import Header from "@/pages/AdminTemplates/_components/header";
import Sidebar from "@/pages/AdminTemplates/_components/sidebar";
import { useState } from "react";

export default function AdminTemplates() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Sheet open={open} onOpenChange={setOpen}>
        <Header onOpenSidebar={() => setOpen(true)} />
        <div className="flex">
          <aside className="hidden md:block fixed top-14 left-0 h-[calc(100vh-56px)] w-[260px] border-r border-gray-200 bg-background">
            <Sidebar />
          </aside>

          <main className="flex-1 md:ml-[260px] p-4 md:p-6 overflow-y-auto">
            <Outlet />
          </main>
        </div>
        <SheetContent side="left" className="p-0 w-72">
          <Sidebar onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
