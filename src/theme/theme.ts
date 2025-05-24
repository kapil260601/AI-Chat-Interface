import { createTheme, ThemeOptions } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    customBackground: {
      sidebar: string;
      main: string;
      paper: string;
      input: string;
    };
    customBorder: {
      main: string;
      light: string;
      dark: string;
    };
  }
  interface PaletteOptions {
    customBackground?: {
      sidebar?: string;
      main?: string;
      paper?: string;
      input?: string;
    };
    customBorder?: {
      main?: string;
      light?: string;
      dark?: string;
    };
  }
}

export const getThemeOptions = (mode: 'light' | 'dark'): ThemeOptions => {
  return {
    palette: {
      mode,
      primary: {
        main: '#2563EB',
        light: '#60A5FA',
        dark: '#1E40AF',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#7C3AED',
        light: '#A78BFA',
        dark: '#5B21B6',
        contrastText: '#ffffff',
      },
      success: {
        main: '#10B981',
        light: '#34D399',
        dark: '#059669',
      },
      warning: {
        main: '#F59E0B',
        light: '#FBBF24',
        dark: '#D97706',
      },
      error: {
        main: '#EF4444',
        light: '#F87171',
        dark: '#B91C1C',
      },
      info: {
        main: '#0D9488',
        light: '#2DD4BF',
        dark: '#0F766E',
      },
      ...(mode === 'light'
        ? {
            background: {
              default: '#F9FAFB',
              paper: '#FFFFFF',
            },
            customBackground: {
              sidebar: '#F3F4F6',
              main: '#F9FAFB',
              paper: '#FFFFFF',
              input: '#F3F4F6',
            },
            customBorder: {
              main: '#E5E7EB',
              light: '#F3F4F6',
              dark: '#D1D5DB',
            },
            text: {
              primary: '#111827',
              secondary: '#4B5563',
            },
          }
        : {
            background: {
              default: '#111827',
              paper: '#1F2937',
            },
            customBackground: {
              sidebar: '#1F2937',
              main: '#111827',
              paper: '#1F2937',
              input: '#374151',
            },
            customBorder: {
              main: '#374151',
              light: '#4B5563',
              dark: '#1F2937',
            },
            text: {
              primary: '#F9FAFB',
              secondary: '#D1D5DB',
            },
          }),
    },
    typography: {
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      h1: {
        fontSize: '2rem',
        fontWeight: 700,
      },
      h2: {
        fontSize: '1.5rem',
        fontWeight: 600,
      },
      h3: {
        fontSize: '1.25rem',
        fontWeight: 600,
      },
      h4: {
        fontSize: '1.125rem',
        fontWeight: 600,
      },
      h5: {
        fontSize: '1rem',
        fontWeight: 600,
      },
      h6: {
        fontSize: '0.875rem',
        fontWeight: 600,
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.5,
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.5,
      },
      button: {
        textTransform: 'none',
        fontWeight: 500,
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
            fontWeight: 500,
            padding: '8px 16px',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            },
          },
          containedPrimary: {
            '&:hover': {
              backgroundColor: mode === 'light' ? '#1D4ED8' : '#3B82F6',
            },
          },
          outlinedPrimary: {
            borderColor: mode === 'light' ? '#2563EB' : '#3B82F6',
            '&:hover': {
              backgroundColor: mode === 'light' ? 'rgba(37, 99, 235, 0.04)' : 'rgba(59, 130, 246, 0.08)',
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: mode === 'light' 
              ? '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
              : '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2)',
          },
        },
      },
      MuiListItem: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
    },
  };
};

export const lightTheme = createTheme(getThemeOptions('light'));
export const darkTheme = createTheme(getThemeOptions('dark'));

export default function getTheme(mode: 'light' | 'dark') {
  return mode === 'light' ? lightTheme : darkTheme;
}