export type CredentialBase = {
  serviceName: string;
  loginId: string;
  url: string;
  purpose: string;
  category?: string | null;
  notes?: string | null;
  isFavorite: boolean;
};

export type CreateCredentialInput = CredentialBase & {
  password: string;
};

export type UpdateCredentialInput = Partial<CreateCredentialInput>;

export type CredentialListItem = {
  id: string;
  serviceName: string;
  loginId: string;
  url: string;
  purpose: string;
  category: string | null;
  notes: string | null;
  isFavorite: boolean;
  lastAccessedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CredentialDetails = CredentialListItem;

export type RevealedCredential = {
  id: string;
  password: string;
};
