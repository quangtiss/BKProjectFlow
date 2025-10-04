import { useAuth } from "@/routes/auth-context"
import { IconPointFilled } from "@tabler/icons-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

export default function ThongBao() {
    const [listTuongTac, setListTuongTac] = useState([])
    const navigate = useNavigate()
    const { badgeCount, setBadgeCount } = useAuth()

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch('http://localhost:3000/tuong-tac/nguoi-dung', {
                method: 'GET',
                credentials: 'include'
            })
            const data = await res.json()
            if (res.ok) setListTuongTac(data.sort((a: any, b: any) => a.id - b.id))
            else toast.error('Lỗi khi lấy thông báo', { description: data.message })
        }
        fetchData()
    }, [badgeCount])


    async function setRead(idTuongTac: number) {
        const res = await fetch('http://localhost:3000/tuong-tac/' + idTuongTac, {
            method: 'GET',
            credentials: 'include'
        })
        if (res.ok) {
            setBadgeCount((prev: any) => prev - 1)
        }
    }

    return (
        <div className="border-2 rounded-2xl border-dashed m-5 sm:m-20 p-5 sm:p-20 flex flex-col gap-10">
            {listTuongTac?.length > 0 ? listTuongTac.map((tuongTac: any) => (
                <div key={tuongTac.id} className={`flex justify-between items-center p-4 border-2 rounded-2xl shadow hover:cursor-pointer ${!tuongTac.da_doc_chua ? 'bg-blue-500/20' : ''}`}>
                    <div className="flex flex-col gap-4" onClick={() => {
                        if (tuongTac.thong_bao.duong_dan) navigate(tuongTac.thong_bao.duong_dan)
                        if (!tuongTac.da_doc_chua) setRead(tuongTac.id)
                    }}>
                        <div className="text-xl font-extrabold">{tuongTac.thong_bao.tieu_de}</div>
                        <div className="text-foreground/50">{tuongTac.thong_bao.noi_dung}</div>
                    </div>
                    {!tuongTac.da_doc_chua && <IconPointFilled className="text-blue-500" />}
                </div>
            ))
                :
                <div className="text-center font-bold text-gray-500 text-xl">Không có thông báo nào ...</div>}
        </div>
    )
}