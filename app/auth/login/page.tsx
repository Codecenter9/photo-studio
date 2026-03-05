"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { TextField, Button, Box, CircularProgress } from "@mui/material";
interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {

  const router = useRouter();

  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const [fieldErrors, setFieldErrors] = useState<Partial<LoginForm>>(
    {}
  );
  const [authError, setAuthError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof LoginForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    setAuthError(null);
  };

  const handleEmailLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setLoading(true);
    setFieldErrors({});
    setAuthError(null);

    const errors: Partial<LoginForm> = {};
    if (!form.email) errors.email = "Email is required";
    if (!form.password) errors.password = "Password is required";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setLoading(false);
      return;
    }

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: form.email,
        password: form.password,
      });

      if (res?.error) {
        setAuthError("Invalid email or password");
        return;
      }

      const sessionRes = await axios.get("/api/auth/session");
      const role = sessionRes.data?.user?.role;

      if (role === "admin") {
        router.push("/admin");
      } else if (role === "client") {
        router.push("/client");
      } else {
        router.push("/");
      }
    } catch (err) {
      console.log("errors:", err)
      setAuthError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex-1 flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/studiophoto/studio (3).webp')" }}
    >

      <div className="max-w-md w-full p-8 rounded-md bg-white/5 backdrop-blur-2xl shadow-sm">
        <h1 className="text-2xl font-semibold mb-6 text-center text-gray-900">
          Sign In
        </h1>

        {authError && (
          <Box
            className="w-full flex px-3 items-center justify-start mb-4 py-1.5 rounded-md bg-amber-200"
          >
            <p className="text-red-600 text-sm text-center">
              {authError}
            </p>
          </Box>
        )}

        <form
          onSubmit={handleEmailLogin}
          className="flex flex-col gap-4"
        >
          <TextField
            label="Email"
            type="email"
            placeholder="Enter your email"
            fullWidth
            size="small"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            error={!!fieldErrors.email}
            helperText={fieldErrors.email}
          />

          <TextField
            label="Password"
            type="password"
            placeholder="Enter your password"
            fullWidth
            size="small"
            value={form.password}
            onChange={(e) =>
              handleChange("password", e.target.value)
            }
            error={!!fieldErrors.password}
            helperText={fieldErrors.password}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
          >
            {loading ? <span className="flex items-center justify-center"><CircularProgress enableTrackSlot size={15} className="mr-2" />Signing in...</span> : "Sign In"}
          </Button>
        </form>

        <p className="mt-6 text-center text-gray-600 text-sm">
          Not a member yet?{" "}
          <Link
            href="/auth/register"
            className="text-blue-600 font-medium"
          >
            Register
          </Link>
        </p>
      </div>
    </div >
  );
}