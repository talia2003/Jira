import type { Ticket } from '../types'
import { ActionIcon, Group, Card, Text } from '@mantine/core'
import { useState } from 'react'

export function TicketCard({
  ticket,
  onDelete,
}: {
  ticket: Ticket
  onDelete?: (ticketId: string) => Promise<void>
}) {
  const [isHovered, setIsHovered] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!onDelete || isDeleting) return

    setIsDeleting(true)
    try {
      await onDelete(ticket.id)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Card
      withBorder
      p="sm"
      radius="sm"
      bg="white"
      opacity={isDeleting ? 0.6 : 1}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Group justify="space-between" wrap="nowrap" gap="xs">
        <Text size="sm" style={{ flex: 1 }}>
          {ticket.title}
        </Text>
        {onDelete && (isHovered || isDeleting) ? (
          <ActionIcon
            variant="subtle"
            color="gray"
            size="sm"
            aria-label="Delete ticket"
            disabled={isDeleting}
            loading={isDeleting}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={handleDelete}
          >
            ×
          </ActionIcon>
        ) : null}
      </Group>
    </Card>
  )
}
