import { SectionCards } from "@/components/dashboard/section-cards";
import { ChartAreaInteractive } from "@/components/dashboard/chart-area-interactive";
import { DataTable } from "@/components/dashboard/data-table";
import { getDeTai } from "@/services/de_tai/get_de_tai";
import { useState, useEffect } from "react";

export default function Dashboard() {
    const [data, setData] = useState([])

    useEffect(() => {
        const fetchDataDeTai = async () => {
            const dataDeTai = await getDeTai();
            setData(dataDeTai)
        }
        fetchDataDeTai()
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