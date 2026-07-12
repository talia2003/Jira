import type { User } from '@supabase/supabase-js'
import { AVATAR_COLORS } from '../constants'

function hashString(value: string): number {
  let hash = 0
  for (let i = 0; i < value.length; i++) {
    hash = value.charCodeAt(i) + ((hash << 5) - hash)
  }
  return Math.abs(hash)
}

export function getAvatarColor(user: User): string {
  const key = user.id || user.email || 'default'
  return AVATAR_COLORS[hashString(key) % AVATAR_COLORS.length]
}

export function getInitials(user: User): string {
  const name = user.user_metadata?.full_name ?? user.user_metadata?.name
  if (typeof name === 'string' && name.trim()) {
    const parts = name.trim().split(/\s+/).filter(Boolean)
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    }
    return name.slice(0, 2).toUpperCase()
  }

  const local = user.email?.split('@')[0] ?? ''
  if (local.length >= 2) return local.slice(0, 2).toUpperCase()
  return '?'
}

export function getDisplayName(user: User): string {
  const name = user.user_metadata?.full_name ?? user.user_metadata?.name
  if (typeof name === 'string' && name.trim()) return name.trim()
  return user.email?.split('@')[0] ?? 'Account'
}
