/* eslint-disable */
import * as React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"


const data = {
  navMain: [
  
    {
      title: "Agents",
      url: "",
      items: [
        {
          title: "Tous les Agents",
          url: "/admin/agents",
          isActive: false,

        },
        
      
  
      ],
    },
     {
      title: "Départements",
      url: "#",
      items: [
        {
          title: "Tous les Départements",
          url: "/admin/departements",
          isActive: false,

        }
      
  
      ],
    },
    {
      title: "Fonctions",
      url: "#",
      items: [
        {
          title: "Toutes les Fonctions",
          url: "/admin/fonctions",
          isActive: false,
        },
        
      ],
    },
    {
      title: "Provinces & Agences",
      url: "#",
      items: [
        {
          title: "Nos Agences",
          url: "/admin/agences",
          isActive: false,
        },
         {
          title: "Provinces",
          url: "/admin/provinces",
          isActive: false,
        },
        
      ],
    },
   
    {
      title: "Page publique",
      url: "#",
      items: [
        {
          title: "Agents ADVANS Congo",
          url: "/advans-agents",
          isActive: false,
          


        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/">
                <div className=" text-sidebar-primary-foreground flex aspect-square size-32 items-center justify-center rounded-xl p-4">
                  <img src="/Advans_Congo_Logo.svg" alt="" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none text-sidebar-primary-foreground">
                  <span className="text-sidebar-primary">Gestion profil Agents</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item) => (
              
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a href={item.url} className="font-medium">
                    {item.title}
                  </a>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <SidebarMenuSub>
                    {item.items.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton asChild isActive={item.isActive}>
                          <a href={item.url}>{item.title}</a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
