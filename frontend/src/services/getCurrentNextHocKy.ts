type HocKy = {
    id: number;
    ten_hoc_ky: number;
    nam_hoc: number;
    ngay_bat_dau: string; // ví dụ "2025-09-01"
};

export function getCurrentAndNextHocKy(hocKyList: HocKy[]) {
    const sorted = [...hocKyList].sort(
        (a, b) => new Date(a.ngay_bat_dau).getTime() - new Date(b.ngay_bat_dau).getTime()
    );

    const now = new Date();

    let current: HocKy | null = null;
    let next: HocKy | null = null;

    for (let i = 0; i < sorted.length; i++) {
        const start = new Date(sorted[i].ngay_bat_dau);

        // Nếu now >= start thì đây có thể là current
        if (now >= start) {
            current = sorted[i];
            // Kiểm tra học kỳ kế tiếp
            if (i + 1 < sorted.length && now < new Date(sorted[i + 1].ngay_bat_dau)) {
                next = sorted[i + 1];
                break;
            }
        }

        // Nếu now < start thì học kỳ này chính là tiếp theo
        if (now < start) {
            next = sorted[i];
            break;
        }
    }

    return { current, next };
}
