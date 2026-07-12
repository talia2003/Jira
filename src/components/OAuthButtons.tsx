import { useState } from 'react'
import type { Provider } from '@supabase/supabase-js'
import { Button, Stack, Text } from '@mantine/core'
import { OAUTH_PROVIDERS } from '../constants'
import { signInWithProvider } from '../lib/oauth'

export function OAuthButtons() {
  const [loading, setLoading] = useState<Provider | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleOAuth = async (provider: Provider) => {
    setLoading(provider)
    setError(null)

    try {
      await signInWithProvider(provider)
    } catch (err) {
      setLoading(null)
      setError(err instanceof Error ? err.message : 'Sign in failed')
    }
  }

  return (
    <Stack gap="sm">
      {OAUTH_PROVIDERS.map(({ provider, label }) => (
        <Button
          key={provider}
          variant="default"
          fullWidth
          loading={loading === provider}
          onClick={() => void handleOAuth(provider)}
        >
          {label}
        </Button>
      ))}
      {error && (
        <Text c="red" size="sm" ta="center">
          {error}
        </Text>
      )}
    </Stack>
  )
}
