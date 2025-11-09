import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { ApiError } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }

  return null;
};

export const createApiError = (error: any, code?: string): ApiError => {
  let message = "Unknown API error";

  if (error?.response?.data) {
    const responseData = error.response.data;

    message =
      responseData.message ||
      responseData.error ||
      responseData.error_description ||
      message;
  } else if (error?.message) {
    message = error.message;
  }

  return {
    message,
    code: code || error?.code || error?.response?.data?.code,
    timestamp: new Date(),
    requestId: error?.config?.requestId,
  };
};
