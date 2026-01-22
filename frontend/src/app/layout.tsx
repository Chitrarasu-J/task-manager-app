import "./globals.css";
import { ReactNode } from "react";
import { AuthProvider } from "../context/AuthContext";

export const metadata = {
  title: "Task Management System",
  description: "Secure full-stack task manager",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
