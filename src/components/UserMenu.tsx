import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Avatar, Box, Menu, Text, UnstyledButton } from '@mantine/core'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

const AVATAR_COLORS = [
  '#0052CC',
  '#2684FF',
  '#00B8D9',
  '#36B37E',
  '#FFAB00',
  '#FF5630',
  '#6554C0',
  '#8777D9',
] as const

function hashString(value: string): number {
  let hash = 0
  for (let i = 0; i < value.length; i++) {
    hash = value.charCodeAt(i) + ((hash << 5) - hash)
  }
  return Math.abs(hash)
}

function getAvatarColor(user: User): string {
  const key = user.id || user.email || 'default'
  return AVATAR_COLORS[hashString(key) % AVATAR_COLORS.length]
}

function getInitials(user: User): string {
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

function getDisplayName(user: User): string {
  const name = user.user_metadata?.full_name ?? user.user_metadata?.name
  if (typeof name === 'string' && name.trim()) return name.trim()
  return user.email?.split('@')[0] ?? 'Account'
}

function LogoutIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
}

export function UserMenu() {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    void supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/sign-in', { replace: true })
  }

  if (!user) return null

  const avatarColor = getAvatarColor(user)

  return (
    <Menu position="bottom-end" offset={8} shadow="md" width={240} withArrow>
      <Menu.Target>
        <UnstyledButton
          aria-label="Account menu"
          style={{
            position: 'fixed',
            top: 16,
            right: 16,
            zIndex: 100,
            borderRadius: '50%',
          }}
        >
          <Avatar
            radius="xl"
            size={36}
            styles={{
              root: {
                backgroundColor: avatarColor,
                border: '2px solid #fff',
                boxShadow: '0 0 0 1px rgba(9, 30, 66, 0.13)',
              },
              placeholder: {
                backgroundColor: avatarColor,
                color: '#fff',
                fontWeight: 600,
                fontSize: 13,
                letterSpacing: '0.02em',
              },
            }}
          >
            {getInitials(user)}
          </Avatar>
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown>
        <Box px="sm" py="xs">
          <Text size="sm" fw={600} truncate>
            {getDisplayName(user)}
          </Text>
          {user.email && (
            <Text size="xs" c="dimmed" truncate>
              {user.email}
            </Text>
          )}
        </Box>
        <Menu.Divider />
        <Menu.Item
          color="red"
          leftSection={<LogoutIcon />}
          onClick={() => void handleLogout()}
        >
          Log out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}
