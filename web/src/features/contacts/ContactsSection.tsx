import AddIcon from '@mui/icons-material/Add'
import ContactsIcon from '@mui/icons-material/Contacts'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import PhoneIcon from '@mui/icons-material/Phone'
import { useState, type FormEvent } from 'react'
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
import type { Contact } from '../../types/contact'
import type { Connection } from '../../types/connection'
import { useContacts } from './useContacts'

type ContactsSectionProps = {
  connection: Connection
  userId: string
}

type DialogState =
  | {
      mode: 'create'
      contact: null
    }
  | {
      mode: 'edit'
      contact: Contact
    }
  | null

const phoneDigitsLength = 11

const getPhoneDigits = (value: string) =>
  value.replace(/\D/g, '').slice(0, phoneDigitsLength)

const formatPhone = (value: string) => {
  const digits = getPhoneDigits(value)

  if (!digits) {
    return ''
  }

  if (digits.length <= 2) {
    return `(${digits}`
  }

  if (digits.length <= 7) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

export function ContactsSection({ connection, userId }: ContactsSectionProps) {
  const { contacts, createContact, deleteContact, error, loading, updateContact } =
    useContacts(userId, connection.id)
  const [dialogState, setDialogState] = useState<DialogState>(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState('')
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null)

  const isDialogOpen = Boolean(dialogState)
  const dialogTitle = dialogState?.mode === 'edit' ? 'Editar contato' : 'Novo contato'

  function openCreateDialog() {
    setFormError('')
    setName('')
    setPhone('')
    setDialogState({ mode: 'create', contact: null })
  }

  function openEditDialog(contact: Contact) {
    setFormError('')
    setName(contact.name)
    setPhone(formatPhone(contact.phone))
    setDialogState({ mode: 'edit', contact })
  }

  function closeDialog() {
    if (submitting) {
      return
    }

    setDialogState(null)
    setName('')
    setPhone('')
    setFormError('')
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const contactName = name.trim()
    const contactPhone = formatPhone(phone)

    if (!contactName) {
      setFormError('Informe o nome do contato.')
      return
    }

    if (getPhoneDigits(contactPhone).length !== phoneDigitsLength) {
      setFormError('Informe DDD e 9 dígitos.')
      return
    }

    setSubmitting(true)
    setFormError('')

    try {
      if (dialogState?.mode === 'edit') {
        await updateContact(dialogState.contact.id, {
          name: contactName,
          phone: contactPhone,
        })
      } else {
        await createContact({
          name: contactName,
          phone: contactPhone,
        })
      }

      closeDialog()
    } catch {
      setFormError('Não foi possível salvar o contato.')
    } finally {
      setSubmitting(false)
    }
  }

  function closeDeleteDialog() {
    if (deletingId) {
      return
    }

    setContactToDelete(null)
  }

  async function handleDelete() {
    if (!contactToDelete) {
      return
    }

    setDeletingId(contactToDelete.id)

    try {
      await deleteContact(contactToDelete.id)
      setContactToDelete(null)
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
              Contatos
            </Typography>
            <Typography color="text.secondary">
              Contatos da conexão {connection.name}.
            </Typography>
          </Box>

          <Button
            onClick={openCreateDialog}
            startIcon={<AddIcon />}
            variant="contained"
          >
            Novo contato
          </Button>
        </Stack>

        {error ? (
          <Alert className="mt-4" severity="error">
            Não foi possível carregar os contatos.
          </Alert>
        ) : null}

        {!loading && contacts.length === 0 ? (
          <EmptyState
            className="mt-6"
            description="Adicione contatos para selecionar destinatários nas mensagens."
            icon={<PersonAddIcon color="primary" fontSize="large" />}
            title="Nenhum contato cadastrado"
          />
        ) : null}

        {contacts.length > 0 ? (
          <Stack className="mt-5" spacing={1.5}>
            {contacts.map((contact) => (
              <Box
                className="flex flex-col gap-3 rounded border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
                key={contact.id}
              >
                <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                  <Box className="grid h-10 w-10 place-items-center rounded bg-teal-50 text-teal-700">
                    <ContactsIcon />
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 600 }}>{contact.name}</Typography>
                    <Stack
                      direction="row"
                      spacing={0.75}
                      sx={{ alignItems: 'center', color: 'text.secondary' }}
                    >
                      <PhoneIcon fontSize="small" />
                      <Typography color="text.secondary" variant="body2">
                        {formatPhone(contact.phone)}
                      </Typography>
                    </Stack>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={1}>
                  <Tooltip title="Editar">
                    <IconButton
                      aria-label={`Editar ${contact.name}`}
                      onClick={() => openEditDialog(contact)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Excluir">
                    <IconButton
                      aria-label={`Excluir ${contact.name}`}
                      color="error"
                      disabled={deletingId === contact.id}
                      onClick={() => setContactToDelete(contact)}
                    >
                      {deletingId === contact.id ? (
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
                onChange={(event) => setName(event.target.value)}
                required
                value={name}
              />
              <TextField
                fullWidth
                label="Telefone"
                onChange={(event) => setPhone(formatPhone(event.target.value))}
                placeholder="(11) 99999-9999"
                required
                slotProps={{
                  htmlInput: {
                    inputMode: 'numeric',
                    maxLength: 15,
                  },
                }}
                value={phone}
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
          contactToDelete
            ? `O contato "${contactToDelete.name}" será excluído permanentemente. Essa ação não pode ser desfeita.`
            : ''
        }
        loading={Boolean(contactToDelete && deletingId === contactToDelete.id)}
        onClose={closeDeleteDialog}
        onConfirm={() => void handleDelete()}
        open={Boolean(contactToDelete)}
        title="Excluir contato"
      />
    </Paper>
  )
}
