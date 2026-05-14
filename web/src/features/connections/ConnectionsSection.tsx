import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import HubIcon from '@mui/icons-material/Hub'
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked'
import WifiTetheringIcon from '@mui/icons-material/WifiTethering'
import { useEffect, useState, type FormEvent } from 'react'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  LinearProgress,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import { ConfirmDeleteDialog } from '../../components/ConfirmDeleteDialog'
import { EmptyState } from '../../components/EmptyState'
import type { Connection } from '../../types/connection'
import { useConnections } from './useConnections'

type ConnectionsSectionProps = {
  onSelectConnection: (connection: Connection) => void
  selectedConnectionId: string
  userId: string
}

type DialogState =
  | {
      mode: 'create'
      connection: null
    }
  | {
      mode: 'edit'
      connection: Connection
    }
  | null

const formatDate = (connection: Connection) => {
  const date = connection.createdAt?.toDate?.()

  if (!date) {
    return 'Criada agora'
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date)
}

export function ConnectionsSection({
  onSelectConnection,
  selectedConnectionId,
  userId,
}: ConnectionsSectionProps) {
  const {
    connections,
    createConnection,
    deleteConnection,
    error,
    loading,
    updateConnection,
  } = useConnections(userId)
  const [dialogState, setDialogState] = useState<DialogState>(null)
  const [connectionName, setConnectionName] = useState('')
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState('')
  const [connectionToDelete, setConnectionToDelete] = useState<Connection | null>(null)

  const isDialogOpen = Boolean(dialogState)
  const dialogTitle =
    dialogState?.mode === 'edit' ? 'Editar conexão' : 'Nova conexão'

  useEffect(() => {
    if (connections.length === 0) {
      return
    }

    const selectedConnectionExists = connections.some(
      (connection) => connection.id === selectedConnectionId,
    )

    if (!selectedConnectionExists) {
      onSelectConnection(connections[0])
    }
  }, [connections, onSelectConnection, selectedConnectionId])

  function openCreateDialog() {
    setFormError('')
    setConnectionName('')
    setDialogState({ mode: 'create', connection: null })
  }

  function openEditDialog(connection: Connection) {
    setFormError('')
    setConnectionName(connection.name)
    setDialogState({ mode: 'edit', connection })
  }

  function closeDialog() {
    if (submitting) {
      return
    }

    setDialogState(null)
    setConnectionName('')
    setFormError('')
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const name = connectionName.trim()

    if (!name) {
      setFormError('Informe o nome da conexão.')
      return
    }

    setSubmitting(true)
    setFormError('')

    try {
      if (dialogState?.mode === 'edit') {
        await updateConnection(dialogState.connection.id, { name })
      } else {
        await createConnection({ name })
      }

      closeDialog()
    } catch (saveError) {
      const message =
        saveError instanceof Error
          ? saveError.message
          : 'Não foi possível salvar a conexão.'

      setFormError(message)
    } finally {
      setSubmitting(false)
    }
  }

  function closeDeleteDialog() {
    if (deletingId) {
      return
    }

    setConnectionToDelete(null)
  }

  async function handleDelete() {
    if (!connectionToDelete) {
      return
    }

    setDeletingId(connectionToDelete.id)

    try {
      await deleteConnection(connectionToDelete.id)
      setConnectionToDelete(null)
    } finally {
      setDeletingId('')
    }
  }

  return (
    <Paper className="overflow-hidden" variant="outlined">
      {loading ? <LinearProgress /> : null}

      <Box className="p-6">
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ alignItems: { sm: 'center' }, justifyContent: 'space-between' }}
        >
          <Box>
            <Typography component="h3" variant="h6">
              Conexões
            </Typography>
            <Typography color="text.secondary">
              Gerencie os canais deste cliente em tempo real.
            </Typography>
          </Box>

          <Button
            onClick={openCreateDialog}
            startIcon={<AddIcon />}
            variant="contained"
          >
            Nova conexão
          </Button>
        </Stack>

        {error ? (
          <Alert className="mt-4" severity="error">
            Não foi possível carregar as conexões: {error}
          </Alert>
        ) : null}

        {!loading && connections.length === 0 ? (
          <EmptyState
            className="mt-6"
            description="Crie uma conexão para organizar contatos e mensagens."
            icon={<WifiTetheringIcon color="primary" fontSize="large" />}
            title="Nenhuma conexão cadastrada"
          />
        ) : null}

        {connections.length > 0 ? (
          <Stack className="mt-5" spacing={1.5}>
            {connections.map((connection) => (
              <Box
                className="flex flex-col gap-3 rounded border bg-white p-4 transition sm:flex-row sm:items-center sm:justify-between"
                key={connection.id}
                onClick={() => onSelectConnection(connection)}
                role="button"
                sx={{
                  borderColor:
                    selectedConnectionId === connection.id ? 'primary.main' : 'divider',
                  cursor: 'pointer',
                }}
                tabIndex={0}
              >
                <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                  <Box className="grid h-10 w-10 place-items-center rounded bg-blue-50 text-blue-700">
                    {selectedConnectionId === connection.id ? (
                      <RadioButtonCheckedIcon />
                    ) : (
                      <HubIcon />
                    )}
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 600 }}>
                      {connection.name}
                    </Typography>
                    <Typography color="text.secondary" variant="body2">
                      {formatDate(connection)}
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={1}>
                  <Tooltip title="Editar">
                    <IconButton
                      aria-label={`Editar ${connection.name}`}
                      onClick={(event) => {
                        event.stopPropagation()
                        openEditDialog(connection)
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Excluir">
                    <IconButton
                      aria-label={`Excluir ${connection.name}`}
                      color="error"
                      disabled={deletingId === connection.id}
                      onClick={(event) => {
                        event.stopPropagation()
                        setConnectionToDelete(connection)
                      }}
                    >
                      {deletingId === connection.id ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : (
                        <DeleteIcon />
                      )}
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Box>
            ))}
          </Stack>
        ) : null}
      </Box>

      <Dialog fullWidth maxWidth="xs" onClose={closeDialog} open={isDialogOpen}>
        <Stack component="form" onSubmit={handleSubmit}>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ pt: 1 }}>
              {formError ? <Alert severity="error">{formError}</Alert> : null}
              <TextField
                autoFocus
                fullWidth
                label="Nome"
                onChange={(event) => setConnectionName(event.target.value)}
                required
                value={connectionName}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button disabled={submitting} onClick={closeDialog}>
              Cancelar
            </Button>
            <Button disabled={submitting} type="submit" variant="contained">
              {submitting ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogActions>
        </Stack>
      </Dialog>

      <ConfirmDeleteDialog
        description={
          connectionToDelete
            ? `A conexão "${connectionToDelete.name}" será excluída permanentemente. Essa ação não pode ser desfeita.`
            : ''
        }
        loading={Boolean(connectionToDelete && deletingId === connectionToDelete.id)}
        onClose={closeDeleteDialog}
        onConfirm={() => void handleDelete()}
        open={Boolean(connectionToDelete)}
        title="Excluir conexão"
      />
    </Paper>
  )
}
