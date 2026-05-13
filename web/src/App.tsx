import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined'
import CloudQueueIcon from '@mui/icons-material/CloudQueue'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import SendOutlinedIcon from '@mui/icons-material/SendOutlined'
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Paper,
  Stack,
  Typography,
} from '@mui/material'

function App() {
  const setupItems = [
    'Firebase SDK configurado',
    'Material UI instalado',
    'Tailwind CSS ativo',
  ]

  return (
    <Box className="min-h-screen bg-slate-50 py-8">
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <Box>
            <Chip
              color="primary"
              icon={<CloudQueueIcon />}
              label="Ambiente configurado"
              variant="outlined"
            />
            <Typography component="h1" variant="h3" className="mt-4">
              Broadcast
            </Typography>
            <Typography color="text.secondary" className="mt-2 max-w-2xl">
              Base do SaaS pronta para autenticação, conexões, contatos e
              mensagens em tempo real.
            </Typography>
          </Box>

          <Paper variant="outlined" className="p-6">
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              divider={<Divider flexItem orientation="vertical" />}
              spacing={3}
            >
              <Stack spacing={2} sx={{ flex: 1 }}>
                <LockOutlinedIcon color="primary" />
                <Typography component="h2" variant="h6">
                  Próximo passo: autenticação
                </Typography>
                <Typography color="text.secondary">
                  O commit seguinte cria login, cadastro, logout e rotas
                  protegidas usando Firebase Auth.
                </Typography>
                <Button startIcon={<SendOutlinedIcon />} variant="contained">
                  Preparado para continuar
                </Button>
              </Stack>

              <Stack spacing={1.5} sx={{ flex: 1 }}>
                {setupItems.map((item) => (
                  <Box
                    className="flex items-center gap-2"
                    component="div"
                    key={item}
                  >
                    <CheckCircleOutlinedIcon color="success" fontSize="small" />
                    <Typography>{item}</Typography>
                  </Box>
                ))}
              </Stack>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </Box>
  )
}

export default App
