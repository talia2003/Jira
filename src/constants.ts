import type { Provider } from '@supabase/supabase-js'

export const AVATAR_COLORS = [
  '#0052CC',
  '#2684FF',
  '#00B8D9',
  '#36B37E',
  '#FFAB00',
  '#FF5630',
  '#6554C0',
  '#8777D9',
] as const

export const OAUTH_PROVIDERS = [
  {
    name: 'Google',
    icon: 'https://www.google.com/favicon.ico',
    provider: 'google' as Provider,
    label: 'Continue with Google',
  },
  {
    name: 'GitHub',
    icon: 'https://github.com/favicon.ico',
    provider: 'github' as Provider,
    label: 'Continue with GitHub',
  },
] as const
