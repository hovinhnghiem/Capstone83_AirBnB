import * as React from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import Header from "@/pages/AdminTemplates/_components/header";
import Sidebar from "@/pages/AdminTemplates/_components/sidebar";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export default function Dashboard() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Sheet open={open} onOpenChange={setOpen}>
        {/* Header */}
        <Header onOpenSidebar={() => setOpen(true)} />

        {/* Layout */}
        <div className="flex">
          {/* Sidebar */}
         <aside className="hidden md:block fixed top-14 left-0 h-[calc(100vh-56px)] w-[260px] border-r border-gray-200 bg-background">
           <Sidebar />
         </aside>

          {/* Main Content */}
          <main className="flex-1 md:ml-[260px] p-4 md:p-6 overflow-y-auto">
            <DashboardSkeleton />
          </main>
        </div>

        {/* Mobile Sidebar (Sheet) */}
        <SheetContent side="left" className="p-0 w-72">
          <Sidebar onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    </div>
  );
}

/* ----------------------------- */
/* Skeleton Dashboard Content    */
/* ----------------------------- */
function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Top metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="rounded-2xl">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-6 rounded-full" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-28" />
              <div className="mt-3 flex items-center gap-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-10" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Table section */}
        <Card className="rounded-2xl lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="grid grid-cols-6 items-center gap-3">
                <Skeleton className="h-4 w-20 col-span-2" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-10 justify-self-end" />
              </div>
              <Separator />
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="grid grid-cols-6 items-center gap-3 py-2"
                >
                  <div className="col-span-2 flex items-center gap-3">
                    <Skeleton className="h-9 w-9 rounded-lg" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-8 justify-self-end rounded-lg" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chart section */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-24 mt-2" />
            <div className="mt-2 rounded-xl border p-3">
              <Skeleton className="h-40 w-full" />
            </div>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
