import { z } from 'zod'

// Simple schemas
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  confirmPassword: z.string()
}).refine(d => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
})

// ONE function to rule them all
export function validate(schema: any, data: any) {
  try {
    const result = schema.parse(data)
    return { valid: true, data: result }
  } catch (error: any) {
    const errors: Record<string, string> = {}
    if (error.errors) {
      error.errors.forEach((e: any) => {
        errors[e.path[0] || 'form'] = e.message
      })
    }
    return { valid: false, errors }
  }
}

// Simple error getter
export function getErr(errors: any, field: string) {
  return errors?.[field]
}