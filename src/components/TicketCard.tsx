import type { Ticket } from '../types'
import { Card, Text } from '@mantine/core'

export function TicketCard({ ticket }: { ticket: Ticket }) {
  return (
    <Card withBorder p="sm" radius="sm" bg="white">
      <Text size="sm">{ticket.title}</Text>
    </Card>
  )
}
