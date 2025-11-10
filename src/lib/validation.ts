import { z } from "zod";

// Base validation utilities
export const createValidator = <T>(schema: z.ZodSchema<T>) => {
  return {
    validate: (data: unknown) => schema.safeParse(data),
    validateAsync: async (data: unknown) => schema.safeParseAsync(data),
    validateOrThrow: (data: unknown) => schema.parse(data),
  };
};

export interface ValidationResult<T> {
  isValid: boolean;
  data: T | null;
  errors: string[];
}

export const validateApiResponse = <T>(
  schema: z.ZodSchema<T>,
  response: unknown,
  context?: { endpoint?: string; method?: string }
): ValidationResult<T> => {
  try {
    const result = schema.safeParse(response);

    if (result.success) {
      return { isValid: true, data: result.data, errors: [] };
    } else {
      const errors = result.error.issues.map(
        (err: any) => `${err.path.join(".")}: ${err.message}`
      );

      console.warn("API response validation failed:", {
        context,
        errors,
        response:
          process.env.NODE_ENV === "development"
            ? response
            : "[hidden in production]",
      });

      return { isValid: false, data: null, errors };
    }
  } catch (error) {
    console.error("API validation error:", { context, error });

    return {
      isValid: false,
      data: null,
      errors: ["Validation error occurred"],
    };
  }
};

export class ValidationError extends Error {
  constructor(message: string, public errors: string[], public context?: any) {
    super(message);
    this.name = "ValidationError";
  }
}

export const PaginatedResponseSchema = <T>(itemSchema: z.ZodSchema<T>) => {
  return z.object({
    data: z.array(itemSchema),
    total: z.number(),
    page: z.number(),
    page_size: z.number(),
    total_pages: z.number(),
  });
};
