import { Box, Container, Loader, Stack, Title } from '@mantine/core'

type ContainerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export function PageLoading({
  message,
  size = 'xl',
}: {
  message: string
  size?: ContainerSize
}) {
  return (
    <Box bg="white" mih="100vh" py="md">
      <Container size={size}>
        <Stack gap="md" align="center">
          <Loader size="sm" />
          <Title order={3}>{message}</Title>
        </Stack>
      </Container>
    </Box>
  )
}
