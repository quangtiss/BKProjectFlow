// import * as React from "react"
import { IconInnerShadowTop } from "@tabler/icons-react"
// import { NavDocuments } from "@/components/home/nav-documents"
import { NavMain } from "@/components/home/nav-main"
// import { NavSecondary } from "@/components/home/nav-secondary"
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
import { useAuth } from "@/routes/auth-context"


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user }: { user: any } = useAuth()
  const navigate = useNavigate();

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
        {/* <NavDocuments /> */}
        {/* <NavSecondary className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{
          name: user.tai_khoan.ho + " " + user.tai_khoan.ten || "Chưa rõ tên",
          email: user.tai_khoan.email || "",
          avatar: "/avatars/shadcn.jpg",
          role: user.tai_khoan.vai_tro
        }} />
      </SidebarFooter>
    </Sidebar>
  )
}
