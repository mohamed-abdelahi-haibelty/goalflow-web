"use client";

import { useEffect, useState } from "react";
import { initializePaddle, Paddle } from "@paddle/paddle-js";

let paddleInstance: Paddle | null | undefined = null;

export function usePaddle() {
  const [paddle, setPaddle] = useState<Paddle | null | undefined>(
    paddleInstance
  );
  const [loading, setLoading] = useState(!paddleInstance);

  useEffect(() => {
    if (paddleInstance) return;

    const init = async () => {
      setLoading(true);
      paddleInstance = await initializePaddle({
        token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN as string,
        environment: process.env.NEXT_PUBLIC_PADDLE_ENV as
          | "sandbox"
          | "production",
      });
      setPaddle(paddleInstance);
      setLoading(false);
    };

    init();
  }, []);

  return { paddle, loading };
}
