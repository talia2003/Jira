import type { Ticket } from '../types'
import {ActionIcon, Group, Card, Text } from '@mantine/core'
import {useState} from 'react'

export function TicketCard({ 
  ticket,
  onDelete,

}: {
  ticket: Ticket
  onDelete?: (ticketId: string) => void
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Card
      withBorder
      p="sm"
      radius="sm"
      bg="white"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Group justify="space-between" wrap="nowrap" gap="xs">
        <Text size="sm" style={{ flex: 1 }}>
          {ticket.title}
        </Text>
        {onDelete && isHovered ? (
          <ActionIcon
            variant="subtle"
            color="gray"
            size="sm"
            aria-label="Delete ticket"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation()
              onDelete(ticket.id)
            }}
          >
            ×
          </ActionIcon>
        ) : null}
      </Group>
    </Card>
  )
}
