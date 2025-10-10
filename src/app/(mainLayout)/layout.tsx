"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { MoonLoader } from "react-spinners";
import { SetBodyClass } from "../components/SetBodyClass";

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
    <div className="relative h-screen w-screen overflow-hidden">
      <SetBodyClass className="bg-background" />
      <img
        src="/backgroundImage.jpg"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover object-center -z-10"
      />

      <div className="relative z-10 h-full w-full flex flex-col">
        <Navbar />
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
}
