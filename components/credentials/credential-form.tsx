"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";

const baseSchema = z.object({
  serviceName: z.string().trim().min(1, "Service name is required").max(100),
  loginId: z.string().trim().min(1, "Login ID is required").max(150),
  url: z.string().trim().url("Enter a valid URL").max(2048),
  purpose: z.string().trim().min(1, "Purpose is required").max(300),
  category: z.string().trim().max(500).optional().nullable(),
  notes: z.string().trim().max(500).optional().nullable(),
  isFavorite: z.boolean().default(false),
});

const createSchema = baseSchema.extend({
  password: z.string().min(1, "Password is required").max(512),
});

const updateSchema = baseSchema.extend({
  password: z.string().max(512).optional(),
});

export type CredentialFormValues = z.infer<typeof createSchema>;

type Props = {
  mode: "create" | "edit";
  initialValues?: Partial<CredentialFormValues>;
  submitLabel: string;
  onSubmit: (values: CredentialFormValues) => Promise<void>;
};

export function CredentialForm({
  mode,
  initialValues,
  submitLabel,
  onSubmit,
}: Props) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const schema = useMemo(() => (mode === "create" ? createSchema : updateSchema), [mode]);

  const form = useForm<CredentialFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      serviceName: initialValues?.serviceName ?? "",
      loginId: initialValues?.loginId ?? "",
      password: "",
      url: initialValues?.url ?? "",
      purpose: initialValues?.purpose ?? "",
      category: initialValues?.category ?? "",
      notes: initialValues?.notes ?? "",
      isFavorite: initialValues?.isFavorite ?? false,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <form
      className="space-y-5 rounded-xl border bg-card p-4 shadow-sm sm:p-6"
      onSubmit={handleSubmit(async (values) => {
        try {
          setSubmitError(null);
          const payload: CredentialFormValues = {
            ...values,
            category: values.category || null,
            notes: values.notes || null,
          };

          if (mode === "edit" && !payload.password) {
            delete payload.password;
          }

          await onSubmit(payload);
        } catch (error) {
          setSubmitError(error instanceof Error ? error.message : "Failed to save credential");
        }
      })}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Service Name</label>
          <input className="w-full rounded-md border bg-background px-3 py-2 text-sm" {...register("serviceName")} />
          {errors.serviceName ? <p className="text-xs text-destructive">{errors.serviceName.message}</p> : null}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Login ID</label>
          <input className="w-full rounded-md border bg-background px-3 py-2 text-sm" {...register("loginId")} />
          {errors.loginId ? <p className="text-xs text-destructive">{errors.loginId.message}</p> : null}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">{mode === "create" ? "Password" : "Password (optional)"}</label>
        <input type="password" className="w-full rounded-md border bg-background px-3 py-2 text-sm" {...register("password")} />
        {errors.password ? <p className="text-xs text-destructive">{errors.password.message}</p> : null}
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">URL</label>
        <input className="w-full rounded-md border bg-background px-3 py-2 text-sm" placeholder="https://..." {...register("url")} />
        {errors.url ? <p className="text-xs text-destructive">{errors.url.message}</p> : null}
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">Purpose</label>
        <input className="w-full rounded-md border bg-background px-3 py-2 text-sm" {...register("purpose")} />
        {errors.purpose ? <p className="text-xs text-destructive">{errors.purpose.message}</p> : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Category (optional)</label>
          <input className="w-full rounded-md border bg-background px-3 py-2 text-sm" {...register("category")} />
          {errors.category ? <p className="text-xs text-destructive">{errors.category.message}</p> : null}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Notes (optional)</label>
          <textarea className="min-h-24 w-full rounded-md border bg-background px-3 py-2 text-sm" {...register("notes")} />
          {errors.notes ? <p className="text-xs text-destructive">{errors.notes.message}</p> : null}
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm font-medium">
        <input type="checkbox" {...register("isFavorite")} />
        Mark as favorite
      </label>

      {submitError ? <p className="text-sm text-destructive">{submitError}</p> : null}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}
