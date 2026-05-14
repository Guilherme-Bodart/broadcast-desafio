import DeleteIcon from '@mui/icons-material/Delete'
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material'

type ConfirmDeleteDialogProps = {
  description: string
  loading: boolean
  open: boolean
  title: string
  onClose: () => void
  onConfirm: () => void
}

export function ConfirmDeleteDialog({
  description,
  loading,
  onClose,
  onConfirm,
  open,
  title,
}: ConfirmDeleteDialogProps) {
  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      onClose={loading ? undefined : onClose}
      open={open}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'flex-start', pt: 1 }}>
          <Box className="grid h-10 w-10 shrink-0 place-items-center rounded bg-red-50 text-red-700">
            <DeleteIcon />
          </Box>
          <Typography color="text.secondary">{description}</Typography>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button disabled={loading} onClick={onClose}>
          Cancelar
        </Button>
        <Button
          color="error"
          disabled={loading}
          onClick={onConfirm}
          startIcon={
            loading ? <CircularProgress color="inherit" size={16} /> : undefined
          }
          variant="contained"
        >
          {loading ? 'Excluindo...' : 'Excluir'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
