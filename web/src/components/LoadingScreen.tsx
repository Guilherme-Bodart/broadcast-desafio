import CloudQueueIcon from '@mui/icons-material/CloudQueue'
import { Box, CircularProgress, Stack, Typography } from '@mui/material'

export function LoadingScreen() {
  return (
    <Box className="grid min-h-screen place-items-center bg-slate-50 p-6">
      <Stack spacing={2} sx={{ alignItems: 'center' }}>
        <CloudQueueIcon color="primary" fontSize="large" />
        <CircularProgress size={28} />
        <Typography color="text.secondary">Carregando sessão...</Typography>
      </Stack>
    </Box>
  )
}
