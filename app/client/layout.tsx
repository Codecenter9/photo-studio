import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import ClientLayout from "./ClientLayout";

export default async function ClientMainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/auth/login");
    }

    if (session.user.role !== "client") {
        redirect("/unauthorized");
    }

    return <ClientLayout session={session}>{children}</ClientLayout>;
}