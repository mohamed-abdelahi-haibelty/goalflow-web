"use server";

import db from "@/lib/db";

import { getUserSession } from "@/actions/auth/getUserSession";

export async function getProjectById(id: string) {
  const session = await getUserSession();

  if (!session) {
    return { message: "Unautherized", success: false, code: 401, data: null };
  }

  try {
    const project = await db.project.findUnique({
      where: {
        ownerId: session.user.id,
        id,
      },
    });

    if (!project) {
      return {
        success: false,
        message: "Not Found",
        code: 404,
        data: null,
      };
    }

    return {
      success: true,
      message: "ok",
      code: 200,
      data: project,
    };
  } catch (err) {
    return {
      success: true,
      message: "Something went wrong!",
      code: 500,
      data: null,
    };
  }
}
