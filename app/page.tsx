import { Button } from "@mui/material";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-gray-50">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8">
        Welcome to Our Studio
      </h1>

      <Link
        href="/auth/login"

      >
        <Button size="small" variant="outlined">GO TO LOGIN PAGE</Button>
      </Link>
    </div>
  );
}
