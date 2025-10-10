"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { MoonLoader } from "react-spinners";
import Footer from "../components/Footer";
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
    <>
      <SetBodyClass className="bg-background" />
      <div
        className="min-h-screen min-w-full bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: 'url("/backgroundImage.jpg")',
        }}
      >
        <Navbar />
        {children}
        <Footer />
      </div>
    </>
  );
}
