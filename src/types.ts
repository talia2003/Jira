export type ColumnId = 'todo' | 'inProgress' | 'review' | 'done'

export type Column = {
  id: ColumnId
  title: string
}

export type Ticket = {
  id: string
  title: string
}

export type BoardState = {
  columns: Column[]
  ticketsById: Record<string, Ticket>
  ticketIdsByColumnId: Record<ColumnId, string[]>
}
