import type { BoardState, ColumnId } from '../types'
import { Column } from './Column'
import { Group, ScrollArea } from '@mantine/core'

export function Board({
  boardState,
  onCreateTicket,
  onDeleteTicket,
}: {
  boardState: BoardState
  onCreateTicket: (columnId: ColumnId, title: string) => void
  onDeleteTicket?: (ticketId: string) => void
}) {
  return (
    <ScrollArea type="auto" offsetScrollbars>
      <Group wrap="nowrap" align="stretch" gap="md">
        {boardState.columns.map((column) => (
          <Column
            key={column.id}
            column={column}
            ticketsId={boardState.ticketIdsByColumnId[column.id]}
            ticketsById={boardState.ticketsById}
            onCreateTicket={onCreateTicket}
            onDeleteTicket={onDeleteTicket}
          />
        ))}
      </Group>
    </ScrollArea>
  )
}
