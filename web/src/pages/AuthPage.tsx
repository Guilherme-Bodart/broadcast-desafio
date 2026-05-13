import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import LoginIcon from '@mui/icons-material/Login'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { FirebaseError } from 'firebase/app'
import { useState, type FormEvent } from 'react'
import { Link as RouterLink, Navigate, useLocation, useNavigate } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Container,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useAuth } from '../features/auth/useAuth'

type AuthMode = 'login' | 'signup'

type AuthPageProps = {
  mode: AuthMode
}

type LocationState = {
  from?: {
    pathname?: string
  }
}

const authCopy = {
  login: {
    title: 'Entrar no Broadcast',
    description: 'Acesse sua área para gerenciar conexões, contatos e mensagens.',
    action: 'Entrar',
    helper: 'Ainda não tem uma conta?',
    linkLabel: 'Criar conta',
    linkTo: '/cadastro',
  },
  signup: {
    title: 'Criar conta',
    description: 'Cadastre-se para começar a organizar seus disparos fake.',
    action: 'Criar conta',
    helper: 'Já tem uma conta?',
    linkLabel: 'Entrar',
    linkTo: '/login',
  },
}

function getAuthErrorMessage(error: unknown) {
  if (!(error instanceof FirebaseError)) {
    return 'Não foi possível concluir a ação. Tente novamente.'
  }

  const messages: Record<string, string> = {
    'auth/email-already-in-use': 'Este e-mail já está em uso.',
    'auth/invalid-credential': 'E-mail ou senha inválidos.',
    'auth/invalid-email': 'Informe um e-mail válido.',
    'auth/weak-password': 'A senha deve ter pelo menos 6 caracteres.',
  }

  return messages[error.code] ?? 'Não foi possível autenticar. Tente novamente.'
}

export function AuthPage({ mode }: AuthPageProps) {
  const { loading, signIn, signUp, user } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const copy = authCopy[mode]

  const from = (location.state as LocationState | null)?.from?.pathname ?? '/'

  if (!loading && user) {
    return <Navigate replace to="/" />
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError('')
    setSubmitting(true)

    try {
      if (mode === 'login') {
        await signIn(email, password)
        navigate(from, { replace: true })
        return
      }

      await signUp(email, password)
      navigate('/', { replace: true })
    } catch (error) {
      setFormError(getAuthErrorMessage(error))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Box className="grid min-h-screen place-items-center bg-slate-50 px-4 py-8">
      <Container maxWidth="xs">
        <Paper className="p-6" variant="outlined">
          <Stack spacing={3}>
            <Stack spacing={1.5} sx={{ alignItems: 'center', textAlign: 'center' }}>
              <Box className="grid h-12 w-12 place-items-center rounded bg-blue-50 text-blue-700">
                <LockOutlinedIcon />
              </Box>
              <Typography component="h1" variant="h5">
                {copy.title}
              </Typography>
              <Typography color="text.secondary">{copy.description}</Typography>
            </Stack>

            {formError ? <Alert severity="error">{formError}</Alert> : null}

            <Stack component="form" onSubmit={handleSubmit} spacing={2}>
              <TextField
                autoComplete="email"
                autoFocus
                fullWidth
                label="E-mail"
                onChange={(event) => setEmail(event.target.value)}
                required
                type="email"
                value={email}
              />
              <TextField
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                fullWidth
                label="Senha"
                onChange={(event) => setPassword(event.target.value)}
                required
                slotProps={{ htmlInput: { minLength: 6 } }}
                type="password"
                value={password}
              />
              <Button
                disabled={submitting}
                startIcon={mode === 'login' ? <LoginIcon /> : <PersonAddIcon />}
                type="submit"
                variant="contained"
              >
                {submitting ? 'Aguarde...' : copy.action}
              </Button>
            </Stack>

            <Typography color="text.secondary" sx={{ textAlign: 'center' }}>
              {copy.helper}{' '}
              <Link component={RouterLink} to={copy.linkTo}>
                {copy.linkLabel}
              </Link>
            </Typography>
          </Stack>
        </Paper>
      </Container>
    </Box>
  )
}
