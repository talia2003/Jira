# Jira-style Kanban (React + TS + Vite)

A small Jira-inspired Kanban board built with **React + TypeScript + Mantine**, including:

- **Create tickets per column**
  - New tickets are appended to the **bottom** of the column
  - The **TO DO** column always shows “+ create”
  - Other columns show “+ create” **only on hover**
- **Drag & drop** (reorder within a column + move across columns) using **dnd-kit**
- **Ticket card styling** with a subtle shadow (hover elevation)

## Getting started

Install dependencies:

```bash
npm install
```

Run the dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

## Project structure (key files)

- `src/App.tsx`
  - Owns the **board state**
  - Implements dnd-kit `DndContext` handlers (`onDragStart`, `onDragEnd`)
  - Renders a `DragOverlay` for smoother dragging
- `src/components/Board.tsx`
  - Layout wrapper that renders all columns
- `src/components/Column.tsx`
  - Renders one column header, ticket list, and inline create UI
  - Marks the column as **droppable** (so you can drop into empty space)
  - Wraps the list with `SortableContext` (so dnd-kit knows the ticket order)
- `src/components/SortableTicketCard.tsx`
  - The “behavior” wrapper that makes a ticket sortable (`useSortable`)
  - Attaches `listeners`, `attributes`, `setNodeRef`, and applies transform/transition styles
- `src/components/TicketCard.tsx`
  - Presentational card UI (no drag logic inside)
- `src/types.ts`
  - Core types (`BoardState`, `Ticket`, `columnId`)

## Data model (why the state looks like this)

The board state is split into:

- `ticketsById: Record<string, Ticket>`
  - The “database” of ticket objects.
  - Ticket content lives here (title, etc.).
- `ticketIdsByColumnId: Record<columnId, string[]>`
  - The ordered list of ticket ids per column.
  - **Drag & drop only changes these arrays** (reorder/move).

This separation keeps updates cheap: moving a ticket is just moving an **id**, not copying entire objects.

## Drag & drop (how it works)

dnd-kit is **headless**: it doesn’t move your data. It emits events, and you update state.

### Key concepts

- **`DndContext`**: top-level event hub for drag interactions.
- **`SortableContext`**: tells dnd-kit “these ids are sortable, in this order”.
- **`useSortable`**: makes one item draggable/sortable and provides:
  - `setNodeRef` (DOM connection)
  - `listeners`/`attributes` (drag events + a11y)
  - `transform`/`transition` (smooth movement)
- **Metadata (`data`)**: we store `{ type, columnId }` on:
  - tickets → source column can be read from `active.data.current`
  - columns/tickets → destination column can be read from `over.data.current`

### “Closest drop” behavior

On drop:

- Dropping **on a ticket** inserts at that ticket’s index (closest position)
- Dropping **on a column** (empty space) appends to the end

## Notes

- If TypeScript is configured with `verbatimModuleSyntax`, import types using `import type { ... }`.
