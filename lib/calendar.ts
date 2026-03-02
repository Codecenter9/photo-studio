// lib/calendar.ts
import { toEthiopian, toGregorian } from "ethiopian-date";

const ETH_MONTHS = [
    "መስከረም", "ጥቅምት", "ኅዳር", "ታኅሣሥ",
    "ጥር", "የካቲት", "መጋቢት", "ሚያዝያ",
    "ግንቦት", "ሰኔ", "ሐምሌ", "ነሐሴ", "ጳጉሜን",
];

export function toEthiopianDate(date: Date) {
    const [year, month, day] = toEthiopian(
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate()
    );
    return { year, month, day };
}

export function toGregorianDate(year: number, month: number, day: number) {
    const [gy, gm, gd] = toGregorian(year, month, day);
    return new Date(gy, gm - 1, gd);
}

export function formatDate(
    date: Date | string | number | null | undefined,
    mode: "gregorian" | "ethiopian"
) {
    if (!date) return "-";

    const dt = date instanceof Date ? date : new Date(date);
    if (isNaN(dt.getTime())) return "-"; 

    if (mode === "gregorian") {
        return dt.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    }

    const { year, month, day } = toEthiopianDate(dt);
    const monthName = ETH_MONTHS[month - 1]; 

    return `${day.toString().padStart(2, "0")} ${monthName} ${year}`;
}