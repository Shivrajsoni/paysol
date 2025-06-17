import { z } from "zod";

// Common validation schemas
export const publicKeySchema = z.string().min(32).max(44);
export const amountSchema = z
  .string()
  .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: "Amount must be a positive number",
  });

// Transaction validation schema
export const transactionSchema = z.object({
  signature: z.string().min(1),
  from: publicKeySchema,
  to: publicKeySchema,
  amount: amountSchema,
  priorityFee: z.string().optional(),
});

// Payment request validation schema
export const paymentRequestSchema = z.object({
  requestedPublicKey: publicKeySchema,
  amount: amountSchema,
  description: z.string().optional(),
  senderId: z.string().min(1),
});

// Contact validation schema
export const contactSchema = z.object({
  receiverPubkey: publicKeySchema,
  receiverUsername: z.string().min(1),
  userId: z.string().min(1),
});

// Validation helper function
export async function validateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Promise<{ success: true; data: T } | { success: false; error: string }> {
  try {
    const validatedData = await schema.parseAsync(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors.map((e) => e.message).join(", "),
      };
    }
    return { success: false, error: "Invalid request data" };
  }
}
