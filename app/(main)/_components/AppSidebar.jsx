"use client"
import { Button } from "@/components/ui/button"
import {
    Sidebar, 
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem

}from "@/components/ui/sidebar"
import Image from "next/image"
import { Plus } from "lucide-react"
import { SidebarOptions } from "@/services/Constants"
import Link from "next/link"
import { usePathname } from "next/navigation"
export function AppSidebar(){
    const path=usePathname();
    console.log(path)
    return(
        <Sidebar>
            <SidebarHeader>
            <Image 
  src="/logo2.png" 
  alt="logo" 
  width={200} 
  height={100} 
  className="object-contain" 
/>
                <Button className='w-full gap-1'><Plus/>Create New Interview</Button>
                </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarContent>
                        <SidebarMenu>
                            {SidebarOptions.map((option,index)=>(
                                <SidebarMenuItem key={index} className='p-1'>
                                    <SidebarMenuButton asChild className={`p-5 ${path==option.path && 'bg-blue-50'}`}>
                                        <Link href={option.path}>
                                        <option.icon/>
                                        <span className={`text-[16px] font-medium ${path==option.path &&'text-primary'}`}>{option.name}</span>
                                        </Link>
                                    </SidebarMenuButton>

                                </SidebarMenuItem>
                                ))}
                        </SidebarMenu>
                        </SidebarContent>
                        </SidebarGroup>
                <SidebarGroup/>
            </SidebarContent>
            <SidebarFooter/>
        </Sidebar>
    )
}