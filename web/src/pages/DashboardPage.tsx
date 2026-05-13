import CloudQueueIcon from '@mui/icons-material/CloudQueue'
import DashboardIcon from '@mui/icons-material/Dashboard'
import LogoutIcon from '@mui/icons-material/Logout'
import {
  AppBar,
  Box,
  Button,
  Chip,
  Container,
  Paper,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material'
import { useAuth } from '../features/auth/useAuth'

const nextFeatures = [
  'CRUD de conexões em tempo real',
  'Contatos por conexão',
  'Mensagens enviadas e agendadas',
]

export function DashboardPage() {
  const { signOutUser, user } = useAuth()

  return (
    <Box className="min-h-screen bg-slate-50">
      <AppBar color="inherit" elevation={0} position="static">
        <Toolbar className="border-b border-slate-200">
          <Stack
            direction="row"
            spacing={1}
            sx={{ alignItems: 'center', flexGrow: 1 }}
          >
            <CloudQueueIcon color="primary" />
            <Typography component="h1" variant="h6">
              Broadcast
            </Typography>
          </Stack>
          <Button onClick={signOutUser} startIcon={<LogoutIcon />} variant="outlined">
            Sair
          </Button>
        </Toolbar>
      </AppBar>

      <Container className="py-8" maxWidth="lg">
        <Stack spacing={3}>
          <Box>
            <Chip color="primary" icon={<DashboardIcon />} label="Área autenticada" />
            <Typography component="h2" variant="h4" className="mt-4">
              Olá, {user?.email}
            </Typography>
            <Typography color="text.secondary" className="mt-2 max-w-2xl">
              A sessão protegida está funcionando. Agora o projeto pode receber os
              módulos de conexões, contatos e mensagens com isolamento por usuário.
            </Typography>
          </Box>

          <Paper className="p-6" variant="outlined">
            <Typography component="h3" variant="h6">
              Próximas entregas
            </Typography>
            <Stack className="mt-4" spacing={1.5}>
              {nextFeatures.map((feature) => (
                <Box
                  className="rounded border border-slate-200 bg-white px-4 py-3"
                  key={feature}
                >
                  <Typography>{feature}</Typography>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </Box>
  )
}
