import { createBrowserRouter } from 'react-router-dom'
import { ProtectedRoute } from './components/ProtectedRoute'
import { RootRedirect } from './components/RootRedirect'
import { HomePage } from './pages/HomePage'
import { BoardPage } from './pages/BoardPage'
import { SignInPage } from './pages/SignInPage'
import { SignUpPage } from './pages/SignUpPage'
import { AuthCallbackPage } from './pages/AuthCallbackPage'

export const router = createBrowserRouter([
  { path: '/', element: <RootRedirect /> },
  { path: '/sign-in', element: <SignInPage /> },
  { path: '/sign-up', element: <SignUpPage /> },
  { path: '/auth/callback', element: <AuthCallbackPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      { path: '/boards', element: <HomePage /> },
      { path: '/board/:boardId', element: <BoardPage /> },
    ],
  },
])
