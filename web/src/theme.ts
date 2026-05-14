import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#155eef',
    },
    secondary: {
      main: '#0f766e',
    },
    background: {
      default: '#f7f8fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#171923',
      secondary: '#5f6b7a',
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      letterSpacing: 0,
    },
    h2: {
      fontWeight: 700,
      letterSpacing: 0,
    },
    h3: {
      fontWeight: 700,
      letterSpacing: 0,
    },
    button: {
      fontWeight: 600,
      letterSpacing: 0,
      textTransform: 'none',
    },
  },
  components: {
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          '& .MuiChip-icon': {
            fontSize: 18,
            marginLeft: 8,
            marginRight: -2,
          },
          '& .MuiChip-label': {
            paddingLeft: 8,
            paddingRight: 10,
          },
          '&.MuiChip-sizeSmall': {
            height: 28,
          },
          '&.MuiChip-sizeSmall .MuiChip-icon': {
            fontSize: 17,
            marginLeft: 8,
            marginRight: -2,
          },
          '&.MuiChip-sizeSmall .MuiChip-label': {
            paddingLeft: 8,
            paddingRight: 10,
          },
        },
      },
    },
  },
})
