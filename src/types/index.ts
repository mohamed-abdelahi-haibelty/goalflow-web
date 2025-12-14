export type ErrorType =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "SERVER_ERROR"
  | "CONFLICT"
  | "UNKNOWN";

export type ActionsResponse<T = undefined> = {
  success: boolean;
  message: string;
  code?: number;
  data?: T | null;
  error?: Record<string, string[]> | null;
  errorType?: ErrorType;
  errorCode?: string;
};
