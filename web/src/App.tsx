import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthPage } from './pages/AuthPage'
import { DashboardPage } from './pages/DashboardPage'
import { ProtectedRoute } from './routes/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route element={<AuthPage mode="login" />} path="/login" />
      <Route element={<AuthPage mode="signup" />} path="/cadastro" />
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardPage />} path="/" />
      </Route>
      <Route element={<Navigate replace to="/" />} path="*" />
    </Routes>
  )
}

export default App
