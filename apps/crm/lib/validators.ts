import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2)
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const createTicketSchema = z.object({
  type: z.enum(['connect', 'support', 'internal']),
  address: z.string().min(3),
  contactName: z.string().min(2),
  phone: z.string().min(5),
  description: z.string().min(5)
});

export const patchTicketSchema = z.object({
  status: z.enum(['new', 'in_progress', 'waiting', 'done', 'closed', 'canceled']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  assignedToId: z.string().nullable().optional(),
  comment: z.string().min(1).optional()
});

export const commentSchema = z.object({ text: z.string().min(1) });
