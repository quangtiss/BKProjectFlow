import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Check, UserSearch, X } from 'lucide-react';
import { DialogDescription } from '@radix-ui/react-dialog';
import { toast } from 'sonner';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { useAuth } from '@/routes/auth-context';


export default function ChuDeMultiSelect({ onRecommend, setOnRecommend, setListDeTaiRecommend }: { onRecommend: any, setOnRecommend: any, setListDeTaiRecommend: any }) {
    const { user }: { user: any } = useAuth()
    const [listChuDe, setListChuDe] = useState<Array<object>>([])
    const [selectChuDe, setSelectChuDe] = useState<Array<object>>([])
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [response1, response2] = await Promise.all([
                    fetch('http://localhost:3000/chu-de', {
                        method: 'GET',
                        credentials: 'include'
                    }),
                    fetch(`http://localhost:3000/moi-quan-tam/sinh-vien/${user.auth.sub}`, {
                        method: 'GET',
                        credentials: 'include'
                    })
                ])
                const data1 = await response1.json()
                if (!response1.ok) {
                    console.warn(data1)
                    toast.error("Lỗi", { description: data1.message })
                }
                else setListChuDe(data1)

                const data2 = await response2.json()
                if (!response2.ok) {
                    console.warn(data2)
                    toast.error("Lỗi", { description: data2.message })
                }
                else {
                    const listChuDeSelected = data2.map((data: any) => data1.find((chuDe: any) => chuDe.id === data.id_chu_de));
                    setSelectChuDe(listChuDeSelected)
                }
            } catch (error) {
                console.error(error)
            }
        }
        fetchData()
    }, []);


    useEffect(() => {
        setListDeTaiRecommend([])
        if (onRecommend && user.auth.role === "Sinh viên") {
            const fetchDeTaiRecommend = async () => {
                try {
                    const response = await fetch('http://localhost:3000/utils/get-recommend', {
                        method: 'GET',
                        credentials: 'include'
                    })
                    const data = await response.json()
                    if (!response.ok) toast.error('Lỗi khi lấy đề xuất', {
                        description: data.message
                    })
                    else {
                        setListDeTaiRecommend(data)
                    }
                } catch (error) {
                    toast.warning('Lỗi khi lấy đề xuất')
                    console.error(error)
                }
            }
            fetchDeTaiRecommend()
        }
    }, [onRecommend])


    const handleSelectChuDe = (chuDe: any) => {
        if (selectChuDe.some((cd: any) => cd.id === chuDe.id)) handleRemoveChuDe(chuDe)
        else setSelectChuDe((prev) => [...prev, chuDe])
    }

    const handleRemoveChuDe = (chuDe: any) => {
        setSelectChuDe(prev => prev.filter((cd: any) => cd.id !== chuDe.id))
    }

    const filterChuDe = listChuDe.filter((chuDe: any) => {
        const keyword = chuDe.ten_tieng_viet + " " + chuDe.ten_tieng_anh
        return searchTerm !== "" ? keyword.includes(searchTerm) : true;
    })


    const handleSubmit = async () => {
        const result = selectChuDe.map((cd: any) => cd.id);

        try {
            const response = await fetch('http://localhost:3000/moi-quan-tam', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id_user: user.auth.sub,
                    list_id_chu_de: result
                })
            })
            const data = await response.json()
            if (response.ok) {
                toast.success('Đã lưu lại')
                setOnRecommend(false)
            }
            else toast.error('Không thể lưu', {
                description: data.message,

            })
        } catch (error) {
            toast.warning('Lỗi hệ thống, vui lòng thử lại sau')
            console.error(error)
        }
    };



    return (
        <div className="w-full">
            <Dialog>
                <div className="w-full space-y-2">
                    <div className="flex flex-wrap gap-2 min-h-12 border-2 rounded-xl p-2 overflow-x-auto">
                        {selectChuDe.length === 0 ? (
                            <span className="text-muted-foreground">Chưa chọn chủ đề nào</span>
                        ) : (
                            selectChuDe.map((chuDe: any) => (
                                <Badge
                                    key={chuDe.id}
                                    variant="secondary"
                                    className="flex items-center gap-1"
                                >
                                    {chuDe.ten_tieng_viet + "( " + chuDe.ten_tieng_anh + " )"}
                                    <button
                                        type='button'
                                        className="ml-1 rounded-sm p-0.5 hover:text-red-500 focus:outline-none"
                                        onClick={() => handleRemoveChuDe(chuDe)}
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </Badge>
                            ))
                        )}
                    </div>

                    <DialogTrigger asChild>
                        <Button variant="outline" className="w-full">Chọn chủ đề</Button>
                    </DialogTrigger>
                    <Button className='w-full' onClick={() => handleSubmit()}>Lưu</Button>
                    <Label className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-green-600 has-[[aria-checked=true]]:bg-green-50 dark:has-[[aria-checked=true]]:border-green-900 dark:has-[[aria-checked=true]]:bg-green-950">
                        <Checkbox
                            id="toggle-2"
                            className="data-[state=checked]:border-green-600 data-[state=checked]:bg-green-600 data-[state=checked]:text-white dark:data-[state=checked]:border-green-700 dark:data-[state=checked]:bg-green-700"
                            checked={onRecommend}
                            onCheckedChange={(checked) => {
                                setOnRecommend(checked)
                            }}
                        />
                        <div className="grid gap-1.5 font-normal">
                            <p className="text-sm leading-none font-medium">
                                Áp dụng đề xuất
                            </p>
                        </div>
                    </Label>
                </div>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Chọn chủ đề</DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>

                    <div className="flex items-center gap-2 mb-2">
                        <UserSearch className="w-5 h-5 text-muted-foreground" />
                        <Input
                            placeholder="Tìm kiếm theo tên chủ đề..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value.trim())}
                        />
                    </div>

                    <ScrollArea className="max-h-100 border rounded-md px-2 pb-2 space-y-2">
                        {filterChuDe.length === 0 && searchTerm !== "" ? (
                            <div className="text-sm text-muted-foreground">
                                Không tìm thấy chủ đề
                            </div>
                        ) : (
                            filterChuDe.map((chuDe: any) => {
                                const select = selectChuDe.some((cd: any) => cd.id === chuDe.id)
                                return (
                                    <div
                                        key={chuDe.id}
                                        className={`p-2 mt-2 border rounded-md cursor-pointer flex justify-between items-center hover:bg-muted transition ${(select) ? 'bg-green-400/30' : ''}`}
                                        onClick={() => handleSelectChuDe(chuDe)}
                                    >
                                        <div className="text-sm">
                                            {chuDe.ten_tieng_viet + "( " + chuDe.ten_tieng_anh + " )"}
                                        </div>
                                        {select && <Check className="text-green-500 w-4 h-4" />}
                                    </div>
                                );
                            })
                        )}
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </div>
    );
}