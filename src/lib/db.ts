import { PrismaClient } from "@prisma/client";

// Use lazy initialization so Prisma reads env vars at runtime, not at module load time
let _prisma: PrismaClient | null = null;

function getPrismaClient(): PrismaClient {
  if (!_prisma) {
    // Force Prisma to use the runtime env var
    const databaseUrl =
      process.env.POSTGRES_PRISMA_URL ||
      process.env.DATABASE_URL ||
      process.env.POSTGRES_URL;

    if (!databaseUrl) {
      throw new Error(
        "No DATABASE_URL or POSTGRES_PRISMA_URL environment variable set"
      );
    }

    // Log for debugging (in dev only)
    if (process.env.NODE_ENV === "development") {
      console.log("[DB] Connecting to:", databaseUrl.replace(/:[^:@]+@/, ":***@"));
    }

    _prisma = new PrismaClient({
      log:
        process.env.NODE_ENV === "development"
          ? ["error", "warn"]
          : ["error"],
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    });
  }
  return _prisma;
}

// Export a proxy that lazily initializes Prisma
export const db = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrismaClient();
    const value = (client as any)[prop];
    return typeof value === "function" ? value.bind(client) : value;
  },
});

// Auto-cleanup function: delete records older than 30 days
export async function cleanupOldRecords(daysOld: number = 30): Promise<{
  deletedApplications: number;
  deletedLogs: number;
}> {
  const client = getPrismaClient();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - daysOld);

  const deletedApps = await client.jobApplication.deleteMany({
    where: {
      createdAt: { lt: cutoff },
      // Don't delete records that are actively in interview/offer stage
      status: { notIn: ["interview", "offer"] },
    },
  });

  const deletedLogs = await client.scanLog.deleteMany({
    where: {
      createdAt: { lt: cutoff },
    },
  });

  return {
    deletedApplications: deletedApps.count,
    deletedLogs: deletedLogs.count,
  };
}

// Helper: check if DB is available (env vars set)
export function isDbAvailable(): boolean {
  return !!(
    process.env.POSTGRES_PRISMA_URL ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL
  );
}
