
import type { Metadata } from "next";
import "./globals.css";
import FrontLayout from "./frontLayout";

export const metadata: Metadata = {
  title: "Photo Studio | Capture Moments",
  description: "Capture Moments",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <FrontLayout>{children}</FrontLayout>
  );
}
