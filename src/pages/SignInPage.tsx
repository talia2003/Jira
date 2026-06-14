import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Anchor,
  Box,
  Button,
  Container,
  Divider,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { OAuthButtons } from '../components/OAuthButtons'
import { supabase } from '../lib/supabase'

export function SignInPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    navigate('/boards', { replace: true })
  }

  return (
    <Box bg="white" mih="100vh" py="md">
      <Container size="xs">
        <Title order={2} ta="center" mb="md">
          Sign In
        </Title>

        <Paper withBorder shadow="md" p="md">
          <Stack gap="md">
            <OAuthButtons />
            <Divider label="or" labelPosition="center" />

            <form onSubmit={handleSubmit}>
              <Stack gap="md">
                <TextInput
                  label="Email"
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.currentTarget.value)}
                  required
                  autoComplete="email"
                />

                <PasswordInput
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.currentTarget.value)}
                  required
                  autoComplete="current-password"
                />

                {error && (
                  <Text c="red" ta="center" size="sm">
                    {error}
                  </Text>
                )}

                <Button type="submit" fullWidth loading={loading}>
                  Sign In
                </Button>

                <Text ta="center" size="sm" c="dimmed">
                  Don&apos;t have an account?{' '}
                  <Anchor component={Link} to="/sign-up">
                    Sign up
                  </Anchor>
                </Text>
              </Stack>
            </form>
          </Stack>
        </Paper>
      </Container>
    </Box>
  )
}
