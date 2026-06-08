import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Box, Button, Container, Paper, Stack, Text, Title } from '@mantine/core'
import { PageError } from '../components/PageError'
import { PageLoading } from '../components/PageLoading'
import { listBoards, createBoard } from '../api/boards'
import type { ApiBoard } from '../api/types'

export function HomePage() {
  const navigate = useNavigate()
  const [boards, setBoards] = useState<ApiBoard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadBoards = useCallback(async (signal: AbortSignal) => {
    try {
      const data = await listBoards()
      if (signal.aborted) return
      setBoards(data.boards)
      setError(null)
    } catch (err) {
      if (signal.aborted) return
      setError(err instanceof Error ? err.message : 'Failed to load boards')
    } finally {
      if (!signal.aborted) setLoading(false)
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    void loadBoards(controller.signal)

    return () => controller.abort()
  }, [loadBoards])

  const handleCreate = async () => {
    const name = prompt('Enter a name for the new board')
    if (!name?.trim()) return

    try {
      const { board } = await createBoard(name.trim())
      navigate(`/board/${board.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create board')
    }
  }

  if (loading) {
    return <PageLoading message="Loading boards..." size="sm" />
  }

  if (error) {
    return <PageError message={error} size="sm" />
  }

  return (
    <Box bg="white" mih="100vh" py="md">
      <Container size="sm">
        <Title order={2} mb="md">
          Boards
        </Title>

        <Button mb="lg" onClick={handleCreate}>
          Create board
        </Button>

        {boards.length === 0 ? (
          <Text c="dimmed">No boards yet. Create one to get started.</Text>
        ) : (
          <Stack gap="sm">
            {boards.map((board) => (
              <Paper
                key={board.id}
                component={Link}
                to={`/board/${board.id}`}
                p="md"
                withBorder
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <Text fw={600}>{board.name}</Text>
                <Text size="sm" c="dimmed">
                  {new Date(board.created_at).toLocaleDateString()}
                </Text>
              </Paper>
            ))}
          </Stack>
        )}
      </Container>
    </Box>
  )
}
