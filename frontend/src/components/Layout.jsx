import React from 'react';
import { NavLink } from 'react-router-dom';
import { Calendar, Clock, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";

export default function Layout({ children }) {
  const links = [
    { to: "/", label: "Event Types", icon: <LayoutDashboard className="w-4 h-4" /> },
    { to: "/bookings", label: "Bookings", icon: <Calendar className="w-4 h-4" /> },
    { to: "/availability", label: "Availability", icon: <Clock className="w-4 h-4" /> },
  ];

  return (
    <div className="flex min-h-screen bg-muted/20">
      <aside className="w-64 bg-background border-r hidden md:flex flex-col">
        <div className="p-6">
          <h2 className="text-lg font-semibold flex items-center gap-2 tracking-tight">
            <Calendar className="w-5 h-5 text-primary" /> Cal.clone
          </h2>
        </div>
        <nav className="space-y-1 px-4 flex-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md transition-all border border-transparent",
                  isActive ? "bg-accent/60 text-accent-foreground border-border/50 shadow-sm" : "text-muted-foreground hover:bg-accent/40 hover:text-foreground"
                )
              }
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}
        </nav>
        
        {/* Theme Toggle bottom fixed */}
        <div className="p-4 border-t border-border/40 mt-auto flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest pl-2">Theme</span>
          <ThemeToggle />
        </div>
      </aside>
      
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-5xl mx-auto h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
