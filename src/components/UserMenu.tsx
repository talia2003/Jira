import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Avatar, Box, Menu, Text, UnstyledButton } from '@mantine/core'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import {
  getAvatarColor,
  getDisplayName,
  getInitials,
} from '../lib/userDisplay'
import { LogoutIcon } from './LogoutIcon'

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
