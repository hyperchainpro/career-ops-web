import { PrismaClient } from "@prisma/client";

// Singleton pattern for PrismaClient
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const databaseUrl =
    process.env.POSTGRES_PRISMA_URL ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL;

  if (!databaseUrl) {
    throw new Error(
      "No DATABASE_URL, POSTGRES_PRISMA_URL, or POSTGRES_URL env var set"
    );
  }

  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  });
}

// Get or create the singleton PrismaClient
function getPrisma(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }
  return globalForPrisma.prisma;
}

// Export the PrismaClient directly
// We access it via a function to ensure lazy initialization
export const db: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    const prisma = getPrisma();
    const value = Reflect.get(prisma, prop, receiver);
    if (typeof value === "function") {
      return value.bind(prisma);
    }
    return value;
  },
});

// Auto-cleanup function: delete records older than 30 days
export async function cleanupOldRecords(daysOld: number = 30): Promise<{
  deletedApplications: number;
  deletedLogs: number;
}> {
  const prisma = getPrisma();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - daysOld);

  const [deletedApps, deletedLogs] = await Promise.all([
    prisma.jobApplication.deleteMany({
      where: {
        createdAt: { lt: cutoff },
        status: { notIn: ["interview", "offer"] },
      },
    }),
    prisma.scanLog.deleteMany({
      where: {
        createdAt: { lt: cutoff },
      },
    }),
  ]);

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
