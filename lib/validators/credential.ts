import { z } from "zod";

const optionalStringField = z
  .string()
  .trim()
  .min(1)
  .max(500)
  .optional()
  .nullable();

export const credentialIdParamSchema = z.object({
  id: z.string().trim().min(1),
});

export const createCredentialSchema = z.object({
  serviceName: z.string().trim().min(1).max(100),
  loginId: z.string().trim().min(1).max(150),
  password: z.string().min(1).max(512),
  url: z.string().trim().url().max(2048),
  purpose: z.string().trim().min(1).max(300),
  category: optionalStringField,
  notes: optionalStringField,
  isFavorite: z.boolean().optional().default(false),
});

export const updateCredentialSchema = createCredentialSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  {
    message: "At least one field is required for update",
  },
);

export const revealCredentialSchema = z.object({
  confirm: z.literal(true).optional().default(true),
});

export type CreateCredentialPayload = z.infer<typeof createCredentialSchema>;
export type UpdateCredentialPayload = z.infer<typeof updateCredentialSchema>;
