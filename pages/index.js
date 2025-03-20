"use client";

import { useEffect } from "react";
import { useRouter } from "next/router"; // Import Next.js router for redirection

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/login");
  }, [router]);

  return null; 
}
