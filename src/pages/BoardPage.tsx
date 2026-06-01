import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import type { BoardState, ColumnId } from '../types'
import { Board } from '../components/Board'
import { Box, Container, Title } from '@mantine/core'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCenter,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { TicketCard } from '../components/TicketCard'
import { getBoard } from '../api/boards'
import { createTicket as createTicketApi, deleteTicket as deleteTicketApi, updateTicket } from '../api/tickets'
import { apiToBoardState } from '../lib/boardTransform.ts'

export function BoardPage() {
  const { boardId } = useParams<{ boardId: string }>()

  const [boardState, setBoardState] = useState<BoardState | null>(null)
  const [loading, setLoading] = useState(Boolean(boardId))
  const [error, setError] = useState<string | null>(null)
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null)

  useEffect(() => {
    if (!boardId) return

    let cancelled = false

    getBoard(boardId)
      .then((data) => {
        if (cancelled) return
        setBoardState(apiToBoardState(data.columns, data.tickets))
        setError(null)
      })
      .catch((err) => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : 'Failed to load board')
      })
      .finally(() => {
        if (cancelled) return
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [boardId])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  )

  const createTicket = (columnId: ColumnId, title: string) => {
    if (!boardId) return

    const trimmed = title.trim()
    if (!trimmed) return

    const tempId = crypto.randomUUID()

    setBoardState((prev) => {
      if (!prev) return prev

      const position = prev.ticketIdsByColumnId[columnId]?.length ?? 0

      return {
        ...prev,
        ticketsById: {
          ...prev.ticketsById,
          [tempId]: { id: tempId, title: trimmed, columnId, position },
        },
        ticketIdsByColumnId: {
          ...prev.ticketIdsByColumnId,
          [columnId]: [...prev.ticketIdsByColumnId[columnId], tempId],
        },
      }
    })

    createTicketApi({
      board_id: boardId,
      column_id: columnId,
      title: trimmed,
    })
      .then(({ ticket }) => {
        setBoardState((prev) => {
          if (!prev) return prev

          const restTickets = { ...prev.ticketsById }
          delete restTickets[tempId]

          return {
            ...prev,
            ticketsById: {
              ...restTickets,
              [ticket.id]: {
                id: ticket.id,
                title: ticket.title,
                columnId: ticket.column_id,
                position: ticket.position,
              },
            },
            ticketIdsByColumnId: {
              ...prev.ticketIdsByColumnId,
              [columnId]: prev.ticketIdsByColumnId[columnId].map((id) =>
                id === tempId ? ticket.id : id,
              ),
            },
          }
        })
      })
      .catch((err) => {
        setBoardState((prev) => {
          if (!prev) return prev

          const restTickets = { ...prev.ticketsById }
          delete restTickets[tempId]

          return {
            ...prev,
            ticketsById: restTickets,
            ticketIdsByColumnId: {
              ...prev.ticketIdsByColumnId,
              [columnId]: prev.ticketIdsByColumnId[columnId].filter(
                (id) => id !== tempId,
              ),
            },
          }
        })
        setError(err instanceof Error ? err.message : 'Failed to create ticket')
      })
  }

  const deleteTicket = (ticketId: string) => {
    if (!boardState) return

    const ticket = boardState.ticketsById[ticketId]
    if (!ticket) return

    const columnId = ticket.columnId
    const snapshot = boardState

    setBoardState((prev) => {
      if (!prev) return prev

      const restTicket = { ...prev.ticketsById }
      delete restTicket[ticketId]

      return {
        ...prev,
        ticketsById: restTicket,
        ticketIdsByColumnId: {
          ...prev.ticketIdsByColumnId,
          [columnId]: prev.ticketIdsByColumnId[columnId].filter(
            (id) => id !== ticketId,
          ),
        },
      }
    })

    deleteTicketApi(ticketId).catch((err) => {
      setBoardState(snapshot)
      setError(err instanceof Error ? err.message : 'Failed to delete ticket')
    })
  }

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveTicketId(null)
    if (!over || !boardState) return

    const activeId = String(active.id)
    const overId = String(over.id)

    if (activeId === overId) return

    const activeData = active.data.current as
      | { type: 'ticket'; columnId: ColumnId }
      | undefined

    const overData = over.data.current as
      | { type: 'ticket'; columnId: ColumnId }
      | { type: 'column'; columnId: ColumnId }
      | undefined

    const fromColumnId =
      boardState.ticketsById[activeId]?.columnId ?? activeData?.columnId
    if (!fromColumnId) return

    let toColumnId = overData?.columnId
    if (!toColumnId && boardState.columns.some((c) => c.id === String(over.id))) {
      toColumnId = String(over.id)
    }
    if (!toColumnId) return

    const fromTickets = boardState.ticketIdsByColumnId[fromColumnId]
    const toTickets = boardState.ticketIdsByColumnId[toColumnId]
    const fromIndex = fromTickets.indexOf(activeId)
    if (fromIndex === -1) return

    let toIndex: number
    if (overData?.type === 'ticket') {
      toIndex = toTickets.indexOf(overId)
      if (toIndex === -1) toIndex = toTickets.length
    } else {
      toIndex = toTickets.length
    }

    setBoardState((prev) => {
      if (!prev) return prev

      if (fromColumnId === toColumnId) {
        return {
          ...prev,
          ticketsById: {
            ...prev.ticketsById,
            [activeId]: {
              ...prev.ticketsById[activeId],
              position: toIndex,
            },
          },
          ticketIdsByColumnId: {
            ...prev.ticketIdsByColumnId,
            [fromColumnId]: arrayMove(fromTickets, fromIndex, toIndex),
          },
        }
      }

      const nextFrom = fromTickets.filter((id) => id !== activeId)
      const nextTo = [...toTickets]
      nextTo.splice(toIndex, 0, activeId)

      return {
        ...prev,
        ticketsById: {
          ...prev.ticketsById,
          [activeId]: {
            ...prev.ticketsById[activeId],
            columnId: toColumnId,
            position: toIndex,
          },
        },
        ticketIdsByColumnId: {
          ...prev.ticketIdsByColumnId,
          [fromColumnId]: nextFrom,
          [toColumnId]: nextTo,
        },
      }
    })

    updateTicket(activeId, {
      columnId: toColumnId,
      position: toIndex,
    }).catch((err) => {
      setError(err instanceof Error ? err.message : 'Failed to update ticket')
    })
  }

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveTicketId(String(active.id))
  }

  if (!boardId) {
    return (
      <Box bg="white" mih="100vh" py="md">
        <Container size="xl">
          <Title order={3} mb="md">
            Invalid board ID
          </Title>
        </Container>
      </Box>
    )
  }

  if (loading) {
    return (
      <Box bg="white" mih="100vh" py="md">
        <Container size="xl">
          <Title order={3} mb="md">
            Loading board...
          </Title>
        </Container>
      </Box>
    )
  }

  if (error || !boardState) {
    return (
      <Box bg="white" mih="100vh" py="md">
        <Container size="xl">
          <Title order={3} c="red">
            Error
          </Title>
          <Box c="dimmed">{error ?? 'Board not found'}</Box>
        </Container>
      </Box>
    )
  }

  return (
    <Box bg="white" mih="100vh" py="md">
      <Container size="xl">
        <Title order={3} mb="md">
          Kanban Board
        </Title>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={() => setActiveTicketId(null)}
        >
          <Board 
          boardState={boardState} 
          onCreateTicket={createTicket} 
          onDeleteTicket={deleteTicket}/>
          <DragOverlay
            dropAnimation={{
              duration: 220,
              easing: 'cubic-bezier(0.2, 0, 0, 1)',
            }}
          >
            {activeTicketId ? (
              <TicketCard ticket={boardState.ticketsById[activeTicketId]} />
            ) : null}
          </DragOverlay>
        </DndContext>
      </Container>
    </Box>
  )
}