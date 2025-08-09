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


export default function StudentMultiSelect({ listSinhVien, value, onChange }) {
    const CN = "Chất lượng cao tăng cường tiếng Nhật";
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        if (!listSinhVien || listSinhVien.length === 0) return;
        const validIds = listSinhVien.map((sv) => sv.id);
        const filteredIds = value.filter((id) => validIds.includes(id));

        if (filteredIds.length !== value.length) onChange(filteredIds);
        const selected = listSinhVien.filter((sv) =>
            value.includes(sv.id)
        );
        setSelectedStudents(selected);
    }, [value, listSinhVien]);

    const rawFilteredStudents = listSinhVien.filter((sinhVien) =>
        sinhVien.mssv.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredStudents = rawFilteredStudents.filter((sinhVien) => {
        if (selectedStudents.length === 0) return true;

        const hasCN = selectedStudents.some(sv => sv.he_dao_tao === CN);
        const hasNotCN = selectedStudents.some(sv => sv.he_dao_tao !== CN);

        if (hasCN) return sinhVien.he_dao_tao === CN;
        if (hasNotCN) return sinhVien.he_dao_tao !== CN;

        return true; // fallback (an toàn)
    });


    const handleSelectStudent = (student) => {
        if (!selectedStudents.find((s) => s.id === student.id)) {
            onChange([...value, student.id])
        } else {
            handleRemoveStudent(student.id)
        }
    };

    const handleRemoveStudent = (id) => {
        const newIdSinhVien = value.filter((s) => s !== id)
        onChange(newIdSinhVien)
    };

    const isSelected = (student) =>
        selectedStudents.some((s) => s.id === student.id);

    const postfix = (string: string) => string === "Khoa học Máy tính" ? "KH"
        : string === "Kỹ thuật Máy tính" ? "KT"
            : string === "Chính quy" ? "CQ"
                : string === "Văn bằng 2" ? "B2"
                    : string === "Vừa làm vừa học" ? "VLVH"
                        : string === "Song ngành" ? "SN"
                            : string === "Đào tạo từ xa" ? "TX"
                                : string === "Chất lượng cao tăng cường tiếng Nhật" ? "CN"
                                    : "CC"

    return (
        <div className="w-full max-w-xl">
            <Dialog>
                <div className="w-full space-y-2">
                    <div className="flex flex-wrap gap-2 min-h-12 border-2 rounded-xl p-2">
                        {selectedStudents.length === 0 ? (
                            <span className="text-muted-foreground">Chưa có sinh viên nào được chọn</span>
                        ) : (
                            selectedStudents.map((student) => (
                                <Badge
                                    key={student.id}
                                    variant="secondary"
                                    className="flex items-center gap-1"
                                >
                                    {student.mssv} - {student.ho_ten} ({postfix(student.nganh) + " - " + postfix(student.he_dao_tao)})
                                    <button
                                        type='button'
                                        className="ml-1 rounded-sm p-0.5 hover:text-red-500 focus:outline-none"
                                        onClick={() => handleRemoveStudent(student.id)}
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </Badge>
                            ))
                        )}
                    </div>

                    <DialogTrigger asChild>
                        <Button variant="outline" className="w-full">Chọn sinh viên</Button>
                    </DialogTrigger>
                </div>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Chọn sinh viên</DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>

                    <div className="flex items-center gap-2 mb-2">
                        <UserSearch className="w-5 h-5 text-muted-foreground" />
                        <Input
                            placeholder="Tìm kiếm theo mã số sinh viên..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value)
                                setShowResults(false)
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    setShowResults(true);
                                }
                            }}
                        />
                        <Button size="sm" onClick={() => setShowResults(true)}>
                            Tìm kiếm
                        </Button>
                    </div>

                    {showResults && searchTerm.trim() !== '' && (
                        <ScrollArea className="max-h-100 border rounded-md px-2 pb-2 space-y-2">
                            {filteredStudents.length === 0 ? (
                                <div className="text-sm text-muted-foreground">
                                    Không tìm thấy sinh viên phù hợp.
                                </div>
                            ) : (
                                filteredStudents.map((student) => {
                                    const selected = isSelected(student);
                                    return (
                                        <div
                                            key={student.id}
                                            className={`p-2 mt-2 border rounded-md cursor-pointer flex justify-between items-center hover:bg-muted transition ${selected ? 'bg-muted' : ''}`}
                                            onClick={() => handleSelectStudent(student)}
                                        >
                                            <div>
                                                <div className="font-medium">
                                                    {student.mssv} ({student.ho_ten})
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {student.nganh} - {student.he_dao_tao}
                                                </div>
                                            </div>
                                            {selected && <Check className="text-green-500 w-4 h-4" />}
                                        </div>
                                    );
                                })
                            )}
                        </ScrollArea>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}