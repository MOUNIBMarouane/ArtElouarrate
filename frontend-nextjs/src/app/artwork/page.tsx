"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ArtworkIndexPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to gallery page when someone visits /artwork without an ID
    router.push("/gallery");
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-900 pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-amber-500"></div>
        </div>
      </div>
    </div>
  );
}
