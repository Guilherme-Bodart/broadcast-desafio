import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import EventIcon from '@mui/icons-material/Event'
import MessageIcon from '@mui/icons-material/Message'
import ScheduleIcon from '@mui/icons-material/Schedule'
import SendIcon from '@mui/icons-material/Send'
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  LinearProgress,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
  type SelectChangeEvent,
} from '@mui/material'
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { useContacts } from '../contacts/useContacts'
import { markMessageAsSent } from '../../services/messages'
import type { Connection } from '../../types/connection'
import type { Message, MessageStatus } from '../../types/message'
import { useMessages } from './useMessages'

type MessagesSectionProps = {
  connection: Connection
  userId: string
}

type DialogState =
  | {
      mode: 'create'
      message: null
    }
  | {
      mode: 'edit'
      message: Message
    }
  | null

type MessageFilter = 'all' | MessageStatus

const toDateTimeLocal = (date: Date) => {
  const timezoneOffset = date.getTimezoneOffset() * 60000
  const localDate = new Date(date.getTime() - timezoneOffset)

  return localDate.toISOString().slice(0, 16)
}

const formatTimestamp = (value: Message['createdAt'] | null) => {
  const date = value?.toDate?.()

  if (!date) {
    return 'Agora'
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date)
}

const getMessageCounterText = (count: number) =>
  count === 1 ? '1 mensagem' : `${count} mensagens`

