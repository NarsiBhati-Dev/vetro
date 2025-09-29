import z from "zod";

export const empSchema = z.object({
  name: z.string(),
  email: z.email(),
  position: z.string(),
});

export const updateSchema = z.object({
  name: z.string().optional(),
  email: z.email().optional(),
  position: z.string().optional(),
});
