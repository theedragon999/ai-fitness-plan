import React from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const isMobile = useMobile();

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      <div className="container mx-auto px-4 flex flex-col md:flex-row">
        <Sidebar />
        <main className="flex-1 py-8 pb-20 md:pb-8">
          {children}
        </main>
      </div>
    </div>
  );
}
