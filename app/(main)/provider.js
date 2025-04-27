import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import {AppSidebar} from '@/app/(main)/_components/AppSidebar'; //since its a named export like export function

function DashboardProvider({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="w-full">
        <SidebarTrigger />
        {children}
      </div>
    </SidebarProvider>
  );
}

export default DashboardProvider;
