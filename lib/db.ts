import { PrismaClient } from "@prisma/client";

// Neon's pooled connection runs PgBouncer in transaction mode; Prisma needs
// `pgbouncer=true` on the URL or writes can fail with prepared-statement
// errors. The Neon integration doesn't always include the flag, so add it.
function pooledUrl(): string | undefined {
  const raw = process.env.DATABASE_URL;
  if (!raw) return undefined;
  if (raw.includes("-pooler.") && !raw.includes("pgbouncer=")) {
    return raw + (raw.includes("?") ? "&" : "?") + "pgbouncer=true&connect_timeout=15";
  }
  return raw;
}

// Reuse a single PrismaClient across hot reloads / serverless invocations.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient(): PrismaClient {
  const url = pooledUrl();
  return new PrismaClient({
    ...(url ? { datasources: { db: { url } } } : {}),
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
