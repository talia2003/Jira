import type { ColumnId, Column as ColumnType, Ticket } from '../types'
import {
  Button,
  TextInput,
  Paper,
  Group,
  Text,
  Badge,
  Stack,
  Box,
} from '@mantine/core'
import { useState } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { SortableTicketCard } from './SortableTicketCard'

export function Column({
  column,
  ticketsId,
  ticketsById,
  onCreateTicket,
  onDeleteTicket,
}: {
  column: ColumnType
  ticketsId: string[]
  ticketsById: Record<string, Ticket>
  onCreateTicket: (columnId: ColumnId, title: string) => void
  onDeleteTicket?: (ticketId: string) => void
}) {
  const [isCreating, setIsCreating] = useState(false)
  const [draftTitle, setDraftTitle] = useState('')
  const [isHovered, setIsHovered] = useState(false)

  const cancel = () => {
    setIsCreating(false)
    setDraftTitle('')
  }
  const submit = () => {
    const trimmed = draftTitle.trim()
    if (!trimmed) return
    onCreateTicket(column.id, trimmed)
    cancel()
  }

  const { setNodeRef } = useDroppable({
    id: column.id,
    data: { type: 'column', columnId: column.id },
  })

  return (
    <Paper
      ref={setNodeRef}
      p="sm"
      radius="sm"
      w={300}
      bg="gray.1"
      mih={440}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Group justify="space-between" mb="xs">
        <Text fw={600} size="sm">
          {column.title}
        </Text>

        <Badge
          styles={(theme) => ({
            root: {
              bordeeRadius: theme.radius.xs,
              backgroundColor: theme.colors.gray[4],
              color: theme.colors.gray[9],
            },
          })}
        >
          {ticketsId.length}
        </Badge>
      </Group>

      <Box style={{ flex: 1 }}>
        <Stack gap="xs">
          <SortableContext
            items={ticketsId}
            strategy={verticalListSortingStrategy}
          >
            {ticketsId.map((ticketId) => {
              const ticket = ticketsById[ticketId]
              if (!ticket) return null
              return (
                <SortableTicketCard
                  key={ticketId}
                  ticket={ticket}
                  columnId={column.id}
                  onDeleteTicket={onDeleteTicket}
                />
              )
            })}
              
          
          </SortableContext>
        </Stack>
      </Box>

      {isCreating ? (
        <Stack gap="xs" mt="xs">
          <TextInput
            autoFocus
            placeholder="What needs to be done?"
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') cancel()
              if (e.key === 'Enter') submit()
            }}
          />
          <Group gap="xs">
            <Button size="xs" onClick={submit}>
              Create
            </Button>
            <Button
              size="xs"
              variant="subtile"
              onClick={cancel}
              styles={(theme) => ({
                root: {
                  '&:hover': {
                    backgroundColor: theme.colors.gray[1],
                  },
                },
              })}
            >
              Cancel
            </Button>
          </Group>
        </Stack>
      ) : column.position === 0 || isHovered ? (
        <Button
          fullWidth
          variant="subtle"
          onClick={() => setIsCreating(true)}
          styles={(theme) => ({
            root: {
              marginTop: 10,
              padding: '8px 10px',
              borderRadius: theme.radius.sm,
              color: theme.colors.gray[7],
              '&:hover': {
                backgroundColor: theme.colors.gray[2],
              },
            },
          })}
        >
          <Text size="md" c="gray.7" fw={500}>
            + create
          </Text>
        </Button>
      ) : null}
    </Paper>
  )
}
