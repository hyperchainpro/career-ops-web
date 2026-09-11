import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { getDb } from "./db";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  return {
    id: (session.user as any).id,
    name: session.user.name || "",
    email: session.user.email || "",
  };
}

export async function getCurrentUserWithCV(): Promise<any | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const db = getDb();
  const fullUser = await db.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      name: true,
      email: true,
      headline: true,
      location: true,
      bio: true,
      cvText: true,
    },
  });

  return fullUser;
}
