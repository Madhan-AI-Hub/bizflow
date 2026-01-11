import { createTheme } from '@mui/material/styles';

// MongoDB Atlas Color Palette
const colors = {
  primary: '#00ED64', // MongoDB Bright Green
  secondary: '#00684A', // MongoDB Forest Green
  dark: '#001E2B', // MongoDB Deep Navy
  border: '#E8EDEB',
  darkBorder: 'rgba(255, 255, 255, 0.1)',
  error: '#FF0000',
  warning: '#FFC800',
  success: '#00ED64',
  light: {
    background: '#F9FBFA',
    paper: '#FFFFFF',
    text: '#001E2B',
    textSecondary: '#5C6B75'
  },
  darkTheme: {
    background: '#001E2B',
    paper: '#092230',
    text: '#FFFFFF',
    textSecondary: '#C1C7CD'
  }
};

// Create light theme
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: colors.primary,
      contrastText: colors.dark
    },
    secondary: {
      main: colors.secondary
    },
    background: {
      default: colors.light.background,
      paper: colors.light.paper
    },
    text: {
      primary: colors.light.text,
      secondary: colors.light.textSecondary
    },
    divider: colors.border
  },
  typography: {
    fontFamily: '"Inter", "Euclid Circular A", "System-ui", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '3.5rem',
      letterSpacing: '-0.02em',
      color: colors.dark
    },
    h2: {
      fontWeight: 700,
      fontSize: '2.5rem',
      letterSpacing: '-0.01em'
    },
    h3: {
      fontWeight: 600,
      fontSize: '2rem'
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem'
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem'
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem'
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6
    },
    button: {
      textTransform: 'none',
      fontWeight: 600
    }
  },
  shape: {
    borderRadius: 6
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          padding: '8px 20px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none'
          }
        },
        containedPrimary: {
          backgroundColor: colors.primary,
          color: colors.dark,
          border: `1px solid ${colors.primary}`,
          '&:hover': {
            backgroundColor: '#00DA5C',
            borderColor: '#00DA5C'
          }
        },
        outlinedPrimary: {
          borderColor: colors.dark,
          color: colors.dark,
          '&:hover': {
            backgroundColor: 'rgba(0, 30, 43, 0.04)',
            borderColor: colors.dark
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 12,
          border: `1px solid ${theme.palette.mode === 'light' ? colors.border : colors.darkBorder}`,
          boxShadow: 'none',
          backgroundColor: theme.palette.mode === 'light' ? colors.light.paper : colors.darkTheme.paper,
          backgroundImage: 'none'
        })
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none'
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: ({ theme }) => ({
          '& .MuiOutlinedInput-root': {
            borderRadius: 6,
            backgroundColor: theme.palette.mode === 'light' ? '#FFFFFF' : '#001E2B',
            '& fieldset': {
              borderColor: theme.palette.mode === 'light' ? colors.border : colors.darkBorder
            },
            '&:hover fieldset': {
              borderColor: colors.primary
            },
            '&.Mui-focused fieldset': {
              borderColor: colors.primary
            }
          }
        })
      }
    },
    MuiAppBar: {
        styleOverrides: {
            root: ({ theme }) => ({
                backgroundColor: theme.palette.mode === 'light' ? '#FFFFFF' : '#001E2B',
                borderBottom: `1px solid ${theme.palette.mode === 'light' ? colors.border : colors.darkBorder}`,
                boxShadow: 'none',
                color: theme.palette.mode === 'light' ? colors.dark : '#FFFFFF'
            })
        }
    },
    MuiDialog: {
        styleOverrides: {
            paper: ({ theme }) => ({
                borderRadius: 12,
                backgroundImage: 'none',
                backgroundColor: theme.palette.mode === 'light' ? '#FFFFFF' : colors.darkTheme.paper,
                border: `1px solid ${theme.palette.mode === 'light' ? colors.border : colors.darkBorder}`
            })
        }
    },
    MuiTableCell: {
        styleOverrides: {
            head: ({ theme }) => ({
                fontWeight: 700,
                backgroundColor: theme.palette.mode === 'light' ? '#F9FBFA' : 'rgba(255,255,255,0.02)',
                color: theme.palette.text.primary,
                borderBottom: `1px solid ${theme.palette.mode === 'light' ? colors.border : colors.darkBorder}`
            }),
            root: ({ theme }) => ({
                borderBottom: `1px solid ${theme.palette.mode === 'light' ? colors.border : colors.darkBorder}`
            })
        }
    },
    MuiChip: {
        styleOverrides: {
            root: {
                borderRadius: 6,
                fontWeight: 600
            }
        }
    }
  }
});

// Create dark theme
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: colors.primary,
      contrastText: colors.dark
    },
    secondary: {
      main: colors.primary
    },
    background: {
      default: colors.darkTheme.background,
      paper: colors.darkTheme.paper
    },
    text: {
      primary: colors.darkTheme.text,
      secondary: colors.darkTheme.textSecondary
    },
    divider: colors.darkBorder
  },
  typography: lightTheme.typography,
  shape: lightTheme.shape,
  components: {
    ...lightTheme.components,
    MuiButton: {
      ...lightTheme.components.MuiButton,
      styleOverrides: {
        ...lightTheme.components.MuiButton.styleOverrides,
        outlinedPrimary: {
          borderColor: colors.primary,
          color: colors.primary,
          '&:hover': {
            backgroundColor: 'rgba(0, 237, 100, 0.08)',
            borderColor: colors.primary
          }
        }
      }
    }
  }
});
