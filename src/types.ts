export type columnId = 'todo' | 'inProgress' | 'review' | 'done'

export type Column = {
  id: columnId
  title: string
}

export type Ticket = {
  id: string
  title: string
}

export type BoardState = {
  columns: Column[]
  ticketsById: Record<string, Ticket>
  ticketIdsByColumnId : Record<columnId, string[]>
}