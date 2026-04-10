"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { CredentialForm, type CredentialFormValues } from "@/components/credentials/credential-form";
import { Button } from "@/components/ui/button";

export default function AddCredentialPage() {
  const router = useRouter();

  async function handleCreate(values: CredentialFormValues) {
    try {
      const res = await fetch("/api/credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        throw new Error("Failed to create credential");
      }

      toast.success("Credential created successfully");
      router.push("/credentials");
      router.refresh();
    } catch {
      toast.error("Failed to create credential");
      throw new Error("Failed to create credential");
    }
  }

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 p-4 sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Add Credential</h1>
        <Button asChild variant="outline">
          <Link href="/credentials">Back</Link>
        </Button>
      </div>
      <CredentialForm mode="create" submitLabel="Create Credential" onSubmit={handleCreate} />
    </main>
  );
}
