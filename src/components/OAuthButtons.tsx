import { useState } from "react";
import type  { Provider } from "@supabase/supabase-js";
import { Button, Stack, Text } from "@mantine/core";
import { signInWithProvider } from "../lib/oauth";

const PROVIDERS = [
    {
        name: "Google",
        icon: "https://www.google.com/favicon.ico",
        provider: "google" as Provider,
        label: "Continue with Google",
    },
    {
        name: "GitHub",
        icon: "https://github.com/favicon.ico",
        provider: "github" as Provider,
        label: "Continue with GitHub",
    },

]

export function OAuthButtons() {
    const [loading, setLoading] = useState<Provider | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleOAuth = async (provider: Provider) => {
        setLoading(provider);
        setError(null);

        try{
            await signInWithProvider(provider);
        } catch (err) {
            setLoading(null);
            setError(err instanceof Error ? err.message : "Sign in failed");
        }
    }

    return (
        <Stack gap="sm">
          {PROVIDERS.map(({ provider, label }) => (
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