"use client"

// import * as React from "react"
import { IconHelp, IconSearch, IconSettings } from "@tabler/icons-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavSecondary(props: React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>


          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a>
                <IconSettings />
                <span>Cài đặt</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>


          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a>
                <IconHelp />
                <span>Trợ giúp</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>


          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a>
                <IconSearch />
                <span>Tìm kiếm</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>


        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
