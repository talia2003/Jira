import { Outlet } from 'react-router-dom'
import { UserMenu } from './UserMenu'
import { Box } from '@mantine/core'

export function AppLayout() {
  return (
    <Box>
      <UserMenu />
      <Outlet />
    </Box>
  )
}