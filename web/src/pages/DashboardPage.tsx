import CloudQueueIcon from '@mui/icons-material/CloudQueue'
import DashboardIcon from '@mui/icons-material/Dashboard'
import LogoutIcon from '@mui/icons-material/Logout'
import { AppBar, Box, Button, Chip, Container, Stack, Toolbar, Typography } from '@mui/material'
import { useState } from 'react'
import { ContactsSection } from '../features/contacts/ContactsSection'
import { ConnectionsSection } from '../features/connections/ConnectionsSection'
import { useAuth } from '../features/auth/useAuth'
import type { Connection } from '../types/connection'

export function DashboardPage() {
  const { signOutUser, user } = useAuth()
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null)

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

          {user ? (
            <>
              <ConnectionsSection
                onSelectConnection={setSelectedConnection}
                selectedConnectionId={selectedConnection?.id ?? ''}
                userId={user.uid}
              />

              {selectedConnection ? (
                <ContactsSection
                  connection={selectedConnection}
                  key={selectedConnection.id}
                  userId={user.uid}
                />
              ) : (
                <Box className="rounded border border-dashed border-slate-300 bg-white p-6">
                  <Typography component="h3" variant="h6">
                    Selecione uma conexão
                  </Typography>
                  <Typography color="text.secondary">
                    Escolha uma conexão acima para gerenciar os contatos dela.
                  </Typography>
                </Box>
              )}
            </>
          ) : null}
        </Stack>
      </Container>
    </Box>
  )
}
