import { z } from "zod";
import * as schemas from "./schemas";

/**
 * Validates data against a schema and returns the result
 * @param schema Zod schema to validate against
 * @param data Data to validate
 * @returns Tuple of [isValid, validatedData, errors]
 */
export function validateData<T extends z.ZodType>(
  schema: T,
  data: unknown
): [boolean, z.infer<T> | null, z.ZodError | null] {
  try {
    const validatedData = schema.parse(data);
    return [true, validatedData, null];
  } catch (error) {
    if (error instanceof z.ZodError) {
      return [false, null, error];
    }
    throw error;
  }
}

/**
 * Formats Zod validation errors into a user-friendly object
 * @param error Zod validation error
 * @returns Object with field paths as keys and error messages as values
 */
export function formatValidationErrors(
  error: z.ZodError
): Record<string, string> {
  const formattedErrors: Record<string, string> = {};

  error.errors.forEach((err) => {
    const path = err.path.join(".");
    formattedErrors[path] = err.message;
  });

  return formattedErrors;
}

/**
 * Type-safe validation functions for each schema
 */
export const validators = {
  user: (data: unknown) => validateData(schemas.userSchema, data),
  experience: (data: unknown) => validateData(schemas.experienceSchema, data),
  booking: (data: unknown) => validateData(schemas.bookingSchema, data),
  review: (data: unknown) => validateData(schemas.reviewSchema, data),
  availability: (data: unknown) =>
    validateData(schemas.availabilitySchema, data),
  category: (data: unknown) => validateData(schemas.categorySchema, data),
  transaction: (data: unknown) => validateData(schemas.transactionSchema, data),
  notification: (data: unknown) =>
    validateData(schemas.notificationSchema, data),
  blog: (data: unknown) => validateData(schemas.blogSchema, data),
};

/**
 * Partial validators for updating documents
 */
export const partialValidators = {
  user: (data: unknown) => validateData(schemas.userSchema.partial(), data),
  experience: (data: unknown) =>
    validateData(schemas.experienceSchema.partial(), data),
  booking: (data: unknown) =>
    validateData(schemas.bookingSchema.partial(), data),
  review: (data: unknown) => validateData(schemas.reviewSchema.partial(), data),
  availability: (data: unknown) =>
    validateData(schemas.availabilitySchema.partial(), data),
  category: (data: unknown) =>
    validateData(schemas.categorySchema.partial(), data),
  transaction: (data: unknown) =>
    validateData(schemas.transactionSchema.partial(), data),
  notification: (data: unknown) =>
    validateData(schemas.notificationSchema.partial(), data),
  blog: (data: unknown) => validateData(schemas.blogSchema.partial(), data),
};
