export type ColumnId = string

export type Column = {
  id: ColumnId
  title: string
  position: number
}

export type Ticket = {
  id: string
  title: string
  columnId: ColumnId
  position: number
}

export type BoardState = {
  columns: Column[]
  ticketsById: Record<string, Ticket>
  ticketIdsByColumnId: Record<ColumnId, string[]>
}
