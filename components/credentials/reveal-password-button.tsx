"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

type Props = {
  credentialId: string;
};

export function RevealPasswordButton({ credentialId }: Props) {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleReveal() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/credentials/${credentialId}/reveal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirm: true }),
      });
      if (!res.ok) {
        throw new Error("Unable to reveal password");
      }
      const json = (await res.json()) as { data: { password: string } };
      setPassword(json.data.password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reveal failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <Button size="sm" variant="outline" onClick={handleReveal} disabled={loading}>
        {loading ? "Revealing..." : "Reveal Password"}
      </Button>
      {password ? <p className="rounded-md border bg-muted px-3 py-2 font-mono text-sm">{password}</p> : null}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
