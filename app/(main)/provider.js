"use client"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import {AppSidebar} from '@/app/(main)/_components/AppSidebar'; //since its a named export like export function
import WelcomeContainer from "./dashboard/_components/WelcomeContainer";

function DashboardProvider({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="w-full">
      { /* <SidebarTrigger /> */}
      <WelcomeContainer/>
        {children}
      </div>
    </SidebarProvider>
  );
}

export default DashboardProvider;
