"use client"

import {
  IconDots,
  IconFolder,
  IconShare3,
  IconTrash,
  IconDatabase,
  IconReport,
  IconFileWord
} from "@tabler/icons-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function NavDocuments() {
  const { isMobile } = useSidebar()

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Documents</SidebarGroupLabel>
      <SidebarMenu>


        <SidebarMenuItem key={'Data Library'}>
          <SidebarMenuButton asChild>
            <a>
              <IconDatabase />
              <span>{'Data Library'}</span>
            </a>
          </SidebarMenuButton>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuAction
                showOnHover
                className="data-[state=open]:bg-accent rounded-sm"
              >
                <IconDots />
                <span className="sr-only">More</span>
              </SidebarMenuAction>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-24 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align={isMobile ? "end" : "start"}
            >
              <DropdownMenuItem>
                <IconFolder />
                <span>Open</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconShare3 />
                <span>Share</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                <IconTrash />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>


        <SidebarMenuItem key={'Reports'}>
          <SidebarMenuButton asChild>
            <a>
              <IconReport />
              <span>{'Reports'}</span>
            </a>
          </SidebarMenuButton>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuAction
                showOnHover
                className="data-[state=open]:bg-accent rounded-sm"
              >
                <IconDots />
                <span className="sr-only">More</span>
              </SidebarMenuAction>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-24 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align={isMobile ? "end" : "start"}
            >
              <DropdownMenuItem>
                <IconFolder />
                <span>Open</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconShare3 />
                <span>Share</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                <IconTrash />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>


        <SidebarMenuItem key={'Word Assistant'}>
          <SidebarMenuButton asChild>
            <a>
              <IconFileWord />
              <span>{'Word Assistant'}</span>
            </a>
          </SidebarMenuButton>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuAction
                showOnHover
                className="data-[state=open]:bg-accent rounded-sm"
              >
                <IconDots />
                <span className="sr-only">More</span>
              </SidebarMenuAction>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-24 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align={isMobile ? "end" : "start"}
            >
              <DropdownMenuItem>
                <IconFolder />
                <span>Open</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconShare3 />
                <span>Share</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                <IconTrash />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>


        <SidebarMenuItem>
          <SidebarMenuButton className="text-sidebar-foreground/70">
            <IconDots className="text-sidebar-foreground/70" />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem>


      </SidebarMenu>
    </SidebarGroup>
  )
}
