"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import axios from "axios";
import { handleError } from "@/lib/error";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  role: string;
}

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState<RegisterForm>({
    name: "",
    email: "",
    password: "",
    role: "client",
  });

  const [fieldErrors, setFieldErrors] = useState<Partial<RegisterForm>>({});
  const [authError, setAuthError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof RegisterForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    setAuthError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setFieldErrors({});
    setAuthError(null);

    const errors: Partial<RegisterForm> = {};
    if (!form.name) errors.name = "Name is required";
    if (!form.email) errors.email = "Email is required";
    if (!form.password) errors.password = "Password is required";
    if (!form.role) errors.role = "Role is required";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("/api/auth/user", form);

      if (response.status === 201) {
        router.push("/auth/login");
        return;
      }

      setAuthError("Registration failed. Try again.");
    } catch (err: unknown) {
      const errorMessage = handleError(err);
      setAuthError(errorMessage);

      if (axios.isAxiosError(err) && err.response?.data?.errors) {
        setFieldErrors(err.response.data.errors);
      }
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
          Create Acount
        </h1>

        {authError && (
          <div className="mb-4 p-2 rounded-md bg-red-100">
            <p className="text-red-600 text-sm text-center">{authError}</p>
          </div>
        )}

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <TextField
            label="Full Name"
            fullWidth
            size="small"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            error={!!fieldErrors.name}
            helperText={fieldErrors.name}
          />

          <TextField
            label="Email"
            type="email"
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
            fullWidth
            size="small"
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
            error={!!fieldErrors.password}
            helperText={fieldErrors.password}
          />

          <FormControl fullWidth size="small" error={!!fieldErrors.role}>
            <InputLabel>Select Role</InputLabel>
            <Select
              value={form.role}
              label="Select Role"
              onChange={(e) => handleChange("role", e.target.value)}
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="client">Client</MenuItem>
            </Select>
          </FormControl>

          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-2 justify-center">
                <CircularProgress size={15} /> Saving...
              </span>
            ) : (
              "Register"
            )}
          </Button>

          <p className="mt-4 text-center text-gray-600 text-sm">
            Already a member?{" "}
            <Link href="/auth/login" className="text-blue-600 font-medium">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}