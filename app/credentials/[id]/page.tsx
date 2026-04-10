"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { CredentialDetailView } from "@/components/credentials/credential-detail-view";
import { Button } from "@/components/ui/button";

type Credential = {
  id: string;
  serviceName: string;
  loginId: string;
  url: string;
  purpose: string;
  category: string | null;
  notes: string | null;
  isFavorite: boolean;
  lastAccessedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export default function ViewCredentialPage() {
  const params = useParams<{ id: string }>();
  const [credential, setCredential] = useState<Credential | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/credentials/${params.id}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch credential");
        const json = (await res.json()) as { data: Credential };
        setCredential(json.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch credential");
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [params.id]);

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 p-4 sm:p-6">
      <div className="mb-5">
        <Button asChild variant="outline">
          <Link href="/credentials">Back to List</Link>
        </Button>
      </div>
      {loading ? <p className="text-sm text-muted-foreground">Loading credential...</p> : null}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {credential ? <CredentialDetailView credential={credential} /> : null}
    </main>
  );
}
