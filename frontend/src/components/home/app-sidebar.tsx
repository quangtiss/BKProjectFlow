// import * as React from "react"
import { useState, useEffect } from "react"
import { ProfileService } from "@/services/auth/profile"
import { IconInnerShadowTop } from "@tabler/icons-react"
import { NavDocuments } from "@/components/home/nav-documents"
import { NavMain } from "@/components/home/nav-main"
import { NavSecondary } from "@/components/home/nav-secondary"
import { NavUser } from "@/components/home/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useNavigate } from "react-router-dom"
import { Button } from "../ui/button"


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = useState({
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },)
  const navigate = useNavigate();
  useEffect(() => {
    const fetchProfile = async () => {
      const profileData = await ProfileService()
      setUser({
        name: profileData?.fullName || "Chưa rõ tên",
        email: profileData?.email,
        avatar: "/avatars/shadcn.jpg",
      })
    }
    fetchProfile()
  }, [])


  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Button className="flex flex-row justify-start" variant={'ghost'} onClick={() => { navigate('/') }}>
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">BKProjectFlow</span>
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
        <NavDocuments />
        <NavSecondary className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
