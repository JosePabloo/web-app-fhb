// FILE: src/app/theme.ts
// PURPOSE: Central MUI theme defining palette, typography, shape, and component defaults for consistent UI.
// NOTES: Consumed by AppProvider's ThemeProvider; responsiveFontSizes applied for scalable global typography.

import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { grey, blue, cyan, deepPurple } from '@mui/material/colors';

const lightPalette = {
  mode: 'light' as const,
  primary: { main: blue[700] },
  secondary: { main: cyan[500] },
  background: { default: grey[50] },
};

const darkPalette = {
  mode: 'dark' as const,
  primary: { main: deepPurple[300] },
  secondary: { main: cyan[300] },
  background: {
    default: '#0f1115',
    paper: '#161920',
  },
};

let theme = createTheme({
  palette: lightPalette,
  typography: {
    fontFamily: `'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif`,
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 500,
    },
    button: {
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiContainer: {
      defaultProps: {
        maxWidth: 'lg',
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          cursor: 'pointer',
        },
      },
    },
  },
});

theme = responsiveFontSizes(theme);

export default theme;
export { lightPalette, darkPalette };
