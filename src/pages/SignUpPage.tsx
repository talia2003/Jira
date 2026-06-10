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

export function SignUpPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    if (data.session) {
      navigate('/')
      return
    }

    setMessage('Please check your email to confirm your account, then sign in.')
  }

  return (
    <Box bg="white" mih="100vh" py="md">
      <Container size="xs">
        <Title order={2} ta="center" mb="md">
          Sign Up
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
                  minLength={6}
                  autoComplete="new-password"
                />

                {error && (
                  <Text c="red" size="sm">
                    {error}
                  </Text>
                )}

                {message && (
                  <Text c="green" size="sm">
                    {message}
                  </Text>
                )}

                <Button type="submit" fullWidth loading={loading}>
                  Create Account
                </Button>

                <Text ta="center" size="sm" c="dimmed">
                  Already have an account?{' '}
                  <Anchor component={Link} to="/sign-in">
                    Sign in
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
