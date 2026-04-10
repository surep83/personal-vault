"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { CredentialForm, type CredentialFormValues } from "@/components/credentials/credential-form";
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
};

export default function EditCredentialPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
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

  async function handleUpdate(values: CredentialFormValues) {
    const res = await fetch(`/api/credentials/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!res.ok) {
      throw new Error("Failed to update credential");
    }
    router.push(`/credentials/${params.id}`);
    router.refresh();
  }

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 p-4 sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Edit Credential</h1>
        <Button asChild variant="outline">
          <Link href={`/credentials/${params.id}`}>Back</Link>
        </Button>
      </div>

      {loading ? <p className="text-sm text-muted-foreground">Loading credential...</p> : null}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {credential ? (
        <CredentialForm
          mode="edit"
          submitLabel="Save Changes"
          initialValues={credential}
          onSubmit={handleUpdate}
        />
      ) : null}
    </main>
  );
}
