import { Box, Container, Text, Title } from '@mantine/core'

type ContainerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export function PageError({
  message,
  title = 'Error',
  size = 'xl',
}: {
  message: string
  title?: string
  size?: ContainerSize
}) {
  return (
    <Box bg="white" mih="100vh" py="md">
      <Container size={size}>
        <Title order={3} c="red" mb="xs">
          {title}
        </Title>
        <Text c="dimmed">{message}</Text>
      </Container>
    </Box>
  )
}
