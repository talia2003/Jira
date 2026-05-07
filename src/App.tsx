import { useEffect, useState } from 'react'
import type { BoardState, ColumnId } from './types'
import { Board } from './components/Board'
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
import { TicketCard } from './components/TicketCard'

function App() {
  const [boardState, setBoardState] = useState<BoardState>(() => ({
    columns: [
      { id: 'todo', title: 'TO DO' },
      { id: 'inProgress', title: 'IN PROGRESS' },
      { id: 'review', title: 'REVIEW' },
      { id: 'done', title: 'DONE' },
    ],
    ticketsById: {},
    ticketIdsByColumnId: { todo: [], inProgress: [], review: [], done: [] },
  }))

  const [activeTicketId, setActiveTicketId] = useState<string | null>(null)
  
  const [pingResult, setPingResult] = useState<string >("loading...")

  useEffect(() => {
    fetch('http://localhost:3000/api/ping')
      .then(response => response.json())
      .then(data => setPingResult(JSON.stringify(data)))
      .catch(error => setPingResult("error: " + error.message))
  }, [])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  )

  const createTicket = (columnId: ColumnId, title: string) => {
    const trimmed = title.trim().toLowerCase()
    if (!trimmed) return

    const id = crypto.randomUUID()

    setBoardState((prev) => ({
      ...prev,
      ticketsById: {
        ...prev.ticketsById,
        [id]: { id, title: trimmed },
      },
      ticketIdsByColumnId: {
        ...prev.ticketIdsByColumnId,
        [columnId]: [...prev.ticketIdsByColumnId[columnId], id],
      },
    }))
  }

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveTicketId(null)
    if (!over) return

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

    const fromColumnId = activeData?.columnId
    if (!fromColumnId) return

    const toColumnId = overData?.columnId
    if (!toColumnId) return

    setBoardState((prev) => {
      const fromTickets = prev.ticketIdsByColumnId[fromColumnId]
      const toTickets = prev.ticketIdsByColumnId[toColumnId]

      const fromIndex = fromTickets.indexOf(activeId)
      if (fromIndex === -1) return prev

      let toIndex: number

      if (overData?.type === 'ticket') {
        toIndex = toTickets.indexOf(overId)
        if (toIndex === -1) toIndex = toTickets.length
      } else {
        toIndex = toTickets.length
      }

      if (fromColumnId === toColumnId) {
        return {
          ...prev,
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
        ticketIdsByColumnId: {
          ...prev.ticketIdsByColumnId,
          [fromColumnId]: nextFrom,
          [toColumnId]: nextTo,
        },
      }
    })
  }

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveTicketId(String(active.id))
  }

  return (
    <Box bg="white" mih="100vh" py="md">
      <Container size="xl">
        <Title order={3} mb="md">
          Kanban Board
        </Title>
        <Box mb="md" c="dimmed" fz="sm">
          Ping: {pingResult}
        </Box>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={() => setActiveTicketId(null)}
        >
          <Board boardState={boardState} onCreateTicket={createTicket} />
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

export default App
