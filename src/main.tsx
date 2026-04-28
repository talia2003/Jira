import '@mantine/core/styles.css'
import { MantineProvider, createTheme } from '@mantine/core'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

const theme = createTheme({
  fontFamily:
    'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
  defaultRadius: 'sm',
  primaryColor: 'gray',
  components: {
    Paper: {
      styles: {
        root: { borderColor: 'var(--mantine-color-gray-3)' },
      },
    },
    Card: {
      styles: {
        root: { borderColor: 'var(--mantine-color-gray-3)' },
      },
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <MantineProvider theme={theme}>
    <App />
  </MantineProvider>,
)
