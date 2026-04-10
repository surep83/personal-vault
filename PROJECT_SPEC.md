# Personal Vault - Project Spec

## Project
Personal Vault

## Current Module
Credential Vault

## Goal
Build a secure module to store website/service credentials.

## Fields
- serviceName
- loginId
- password (encrypted)
- url
- purpose
- category (optional)
- notes (optional)
- isFavorite
- lastAccessedAt
- createdAt
- updatedAt

## Features
- List credentials
- Add credential
- Edit credential
- View credential
- Reveal password securely
- Delete credential

## Rules
- Never store passwords in plain text
- Encrypt passwords before saving
- Use Prisma
- Use Zod validation
- Use service + repository pattern
- Use clean modular code