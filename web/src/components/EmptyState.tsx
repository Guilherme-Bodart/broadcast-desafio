import { Box, Typography } from '@mui/material'
import type { ReactNode } from 'react'

type EmptyStateProps = {
  description: string
  icon: ReactNode
  title: string
  className?: string
}

export function EmptyState({ className, description, icon, title }: EmptyStateProps) {
  const classes = [
    'flex min-h-48 flex-col items-center justify-center rounded border border-dashed border-slate-300 bg-slate-50 p-8 text-center',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Box className={classes}>
      {icon}
      <Typography component="p" variant="h6" className="mt-3 w-full">
        {title}
      </Typography>
      <Typography color="text.secondary" className="mx-auto mt-1 w-full max-w-md">
        {description}
      </Typography>
    </Box>
  )
}