export function MessagesSection({ connection, userId }: MessagesSectionProps) {
  const {
    messages,
    createMessage,
    deleteMessage,
    error,
    loading,
    updateMessage,
  } = useMessages(userId, connection.id)
  const { contacts, loading: contactsLoading } = useContacts(userId, connection.id)
  const [filter, setFilter] = useState<MessageFilter>('all')
  const [dialogState, setDialogState] = useState<DialogState>(null)
  const [text, setText] = useState('')
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([])
  const [scheduleEnabled, setScheduleEnabled] = useState(false)
  const [scheduledAt, setScheduledAt] = useState('')
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState('')
  const processingDueMessageIds = useRef(new Set<string>())

  const contactNameById = useMemo(
    () => new Map(contacts.map((contact) => [contact.id, contact.name])),
    [contacts],
  )
  const filteredMessages = messages.filter((message) =>
    filter === 'all' ? true : message.status === filter,
  )
  const isDialogOpen = Boolean(dialogState)
  const dialogTitle =
    dialogState?.mode === 'edit' ? 'Editar mensagem' : 'Nova mensagem'

  useEffect(() => {
    const markDueMessagesAsSent = () => {
      const now = Date.now()
      const dueMessages = messages.filter((message) => {
        const scheduledTime = message.scheduledAt?.toMillis?.()

        return (
          message.status === 'scheduled' &&
          typeof scheduledTime === 'number' &&
          scheduledTime <= now &&
          !processingDueMessageIds.current.has(message.id)
        )
      })

      dueMessages.forEach((message) => {
        processingDueMessageIds.current.add(message.id)

        void markMessageAsSent(message.id).finally(() => {
          processingDueMessageIds.current.delete(message.id)
        })
      })
    }

    markDueMessagesAsSent()
    const intervalId = window.setInterval(markDueMessagesAsSent, 10000)

    return () => window.clearInterval(intervalId)
  }, [messages])

  function openCreateDialog() {
    setText('')
    setSelectedContactIds([])
    setScheduleEnabled(false)
    setScheduledAt('')
    setFormError('')
    setDialogState({ mode: 'create', message: null })
  }

  function openEditDialog(message: Message) {
    setText(message.text)
    setSelectedContactIds(message.contactIds)
    setScheduleEnabled(message.status === 'scheduled')
    setScheduledAt(
      message.scheduledAt ? toDateTimeLocal(message.scheduledAt.toDate()) : '',
    )
    setFormError('')
    setDialogState({ mode: 'edit', message })
  }

  function closeDialog() {
    if (submitting) {
      return
    }

    setDialogState(null)
    setText('')
    setSelectedContactIds([])
    setScheduleEnabled(false)
    setScheduledAt('')
    setFormError('')
  }

  function handleContactChange(event: SelectChangeEvent<string[]>) {
    const value = event.target.value
    setSelectedContactIds(typeof value === 'string' ? value.split(',') : value)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const messageText = text.trim()

    if (!messageText) {
      setFormError('Informe o texto da mensagem.')
      return
    }

    if (selectedContactIds.length === 0) {
      setFormError('Selecione pelo menos um contato.')
      return
    }

    const scheduledDate = scheduleEnabled ? new Date(scheduledAt) : null

    if (scheduleEnabled && (!scheduledAt || Number.isNaN(scheduledDate?.getTime()))) {
      setFormError('Informe uma data de agendamento válida.')
      return
    }

    if (scheduledDate && scheduledDate.getTime() <= Date.now()) {
      setFormError('Agende a mensagem para um horário futuro.')
      return
    }

    setSubmitting(true)
    setFormError('')

    try {
      const input = {
        contactIds: selectedContactIds,
        scheduledAt: scheduledDate,
        text: messageText,
      }

      if (dialogState?.mode === 'edit') {
        await updateMessage(dialogState.message.id, input)
      } else {
        await createMessage(input)
      }

      closeDialog()
    } catch {
      setFormError('Não foi possível salvar a mensagem.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(message: Message) {
    const shouldDelete = window.confirm(
      'Excluir esta mensagem? Essa ação não pode ser desfeita.',
    )

    if (!shouldDelete) {
      return
    }

    setDeletingId(message.id)

    try {
      await deleteMessage(message.id)
    } finally {
      setDeletingId('')
    }
  }

  return (
    <Paper className="overflow-hidden" variant="outlined">
      {loading || contactsLoading ? <LinearProgress /> : null}

      <Box className="p-6">
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          sx={{ alignItems: { md: 'center' }, justifyContent: 'space-between' }}
        >
          <Box>
            <Typography component="h3" variant="h6">
              Mensagens
            </Typography>
            <Typography color="text.secondary">
              Envie ou agende mensagens fake para contatos de {connection.name}.
            </Typography>
          </Box>

          <Button
            disabled={contacts.length === 0}
            onClick={openCreateDialog}
            startIcon={<AddIcon />}
            variant="contained"
          >
            Nova mensagem
          </Button>
        </Stack>

        <Stack
          className="mt-4"
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ alignItems: { sm: 'center' }, justifyContent: 'space-between' }}
        >
          <ToggleButtonGroup
            exclusive
            onChange={(_, value: MessageFilter | null) => {
              if (value) {
                setFilter(value)
              }
            }}
            size="small"
            value={filter}
          >
            <ToggleButton value="all">Todas</ToggleButton>
            <ToggleButton value="sent">Enviadas</ToggleButton>
            <ToggleButton value="scheduled">Agendadas</ToggleButton>
          </ToggleButtonGroup>

          <Typography color="text.secondary" variant="body2">
            {getMessageCounterText(filteredMessages.length)}
          </Typography>
        </Stack>

        {error ? (
          <Alert className="mt-4" severity="error">
            Não foi possível carregar as mensagens.
          </Alert>
        ) : null}

        {!contactsLoading && contacts.length === 0 ? (
          <Alert className="mt-4" severity="info">
            Cadastre contatos nesta conexão antes de criar mensagens.
          </Alert>
        ) : null}

        {!loading && filteredMessages.length === 0 ? (
          <Box className="mt-6 rounded border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <MessageIcon color="primary" fontSize="large" />
            <Typography component="p" variant="h6" className="mt-3">
              Nenhuma mensagem encontrada
            </Typography>
            <Typography color="text.secondary" className="mx-auto mt-1 max-w-md">
              Crie uma mensagem imediata ou agendada para os contatos selecionados.
            </Typography>
          </Box>
        ) : null}

        {filteredMessages.length > 0 ? (
          <Stack className="mt-5" spacing={1.5}>
            {filteredMessages.map((message) => (
              <Box
                className="flex flex-col gap-3 rounded border border-slate-200 bg-white p-4 sm:flex-row sm:items-start sm:justify-between"
                key={message.id}
              >
                <Stack spacing={1}>
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    <Chip
                      color={message.status === 'sent' ? 'success' : 'warning'}
                      icon={
                        message.status === 'sent' ? <SendIcon /> : <ScheduleIcon />
                      }
                      label={message.status === 'sent' ? 'Enviada' : 'Agendada'}
                      size="small"
                    />
                    <Typography color="text.secondary" variant="body2">
                      {message.status === 'sent'
                        ? formatTimestamp(message.sentAt)
                        : formatTimestamp(message.scheduledAt)}
                    </Typography>
                  </Stack>
                  <Typography className="max-w-3xl whitespace-pre-wrap">
                    {message.text}
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    Para:{' '}
                    {message.contactIds
                      .map((contactId) => contactNameById.get(contactId) ?? 'Contato removido')
                      .join(', ')}
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={1}>
                  <Tooltip title="Editar">
                    <IconButton
                      aria-label="Editar mensagem"
                      onClick={() => openEditDialog(message)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Excluir">
                    <IconButton
                      aria-label="Excluir mensagem"
                      color="error"
                      disabled={deletingId === message.id}
                      onClick={() => void handleDelete(message)}
                    >
                      {deletingId === message.id ? (
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

      <Dialog fullWidth maxWidth="sm" onClose={closeDialog} open={isDialogOpen}>
        <Stack component="form" onSubmit={handleSubmit}>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ pt: 1 }}>
              {formError ? <Alert severity="error">{formError}</Alert> : null}

              <FormControl fullWidth>
                <InputLabel id="message-contacts-label">Contatos</InputLabel>
                <Select
                  input={<OutlinedInput label="Contatos" />}
                  labelId="message-contacts-label"
                  multiple
                  onChange={handleContactChange}
                  renderValue={(selected) =>
                    selected
                      .map((contactId) => contactNameById.get(contactId) ?? contactId)
                      .join(', ')
                  }
                  value={selectedContactIds}
                >
                  {contacts.map((contact) => (
                    <MenuItem key={contact.id} value={contact.id}>
                      <Checkbox checked={selectedContactIds.includes(contact.id)} />
                      <ListItemText primary={contact.name} secondary={contact.phone} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Mensagem"
                minRows={4}
                multiline
                onChange={(event) => setText(event.target.value)}
                required
                value={text}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={scheduleEnabled}
                    onChange={(event) => setScheduleEnabled(event.target.checked)}
                  />
                }
                label="Agendar mensagem"
              />

              {scheduleEnabled ? (
                <TextField
                  fullWidth
                  label="Data e horário"
                  onChange={(event) => setScheduledAt(event.target.value)}
                  required
                  slotProps={{ inputLabel: { shrink: true } }}
                  type="datetime-local"
                  value={scheduledAt}
                />
              ) : (
                <Alert icon={<EventIcon />} severity="info">
                  Sem agendamento, a mensagem será marcada como enviada imediatamente.
                </Alert>
              )}
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
    </Paper>
  )
}
