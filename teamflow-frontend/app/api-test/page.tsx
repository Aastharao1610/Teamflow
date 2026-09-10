"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function ApiTestPage() {
  const [message, setMessage] = useState("Testing connection...");

  useEffect(() => {
    api;
    api
      .get("/../../health")
      .then((response) => {
        setMessage(`SUCCESS: ${response.data.message}`);
      })
      .catch((error) => {
        setMessage(`ERROR: ${error.response?.data?.message || error.message}`);
      });
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 p-6">
      <div className="rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="text-lg font-semibold text-zinc-950">
          API Connection Test
        </h1>
        <p className="mt-3 text-sm text-zinc-500">{message}</p>
      </div>
    </main>
  );
}
