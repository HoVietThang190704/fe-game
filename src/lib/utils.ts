import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isValidEmail(email: string) {
  // simple RFC-like email validation
  if (!email) return false
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export function extractFormAndPrevent(e: unknown): { form: HTMLFormElement; preventDefault: () => void } | null {
  if (typeof e !== "object" || e === null) return null
  const ev = e as { preventDefault?: unknown; currentTarget?: unknown }
  if (typeof ev.preventDefault !== "function") return null
  if (!(ev.currentTarget instanceof HTMLFormElement)) return null
  return { form: ev.currentTarget, preventDefault: ev.preventDefault.bind(ev) }
}

export function passwordStrength(password: string) {
  let score = 0
  if (!password) return { score, label: 'Too short', color: 'text-destructive' }
  // length
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  // variety
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  // normalize to 0..4
  if (score >= 5) score = 4
  const mapping: Record<number, { label: string; color: string }> = {
    0: { label: 'Very weak', color: 'text-destructive' },
    1: { label: 'Weak', color: 'text-destructive' },
    2: { label: 'Fair', color: 'text-amber-400' },
    3: { label: 'Good', color: 'text-primary' },
    4: { label: 'Strong', color: 'text-green-400' },
  }

  return { score, ...mapping[score] }
}
