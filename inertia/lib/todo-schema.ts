import { z } from 'zod'

export const todoSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be under 100 characters'),

  description: z.string().max(500, 'Description must be under 500 characters').optional(),

  priority: z.enum(['high', 'medium', 'low'], {
    error: 'Pick a valid priority',
  }),

  status: z.enum(['pending', 'in_progress', 'completed'], {
    error: 'Pick a valid status',
  }),

  labelIds: z.array(z.number()).optional(),
})

export type TodoFormData = z.infer<typeof todoSchema>

export function validateTodo(data: unknown) {
  const result = todoSchema.safeParse(data)

  if (result.success) {
    return { success: true as const, errors: {} }
  }

  const errors: Record<string, string> = {}
  for (const issue of result.error.issues) {
    const field = issue.path[0] as string
    if (!errors[field]) {
      errors[field] = issue.message
    }
  }

  return { success: false as const, errors }
}
