//src/app/[locale]/(features)/project/action/getProjects.ts
"use server";

import db from "@/lib/db";

import { getUserSession } from "@/actions/auth/getUserSession";

export async function getProjects() {
  const session = await getUserSession();

  if (!session) {
    return { message: "Unauthorized", success: false, code: 401, data: null };
  }

  try {
    const projects = await db.project.findMany({
      where: {
        ownerId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      message: "ok",
      code: 200,
      data: projects,
    };
  } catch {
    return {
      success: false,
      message: "Something went wrong!",
      code: 500,
      data: null,
    };
  }
}
