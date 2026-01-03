"use server";

import db from "@/lib/db";

import { getUserSession } from "@/actions/auth/getUserSession";

export async function getUser() {
  const session = await getUserSession();

  if (!session) {
    return { message: "Unautherized", success: false, code: 401, data: null };
  }

  try {
    const user = await db.user.findUnique({
      where: {
        id: session.user.id,
      },
    });

    if (!user) {
      return {
        success: false,
        message: "No user Found",
        code: 404,
        data: null,
      };
    }

    return {
      success: true,
      message: "ok",
      code: 200,
      data: user,
    };
  } catch (err) {
    return {
      success: false,
      message: "Something went wrong!",
      code: 500,
      data: null,
    };
  }
}
