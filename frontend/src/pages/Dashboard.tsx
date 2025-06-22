import { SectionCards } from "@/components/dashboard/section-cards";
import { ChartAreaInteractive } from "@/components/dashboard/chart-area-interactive";
import { DataTable } from "@/components/dashboard/data-table";
import { useState, useEffect } from "react";

export default function Dashboard() {
    const [data, setData] = useState([])

    useEffect(() => {
        const fetchTest = async () => {
            const res = await fetch("http://localhost:3000/de_tai", {
                method: "GET",
                credentials: 'include'
            })
            const dataRes = await res.json()
            setData(dataRes)
            console.log(dataRes);
        }
        fetchTest()
    }, [])

    return (
        <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                    <SectionCards />
                    <div className="px-4 lg:px-6">
                        <ChartAreaInteractive />
                    </div>
                    <DataTable data={data} />
                </div>
            </div>
        </div>
    );
}