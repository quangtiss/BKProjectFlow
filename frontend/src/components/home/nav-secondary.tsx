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


          <SidebarMenuItem key={'Settings'}>
            <SidebarMenuButton asChild>
              <a>
                <IconSettings />
                <span>{'Settings'}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>


          <SidebarMenuItem key={'Get Help'}>
            <SidebarMenuButton asChild>
              <a>
                <IconHelp />
                <span>{'Get Help'}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>


          <SidebarMenuItem key={'Search'}>
            <SidebarMenuButton asChild>
              <a>
                <IconSearch />
                <span>{'Search'}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>


        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
