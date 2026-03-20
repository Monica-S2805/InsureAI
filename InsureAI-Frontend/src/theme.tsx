import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark', // dark theme for admin dashboard
    primary: { main: '#1976d2' }, // blue
    secondary: { main: '#278eb0' }, // purple
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

export default theme;
