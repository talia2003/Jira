import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { BoardPage } from './pages/BoardPage'
import { SignInPage } from './pages/SignInPage'
import { SignUpPage } from './pages/SignUpPage.tsx'
import { AuthCallbackPage } from './pages/AuthCallbackPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/board/:boardId" element={<BoardPage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App