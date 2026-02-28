"use client";

import { useSession } from "next-auth/react";

export const useCurrentUser = () => {
  const { data: session, status } = useSession();

  return {
    loggedInUser: session?.user ?? null,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
  };
};