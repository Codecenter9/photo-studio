import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import AdminLayout from "./AdminLayout";

export default async function AdminMainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/auth/login");
    }

    if (session.user.role !== "admin") {
        redirect("/unauthorized");
    }
    return <AdminLayout session={session}>{children}</AdminLayout>;
}