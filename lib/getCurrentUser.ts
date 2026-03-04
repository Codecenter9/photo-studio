import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import dbConnection from "@/lib/mongodb";
import User from "@/model/User";

export const getCurrentUser = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) return null;

  await dbConnection();

  const user = await User.findById(session.user.id);

  if (!user) return null;

  return user;
};