import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Ticket, ColumnId } from '../types'
import { TicketCard } from './TicketCard'
import { Box } from '@mantine/core'

export function SortableTicketCard({
  ticket,
  columnId,
}: {
  ticket: Ticket
  columnId: ColumnId
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: ticket.id,
    data: { type: 'ticket', columnId },
  })

  return (
    <Box
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.2 : 1,
        cursor: 'grab',
      }}
      {...attributes}
      {...listeners}
    >
      <TicketCard ticket={ticket} />
    </Box>
  )
}
