import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#003366",
      light: "#005C99",
      dark: "#001A33",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#B3FF00",
      light: "#CCFF33",
      dark: "#80B300",
      contrastText: "#000000",
    },
    background: {
      default: "#F5F7F9",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1A1A1A",
      secondary: "#555555",
    },
    info: {
      main: "#FFC107",
    },
  },
  typography: {
    fontFamily: [
      "Inter",
      "-apple-system",
      "BlinkMacSystemFont",
      "Segoe UI",
      "Roboto",
      "Arial",
      "sans-serif",
    ].join(","),
    h4: {
      fontWeight: 600,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "10px 20px",
        },
        containedSecondary: {
          "&:hover": {
            backgroundColor: "#80B300",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: "#003366",
        },
      },
    },
  },
});

export default theme;
