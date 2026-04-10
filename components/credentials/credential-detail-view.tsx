"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { DeleteCredentialDialog } from "@/components/credentials/delete-credential-dialog";
import { RevealPasswordButton } from "@/components/credentials/reveal-password-button";
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

type Props = {
  credential: Credential;
};

export function CredentialDetailView({ credential }: Props) {
  const router = useRouter();

  return (
    <div className="space-y-6 rounded-xl border bg-card p-4 shadow-sm sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{credential.serviceName}</h1>
          <p className="text-sm text-muted-foreground">{credential.loginId}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href={`/credentials/${credential.id}/edit`}>Edit</Link>
          </Button>
          <DeleteCredentialDialog
            credentialId={credential.id}
            serviceName={credential.serviceName}
            onDeleted={() => router.push("/credentials")}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <DetailItem label="URL" value={credential.url} isLink />
        <DetailItem label="Purpose" value={credential.purpose} />
        <DetailItem label="Category" value={credential.category ?? "-"} />
        <DetailItem label="Favorite" value={credential.isFavorite ? "Yes" : "No"} />
        <DetailItem
          label="Last Accessed"
          value={credential.lastAccessedAt ? new Date(credential.lastAccessedAt).toLocaleString() : "Never"}
        />
        <DetailItem label="Updated At" value={new Date(credential.updatedAt).toLocaleString()} />
      </div>

      <div className="space-y-1">
        <p className="text-sm font-medium">Notes</p>
        <p className="rounded-md border bg-muted px-3 py-2 text-sm">{credential.notes || "-"}</p>
      </div>

      <RevealPasswordButton credentialId={credential.id} />
    </div>
  );
}

function DetailItem({ label, value, isLink }: { label: string; value: string; isLink?: boolean }) {
  return (
    <div className="space-y-1">
      <p className="text-sm font-medium">{label}</p>
      {isLink ? (
        <a className="text-sm text-primary underline underline-offset-2" href={value} target="_blank" rel="noreferrer">
          {value}
        </a>
      ) : (
        <p className="text-sm">{value}</p>
      )}
    </div>
  );
}
