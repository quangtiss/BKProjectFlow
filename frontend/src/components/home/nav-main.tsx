import { IconCalendarUser, IconCirclePlusFilled, IconPresentation, IconReport, IconUsersGroup } from "@tabler/icons-react"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  IconDashboard,
  IconListDetails,
  IconChartBar,
  IconFolder
} from "@tabler/icons-react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "@/routes/auth-context"

export function NavMain() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user }: { user: any } = useAuth()
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            {!(user.auth.role === 'Giáo vụ') && <SidebarMenuButton
              tooltip="Quick Create"
              // className="bg-blue-500 text-primary-foreground hover:bg-blue-500/50 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
              className={location.pathname === '/de-xuat-de-tai' ? 'bg-accent-foreground/30' : ""}
              onClick={() => navigate('/de-xuat-de-tai')}
            >
              <IconCirclePlusFilled />
              <span>Đề xuất đề tài</span>
            </SidebarMenuButton>}
            {/* <Button
              size="icon"
              className="size-8 group-data-[collapsible=icon]:opacity-0"
              variant="outline"
              onClick={() => navigate('/other')}
            >
              <IconMail />
              <span className="sr-only">Inbox</span>
            </Button> */}
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>


          {!(user.auth.role === 'Giáo vụ') && <SidebarMenuItem key={'Dashboard'} onClick={() => { navigate('/de-tai-cua-toi') }}>
            <SidebarMenuButton tooltip={'Dashboard'} className={location.pathname === '/de-tai-cua-toi' ? 'bg-accent-foreground/30' : ""}>
              <IconDashboard />
              <div className="flex flex-row justify-between w-full">
                <div>Đề tài của tôi</div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>}


          {user.auth.role === 'Giảng viên trưởng bộ môn' && <SidebarMenuItem key={'Lifecycle'}
            onClick={() => navigate('/duyet-de-tai')}>
            <SidebarMenuButton tooltip={'Lifecycle'} className={location.pathname === '/duyet-de-tai' ? 'bg-accent-foreground/30' : ""}>
              <IconListDetails />
              <div className="flex flex-row justify-between w-full">
                <div>Duyệt đề tài</div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>}


          {user.auth.role === 'Giáo vụ' && <SidebarMenuItem key={'Users'} onClick={() => navigate('/quan-ly-tai-khoan')}>
            <SidebarMenuButton tooltip={'Quản lý tài khoản'} className={location.pathname === '/quan-ly-tai-khoan' ? 'bg-accent-foreground/30' : ""}>
              <IconCalendarUser />
              <span>Tài khoản</span>
            </SidebarMenuButton>
          </SidebarMenuItem>}


          <SidebarMenuItem key={'Analytics'} onClick={() => navigate('/hoc-ky')}>
            <SidebarMenuButton tooltip={'Học kỳ'} className={location.pathname === '/hoc-ky' ? 'bg-accent-foreground/30' : ""}>
              <IconChartBar />
              <span>Học kỳ</span>
            </SidebarMenuButton>
          </SidebarMenuItem>


          <SidebarMenuItem key={'HoiDong'} onClick={() => navigate('/hoi-dong')}>
            <SidebarMenuButton tooltip={'Hội đồng'} className={location.pathname === '/hoi-dong' ? 'bg-accent-foreground/30' : ""}>
              <IconUsersGroup />
              <span>Hội đồng</span>
            </SidebarMenuButton>
          </SidebarMenuItem>


          <SidebarMenuItem key={'PhanBien'} onClick={() => navigate('/phan-bien')}>
            <SidebarMenuButton tooltip={'Phản biện'} className={location.pathname === '/phan-bien' ? 'bg-accent-foreground/30' : ""}>
              <IconPresentation />
              <span>Phản biện</span>
            </SidebarMenuButton>
          </SidebarMenuItem>


          <SidebarMenuItem key={'Projects'} onClick={() => navigate('/bieu-mau')}>
            <SidebarMenuButton tooltip={'Biểu mẫu'} className={location.pathname === '/bieu-mau' ? 'bg-accent-foreground/30' : ""}>
              <IconFolder />
              <span>Biểu mẫu</span>
            </SidebarMenuButton>
          </SidebarMenuItem>


          <SidebarMenuItem key={'Team'}>
            <SidebarMenuButton tooltip={'Chủ đề'} onClick={() => navigate('/chu-de')} className={location.pathname === '/chu-de' ? 'bg-accent-foreground/30' : ""}>
              <IconReport />
              <span>Chủ đề</span>
            </SidebarMenuButton>
          </SidebarMenuItem>


        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
