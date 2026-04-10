"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { CredentialTable } from "@/components/credentials/credential-table";
import { Button } from "@/components/ui/button";

type Credential = {
  id: string;
  serviceName: string;
  loginId: string;
  purpose: string;
  category: string | null;
};

export default function CredentialsListPage() {
  const [data, setData] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/credentials", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load credentials");
        const json = (await res.json()) as { success?: boolean; data?: Credential[] };
        setData(Array.isArray(json.data) ? json.data : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load credentials");
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 p-4 sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Credential Vault</h1>
        <Button asChild>
          <Link href="/credentials/new">Add Credential</Link>
        </Button>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Saved Credentials</h2>
        {loading ? <p className="text-sm text-muted-foreground">Loading credentials...</p> : null}
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        {!loading && !error ? <CredentialTable credentials={data} /> : null}
      </section>
    </main>
  );
}
