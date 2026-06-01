import { api } from './client'
import type { ApiTicket } from './types'

export function createTicket(body: {
  board_id: string
  column_id: string
  title: string
}) {
  return api.post<{ ticket: ApiTicket }>('/api/tickets', body)
}

export function updateTicket(
  ticketId: string,
  body: { columnId?: string; title?: string; position?: number },
) {
  return api.patch<{ ticket: ApiTicket }>(`/api/tickets/${ticketId}`, body)
}

export function deleteTicket(ticketId: string) {
  return api.delete<{ ok: true }>(`/api/tickets/${ticketId}`)
}