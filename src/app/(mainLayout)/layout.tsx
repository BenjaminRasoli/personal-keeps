"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { MoonLoader } from "react-spinners";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <MoonLoader size={80} />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
