import CloudQueueIcon from '@mui/icons-material/CloudQueue'
import HubIcon from '@mui/icons-material/Hub'
import LogoutIcon from '@mui/icons-material/Logout'
import { AppBar, Box, Button, Container, Stack, Toolbar, Typography } from '@mui/material'
import { useState } from 'react'
import { EmptyState } from '../components/EmptyState'
import { ContactsSection } from '../features/contacts/ContactsSection'
import { ConnectionsSection } from '../features/connections/ConnectionsSection'
import { MessagesSection } from '../features/messages/MessagesSection'
import { useAuth } from '../features/auth/useAuth'
import type { Connection } from '../types/connection'

export function DashboardPage() {
  const { signOutUser, user } = useAuth()
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null)
  const userName = user?.displayName || user?.email || 'usuário'

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
          <Typography component="h2" variant="h4" className="mt-4">
            Olá, {userName}
          </Typography>

          {user ? (
            <>
              <ConnectionsSection
                onSelectConnection={setSelectedConnection}
                selectedConnectionId={selectedConnection?.id ?? ''}
                userId={user.uid}
              />

              {selectedConnection ? (
                <>
                  <ContactsSection
                    connection={selectedConnection}
                    key={selectedConnection.id}
                    userId={user.uid}
                  />
                  <MessagesSection
                    connection={selectedConnection}
                    key={`${selectedConnection.id}-messages`}
                    userId={user.uid}
                  />
                </>
              ) : (
                <EmptyState
                  className="bg-white"
                  description="Escolha uma conexão para gerenciar contatos e mensagens."
                  icon={<HubIcon color="primary" fontSize="large" />}
                  title="Selecione uma conexão"
                />
              )}
            </>
          ) : null}
        </Stack>
      </Container>
    </Box>
  )
}
