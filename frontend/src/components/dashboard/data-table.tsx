// import * as React from "react"
import { useState, useMemo, useEffect } from "react";
import {
  IconCarambolaFilled,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconCircleCheckFilled,
  IconLayoutColumns,
  IconLoader,
  IconSearch,
} from "@tabler/icons-react";
import {
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";

import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "../ui/scroll-area";
import {
  Check,
  ListFilter,
  User,
} from "lucide-react";
import { Input } from "../ui/input";
import { useAuth } from "@/routes/auth-context";
import { toast } from "sonner";
import { getAllDeTaiCuaHocKyHienTai } from "@/services/de_tai/get_all_de_tai";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import ChuDeMultiSelect from "./select-chu-de";

//--------------------------------------------END IMPORT------------------------------------


export function DataTable() {
  const [data, setData] = useState<Array<object>>([]);
  const [toggle, setToggle] = useState(false);
  const { user }: { user: any } = useAuth();
  useEffect(() => {
    const fetchAllDeTaiDaDuyet = async () => {
      try {
        const listDeTaiDaDuyet = await getAllDeTaiCuaHocKyHienTai();
        setData(
          listDeTaiDaDuyet.sort((a: any, b: any) =>
            a.de_tai.ma_de_tai.localeCompare(b.de_tai.ma_de_tai)
          )
        );
      } catch (error) {
        console.error(error);
      }
    };
    fetchAllDeTaiDaDuyet();
  }, [toggle]);

  const columns: any = [
    {
      id: "purpose",
      header: "",
      cell: () => <span></span>,
    },
    {
      accessorKey: "Tên đề tài",
      header: "Tên đề tài",
      cell: ({ row }: { row: any }) => {
        return <TableCellViewer item={row.original} setToggle={setToggle} />;
      },
      enableHiding: false,
    },
    {
      accessorKey: "Số lượng sinh viên",
      header: "Sinh viên",
      cell: ({ row }: { row: any }) => {
        return (
          row.original.de_tai.so_sinh_vien_dang_ky +
          "/" +
          row.original.de_tai.so_luong_sinh_vien
        );
      },
    },
    {
      accessorKey: "Trạng thái đăng ký",
      header: "Trạng thái đăng ký",
      cell: ({ row }: { row: any }) => (
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {row.original.de_tai.so_luong_sinh_vien >
            row.original.de_tai.so_sinh_vien_dang_ky ? (
            <>
              <IconLoader className="mr-1" size={16} /> Còn đăng ký
            </>
          ) : (
            <>
              <IconCircleCheckFilled
                className="fill-green-500 dark:fill-green-400 mr-1"
                size={16}
              />{" "}
              Đã đầy
            </>
          )}
        </Badge>
      ),
    },
    {
      accessorKey: "Nhóm ngành",
      header: "Nhóm ngành",
      cell: ({ row }: { row: any }) => {
        return row.original.de_tai.nhom_nganh;
      },
    },
    {
      accessorKey: "Hệ đào tạo",
      header: "Hệ đào tạo",
      cell: ({ row }: { row: any }) => {
        return row.original.de_tai.he_dao_tao;
      },
    },
    {
      accessorKey: "Giảng viên hướng dẫn",
      header: "GVHD",
      cell: ({ row }: { row: any }) => {
        return (
          row.original.de_tai.huong_dan[0].giang_vien.msgv +
          " - " +
          row.original.de_tai.huong_dan[0].giang_vien.tai_khoan.ho +
          " " +
          row.original.de_tai.huong_dan[0].giang_vien.tai_khoan.ten
        );
      },
    },
    // {
    //   id: "actions",
    //   cell: () => (
    //     <DropdownMenu>
    //       <DropdownMenuTrigger asChild>
    //         <Button
    //           variant="ghost"
    //           className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
    //           size="icon"
    //         >
    //           <IconDotsVertical />
    //           <span className="sr-only">Open menu</span>
    //         </Button>
    //       </DropdownMenuTrigger>
    //       <DropdownMenuContent align="end" className="w-32">
    //         <DropdownMenuItem>Edit</DropdownMenuItem>
    //         <DropdownMenuItem>Make a copy</DropdownMenuItem>
    //         <DropdownMenuItem>Favorite</DropdownMenuItem>
    //         <DropdownMenuSeparator />
    //         <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
    //       </DropdownMenuContent>
    //     </DropdownMenu>
    //   ),
    // },
  ];
  const [textInput, setTextInput] = useState("");
  const [searchingWord, setSearchingWord] = useState<string>("");
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchingWord(textInput);
    }, 500); // ⏱️ Đợi 1000ms

    return () => clearTimeout(timeout); // 🧹 Clear timeout nếu searchingWord thay đổi sớm
  }, [textInput]);

  const [filters, setFilters] = useState({
    soSinhVien: "", // number
    daDangKy: false, // checkbox
    trangThai: "", // select
    nhomNganh: "",
    heDaoTao: "",
    giangVienId: "",
  });

  const resetFilter = () => {
    setFilters({
      soSinhVien: "", // number
      daDangKy: false, // checkbox
      trangThai: "", // select
      nhomNganh: "",
      heDaoTao: "",
      giangVienId: "",
    });
  };

  const [listDeTaiRecommend, setListDeTaiRecommend] = useState<any>([])

  const filteredData = useMemo(() => {
    const keyword = searchingWord.toLowerCase().trim();

    return data.filter((row: any) => {
      const combined = (
        row.de_tai.ma_de_tai +
        row.de_tai.ten_tieng_viet +
        row.de_tai.ten_tieng_anh +
        row.de_tai.so_sinh_vien_dang_ky +
        "/" +
        row.de_tai.so_luong_sinh_vien +
        row.de_tai.nhom_nganh +
        row.de_tai.he_dao_tao +
        row.de_tai.huong_dan?.[0]?.giang_vien?.msgv +
        row.de_tai.huong_dan?.[0]?.giang_vien?.tai_khoan?.ho +
        " " +
        row.de_tai.huong_dan?.[0]?.giang_vien?.tai_khoan?.ten
      )
        .toLowerCase()
        .trim();

      const matchKeyword = combined.includes(keyword);

      // ---- 2. Filter điều kiện ----
      const matchSoSinhVien = filters.soSinhVien
        ? row.de_tai.so_luong_sinh_vien >= parseInt(filters.soSinhVien)
        : true;

      const matchDaDangKy = filters.daDangKy
        ? row.de_tai.so_sinh_vien_dang_ky > 0
        : true;

      const matchTrangThai = filters.trangThai
        ? filters.trangThai === "Đã đầy"
          ? row.de_tai.so_sinh_vien_dang_ky >= row.de_tai.so_luong_sinh_vien
          : row.de_tai.so_sinh_vien_dang_ky < row.de_tai.so_luong_sinh_vien
        : true;

      const matchNhomNganh = filters.nhomNganh
        ? row.de_tai.nhom_nganh === filters.nhomNganh
        : true;

      const matchHeDaoTao = filters.heDaoTao
        ? row.de_tai.he_dao_tao === filters.heDaoTao
        : true;

      const matchGiangVien = filters.giangVienId
        ? row.de_tai.huong_dan?.[0]?.giang_vien?.id_tai_khoan ===
        filters.giangVienId
        : true;

      const recommend = listDeTaiRecommend.length > 0 ?
        listDeTaiRecommend.includes(row.de_tai.id)
        : true

      return (
        matchKeyword &&
        matchSoSinhVien &&
        matchDaDangKy &&
        matchTrangThai &&
        matchNhomNganh &&
        matchHeDaoTao &&
        matchGiangVien &&
        recommend
      );
    })
      .sort((a: any, b: any) => {
        const indexA = listDeTaiRecommend.indexOf(a.de_tai.id);
        const indexB = listDeTaiRecommend.indexOf(b.de_tai.id);

        // nếu không có trong listDeTaiRecommend thì cho xuống cuối
        return (indexA === -1 ? Infinity : indexA) - (indexB === -1 ? Infinity : indexB);
      });;
  }, [data, searchingWord, filters, listDeTaiRecommend]);

  const uniqueGiaoVien = Array.from(
    new Map(
      data
        .map((row: any) => row?.de_tai?.huong_dan?.[0]?.giang_vien)
        .filter(Boolean)
        .map((gv) => [gv.id_tai_khoan, gv]) // dùng Map để loại trùng
    ).values()
  );

  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [onRecommend, setOnRecommend] = useState(false)

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row: any) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <Tabs
      defaultValue="outline"
      className="w-full flex-col justify-start gap-6"
    >
      <div className="flex items-center justify-between px-4 lg:px-6">
        <Label htmlFor="view-selector" className="sr-only">
          View
        </Label>
        <div className="relative w-full mr-5 h-8">
          <Input
            type="search"
            placeholder="Tìm kiếm..."
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            className="h-8 pl-4 pr-10"
          />
          <IconSearch className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
        </div>
        <div className="flex items-center gap-2">
          {user.auth.role === 'Sinh viên' && <Popover>
            <PopoverTrigger asChild className={onRecommend ? "text-yellow-400" : ""}>
              <Button variant={"outline"} size={"sm"}>
                <IconCarambolaFilled />
                <span className="hidden lg:inline">Đề xuất</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-90">
              <ChuDeMultiSelect onRecommend={onRecommend} setOnRecommend={setOnRecommend} setListDeTaiRecommend={setListDeTaiRecommend} />
            </PopoverContent>
          </Popover>}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <IconLayoutColumns />
                <span className="hidden lg:inline">Tùy chỉnh cột</span>
                <span className="lg:hidden">Cột</span>
                <IconChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide()
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant={"outline"} size={"sm"}>
                <ListFilter />
                <span className="hidden lg:inline">Bộ lọc</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-90">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <div className="flex flex-col items-start gap-2">
                    <Label htmlFor="so-sinh-vien-yeu-cau">
                      Số sinh viên yêu cầu
                    </Label>
                    <Input
                      id="so-sinh-vien-yeu-cau"
                      className="col-span-2 h-8"
                      type="number"
                      min={1}
                      value={filters.soSinhVien}
                      onChange={(e) =>
                        setFilters({ ...filters, soSinhVien: e.target.value })
                      }
                    />
                  </div>
                  <Label className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950">
                    <Checkbox
                      id="toggle-2"
                      className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
                      checked={filters.daDangKy}
                      onCheckedChange={(checked) =>
                        setFilters({ ...filters, daDangKy: checked === true })
                      }
                    />
                    <div className="grid gap-1.5 font-normal">
                      <p className="text-sm leading-none font-medium">
                        Đã có sinh viên đăng ký
                      </p>
                      {/* <p className="text-muted-foreground text-sm">
                        You can enable or disable notifications at any time.
                      </p> */}
                    </div>
                  </Label>
                </div>

                <div className="grid gap-2">
                  <div className="flex flex-col items-start gap-2">
                    <Label>Trạng thái đăng ký</Label>
                    <Select
                      value={filters.trangThai}
                      onValueChange={(value) =>
                        setFilters({ ...filters, trangThai: value })
                      }
                    >
                      <SelectTrigger className="h-8 w-full">
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Còn đăng ký">
                          <IconLoader className="mr-1" size={16} /> Còn đăng ký
                        </SelectItem>
                        <SelectItem value="Đã đầy">
                          <IconCircleCheckFilled
                            className="fill-green-500 dark:fill-green-400 mr-1"
                            size={16}
                          />{" "}
                          Đã đầy
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-2">
                  <div className="flex flex-col items-start gap-2">
                    <Label>Nhóm ngành</Label>
                    <Select
                      value={filters.nhomNganh}
                      onValueChange={(value) =>
                        setFilters({ ...filters, nhomNganh: value })
                      }
                    >
                      <SelectTrigger className="h-8 w-full">
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Khoa học Máy tính">
                          Khoa học Máy tính
                        </SelectItem>
                        <SelectItem value="Kỹ thuật Máy tính">
                          Kỹ thuật Máy tính
                        </SelectItem>
                        <SelectItem value="Liên ngành CS-CE">
                          Liên ngành CS-CE
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-2">
                  <div className="flex flex-col items-start gap-2">
                    <Label>Hệ đào tạo</Label>
                    <Select
                      value={filters.heDaoTao}
                      onValueChange={(value) =>
                        setFilters({ ...filters, heDaoTao: value })
                      }
                    >
                      <SelectTrigger className="h-8 w-full">
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Tiếng Việt">Tiếng Việt</SelectItem>
                        <SelectItem value="Tiếng Anh">Tiếng Anh</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-2">
                  <div className="flex flex-col items-start gap-2">
                    <Label>Giảng viên hướng dẫn</Label>
                    <Select
                      value={filters.giangVienId}
                      onValueChange={(value) =>
                        setFilters({ ...filters, giangVienId: value })
                      }
                    >
                      <SelectTrigger className="h-8 w-full">
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                      <SelectContent>
                        {uniqueGiaoVien.map((gv) => (
                          <SelectItem
                            key={gv.id_tai_khoan}
                            value={gv.id_tai_khoan}
                          >
                            {gv.msgv +
                              " - " +
                              gv.tai_khoan?.ho +
                              " " +
                              gv.tai_khoan?.ten}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Button
                    className="w-full"
                    variant={"destructive"}
                    onClick={resetFilter}
                  >
                    Đặt lại bộ lọc
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <TabsContent
        value="outline"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-muted sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="**:data-[slot=table-cell]:first:w-8">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Không có kết quả.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* //-------------------------------------FOOTER-------------------------------------------------------------------------- */}

        <div className="flex items-center justify-between px-4">
          <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
            Tổng số đề tài: {filteredData?.length}
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Dòng mỗi trang
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Trang {table.getState().pagination.pageIndex + 1} của{" "}
              {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Đến đầu trang</span>
                <IconChevronsLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Đến trang trước</span>
                <IconChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Đến trang sau</span>
                <IconChevronRight />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Đến cuối trang</span>
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </div>

        {/* //--------------------------------------------------------END FOOTER-------------------------------------- */}
      </TabsContent>
      <TabsContent
        value="purpose"
        className="flex flex-col px-4 lg:px-6"
      >
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed">
        </div>
      </TabsContent>
    </Tabs>
  );
}

//Nội dung khi bầm vào từng record
function TableCellViewer({
  item,
  setToggle,
}: {
  item: any;
  setToggle: (updater: (prev: boolean) => boolean) => void;
}) {
  const isMobile = useIsMobile();
  const { user }: { user: any } = useAuth();
  const [select, setSelect] = useState(false);
  const [listSinhVienDangKy, setListSinhVienDangKy] = useState([]);

  const fetchListSinhVienDangKy = async () => {
    const response = await fetch(
      `http://localhost:3000/dang-ky/de-tai/${item.de_tai.id}?trang_thai=Đã chấp nhận`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    const data = await response.json();
    if (response.ok) {
      data.forEach(
        (dangKy: any) =>
          dangKy.sinh_vien.id_tai_khoan === user.auth.sub && setSelect(true)
      );
      setListSinhVienDangKy(data);
    } else {
      console.error("Response data not oke: ", data);
    }
  };

  const dangKyDeTai = async () => {
    try {
      const response = await fetch("http://localhost:3000/dang-ky", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          trang_thai: "Đã chấp nhận",
          id_sinh_vien: user.auth.sub,
          id_de_tai: item.de_tai.id,
        }),
      });
      if (response.ok) {
        setSelect(true);
        setToggle((prev) => !prev);
        toast.success('Đăng ký thành công')
      } else {
        const dataError = await response.json();
        toast.error('Đăng ký thất bại', { description: dataError.message })
        console.error(dataError);
      }
    } catch (error) {
      toast.warning('Lỗi hệ thống', { description: 'Vui lòng thử lại sau' })
      console.error(error);
    }
  };

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button
          variant="link"
          className="text-foreground w-fit px-0 text-left"
          onClick={fetchListSinhVienDangKy}
        >
          {item.de_tai.ma_de_tai} - {item.de_tai.ten_tieng_viet}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>{item.de_tai.ten_tieng_viet}</DrawerTitle>
          <DrawerDescription>{item.de_tai.ten_tieng_anh}</DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          <Separator className="border-1" />
          <div className="grid grid-cols-2">
            <div className="flex flex-col gap-5">
              <div className="grid gap-2">
                <div className="flex leading-none font-medium">Mã đề tài</div>
                <div className="text-muted-foreground">
                  {item.de_tai.ma_de_tai}
                </div>
              </div>
              <div className="grid gap-2">
                <div className="flex leading-none font-medium">Hệ đào tạo</div>
                <div className="text-muted-foreground">
                  {item.de_tai.he_dao_tao}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <div className="grid gap-2">
                <div className="flex leading-none font-medium">Giai đoạn</div>
                <div className="text-muted-foreground">
                  {item.de_tai.giai_doan}
                </div>
              </div>
              <div className="grid gap-2">
                <div className="flex leading-none font-medium">Nhóm ngành</div>
                <div className="text-muted-foreground">
                  {item.de_tai.nhom_nganh}
                </div>
              </div>
            </div>
          </div>
          <div className="grid gap-3">
            <div className="flex leading-none font-medium">
              Giảng viên hướng dẫn
            </div>
            <ScrollArea className="h-auto max-h-[150px] w-full rounded-md border px-2">
              {item.de_tai.huong_dan.filter((hd: any) => hd.trang_thai === 'Đã chấp nhận').map((huongDan: any) => (
                <div className="flex flex-row items-center" key={huongDan.id}>
                  <User className="mr-2 scale-75" />
                  <div>
                    <div className="text-sm mt-2">
                      {huongDan.giang_vien.msgv +
                        " - " +
                        huongDan.giang_vien.tai_khoan.ho +
                        " " +
                        huongDan.giang_vien.tai_khoan.ten}
                    </div>
                    <div className="text-sm">
                      {huongDan.giang_vien.tai_khoan.email}
                    </div>
                    <div className="text-sm italic text-gray-500">
                      {huongDan.vai_tro}
                    </div>
                    <Separator className="mt-2" />
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>
          <div className="grid grid-cols-2">
            <div className="grid gap-2">
              <div className="flex leading-none font-medium">
                Số sinh viên đăng ký
              </div>
              <div className="text-muted-foreground">
                {item.de_tai.so_sinh_vien_dang_ky}
              </div>
            </div>
            <div className="grid gap-2">
              <div className="flex leading-none font-medium">
                Số sinh viên yêu cầu
              </div>
              <div className="text-muted-foreground">
                {item.de_tai.so_luong_sinh_vien}
              </div>
            </div>
          </div>
          <div className="grid gap-2">
            <ScrollArea className="h-auto max-h-[150px] w-full rounded-md border px-2">
              {listSinhVienDangKy.map((sinhVienDangKy: any) => (
                <div
                  className="flex flex-row items-center"
                  key={sinhVienDangKy.id}
                >
                  <User className="mr-2 scale-75" />
                  <div>
                    <div className="text-sm mt-2">
                      {sinhVienDangKy.sinh_vien.mssv +
                        " - " +
                        sinhVienDangKy.sinh_vien.tai_khoan.ho +
                        " " +
                        sinhVienDangKy.sinh_vien.tai_khoan.ten}
                    </div>
                    <div className="text-sm">
                      {sinhVienDangKy.sinh_vien.tai_khoan.email}
                    </div>
                    <Separator className="mt-2" />
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>
          <div className="grid gap-2">
            <div className="flex leading-none font-medium">Mô tả</div>
            <div className="text-muted-foreground">{item.de_tai.mo_ta}</div>
          </div>
          <div className="grid gap-2">
            <div className="flex leading-none font-medium">
              Yêu cầu nội dung và số liệu ban đầu
            </div>
            <div className="text-muted-foreground">
              {item.de_tai.yeu_cau_va_so_lieu}
            </div>
          </div>
          <div className="grid gap-2">
            <div className="flex leading-none font-medium">
              Tài liệu tham khảo
            </div>
            <div className="text-muted-foreground">
              {item.de_tai.tai_lieu_tham_khao}
            </div>
          </div>
          <Separator className="border-1" />
          <div className="grid grid-cols-2">
            <div className="grid gap-2">
              <div className="flex leading-none font-medium">Ngày tạo</div>
              <div className="text-muted-foreground">
                {new Date(item.de_tai.ngay_tao).toLocaleString()}
              </div>
            </div>
            <div className="grid gap-2">
              <div className="flex leading-none font-medium">Người duyệt</div>
              <div className="text-muted-foreground">
                {item.giang_vien_truong_bo_mon.msgv +
                  " - " +
                  item.giang_vien_truong_bo_mon.tai_khoan.ho +
                  " " +
                  item.giang_vien_truong_bo_mon.tai_khoan.ten}
              </div>
              <div className="text-muted-foreground">
                {item.giang_vien_truong_bo_mon.tai_khoan.email}
              </div>
            </div>
          </div>
        </div>
        <DrawerFooter>
          {user?.auth?.role === "Sinh viên" &&
            (select ? (
              <Button
                disabled
                className="border-1 border-green-600"
                variant={"ghost"}
              >
                <Check className="text-green-600" />
                Đã đăng ký
              </Button>
            ) : (
              <Button onClick={dangKyDeTai}>Đăng ký</Button>
            ))}
          <DrawerClose asChild>
            <Button variant="outline">Đóng</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
