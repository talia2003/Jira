import type { ApiColumn, ApiTicket } from '../api/types'
import type { BoardState, ColumnId } from '../types'

export function apiToBoardState(
  columns: ApiColumn[],
  tickets: ApiTicket[],
): BoardState {
  const sortedCol = [...columns].sort((a, b) => a.position - b.position)

  const uiColIds = sortedCol.map((col) => ({
    id: col.id,
    title: col.title,
    position: col.position,
  }))

  const ticketIdsByColumnId: Record<ColumnId, string[]> = {}

  for (const col of uiColIds) {
    ticketIdsByColumnId[col.id] = []
  }

  const ticketsById: BoardState['ticketsById'] = {}

  const sortedTickets = [...tickets].sort((a, b) => {
    if (a.column_id !== b.column_id) {
      return a.column_id.localeCompare(b.column_id)
    }
    return a.position - b.position
  })

  for (const ticket of sortedTickets) {
    ticketsById[ticket.id] = {
      id: ticket.id,
      title: ticket.title,
      columnId: ticket.column_id as ColumnId,
      position: ticket.position,
    }
    ticketIdsByColumnId[ticket.column_id].push(ticket.id)
  }

  return {
    columns: uiColIds,
    ticketsById,
    ticketIdsByColumnId,
  }
}
